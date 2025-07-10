
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/firebase/server'; // Use server-side admin SDK
import { blockSuspiciousTraffic } from '@/ai/flows/block-suspicious-traffic';

// Helper to fetch route config from Firestore
const getRouteConfig = async (slug: string) => {
  try {
    const routesRef = db.collection('routes');
    const snapshot = await routesRef.where('slug', '==', slug).limit(1).get();

    if (snapshot.empty) {
      console.log(`[Firestore] No route found for slug: ${slug}`);
      return null;
    }

    const routeDoc = snapshot.docs[0];
    return { id: routeDoc.id, ...routeDoc.data() };
  } catch (error) {
    console.error(`[Firestore] Error fetching route config for slug ${slug}:`, error);
    return null;
  }
};

// Helper to send webhook notifications
const sendWebhookNotification = async (webhookUrl: string, reason: string, details: any) => {
    if (!webhookUrl) return;

    const payload = {
        username: "CloakDash Alert",
        avatar_url: "https://i.imgur.com/4M34hi2.png", // A generic shield icon
        embeds: [{
            title: "🚨 Alerta de Tráfego Suspeito",
            color: 15158332, // Red color
            fields: [
                { name: "Rota (Slug)", value: `/${details.slug}`, inline: true },
                { name: "IP do Visitante", value: details.ip, inline: true },
                { name: "País", value: details.country, inline: true },
                { name: "Motivo", value: reason, inline: false },
                { name: "User Agent", value: `\`\`\`${details.userAgent}\`\`\``, inline: false }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error(`[Webhook] Failed to send notification for slug ${details.slug}:`, error);
    }
}


export async function GET(request: NextRequest, { params }: { params: { slug:string } }) {
  const { slug } = params;
  
  const config = await getRouteConfig(slug);

  if (!config || !config.realUrl) {
    return new Response('Route not found or configured incorrectly', { status: 404 });
  }
  
  let redirectTo = Array.isArray(config.realUrl) && config.smartRotation ? config.realUrl[Math.floor(Math.random() * config.realUrl.length)] : config.realUrl;
  let decision = 'real' as 'real' | 'fake';
  let blockReason = '';

  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const country = request.geo?.country || 'unknown';
  const referer = request.headers.get('referer') || '';
  
  // --- Start of Decision Logic ---

  // 1. IP Rotation Redirect
  if (!blockReason && config.ipRotation) {
    const ipLogRef = db.collection('ip_logs').doc(`${slug}_${ip}`);
    const ipLog = await ipLogRef.get();
    const now = Date.now();
    const oneMinute = 60 * 1000;

    if (ipLog.exists) {
        const data = ipLog.data()!;
        const requests = (data.requests || []).filter((ts: number) => now - ts < oneMinute);
        if (requests.length > 10) { // More than 10 requests in 60s
             blockReason = `IP Rate Limit Exceeded: ${ip}`;
        }
        await ipLogRef.set({ requests: [...requests, now] });
    } else {
        await ipLogRef.set({ requests: [now] });
    }
  }
  
  // 2. Emergency mode has highest priority
  if (!blockReason && config.emergency) {
    blockReason = 'Emergency mode';
  }

  // 3. AI Mode Check
  if (!blockReason && config.aiMode) {
      try {
          const aiResult = await blockSuspiciousTraffic({ ip, userAgent, country, referer });
          if (aiResult.block) {
              blockReason = aiResult.reason || 'Blocked by AI';
          }
      } catch (error) {
          console.error(`[AI Check] Error for slug ${slug}:`, error);
          // Don't block if AI fails, proceed to other rules
      }
  }

  const userAgentLower = userAgent.toLowerCase();
  
  // 4. Heuristic check for bots (e.g., direct access without a referrer)
  if (!blockReason && !referer) {
      blockReason = 'No referer';
  }
  
  const blockedIps = Array.isArray(config.blockedIps) ? config.blockedIps : [];
  const blockedUserAgents = Array.isArray(config.blockedUserAgents) ? config.blockedUserAgents : [];
  
  // 5. Block User Agents (including specific Facebook rule)
  if (!blockReason && config.blockFacebookBots && (userAgentLower.includes('facebookexternalhit') || userAgentLower.includes('facebot'))) {
    blockReason = 'Facebook Bot';
  }
  
  if (!blockReason && blockedUserAgents.some((ua:string) => userAgentLower.includes(ua.toLowerCase()))) {
    blockReason = `UA blacklisted: ${userAgent}`;
  }
  
  // 6. Block IPs
  if (!blockReason && blockedIps.includes(ip)) {
    blockReason = `IP blacklisted: ${ip}`;
  }
  
  // 7. Geo-targeting rules
  if (!blockReason && config.blockedCountries?.includes(country)) {
    blockReason = `Country blacklisted: ${country}`;
  }
  
  if (!blockReason && config.allowedCountries?.length > 0 && !config.allowedCountries.includes(country)) {
    blockReason = `Country not in allowed list: ${country}`;
  }

  // --- End of Decision Logic ---

  if (blockReason) {
    console.log(`[${slug}] Blocked. Reason: ${blockReason}. Visitor: IP=${ip}, UA=${userAgent}, Country=${country}, Referer=${referer}`);
    redirectTo = config.fakeUrl;
    decision = 'fake';
    // Send webhook if configured and a block occurred
    if (config.webhookUrl) {
        await sendWebhookNotification(config.webhookUrl, blockReason, { slug, ip, country, userAgent });
    }
  } else {
     console.log(`[${slug}] Allowed. Visitor: IP=${ip}, UA=${userAgent}, Country=${country}, Referer=${referer}`);
  }
  
  // Save log to Firestore
  try {
     await db.collection('logs').add({
      routeId: config.id,
      userId: config.userId, // Store the owner of the route
      slug: slug,
      ip: ip,
      country: country,
      userAgent: userAgent,
      referer: referer || 'none',
      redirectedTo: decision,
      targetUrl: redirectTo,
      timestamp: new Date(),
      blockReason: blockReason || null, // Add reason to the log
    });
  } catch(error) {
    console.error("Error writing log to Firestore:", error);
  }

  // NOTE: "CDN Injection" and "Honeypot" are frontend implementations on the destination page.
  // The switches in the UI inform the user how to set up their pages.

  const urlWithRedirect = new URL(request.url);
  urlWithRedirect.pathname = `/cloak/${slug}/loading`;
  urlWithRedirect.searchParams.set('target', redirectTo);
  
  // Pass delay parameter to loading page only if it's a real user and delay is enabled
  if (decision === 'real' && config.randomDelay) {
    urlWithRedirect.searchParams.set('delay', 'true');
  }
  
  return NextResponse.redirect(urlWithRedirect.toString());
}
