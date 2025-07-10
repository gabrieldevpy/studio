
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/firebase/server'; // Use server-side admin SDK

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


export async function GET(request: NextRequest, { params }: { params: { slug:string } }) {
  const { slug } = params;
  
  const config = await getRouteConfig(slug);

  if (!config) {
    return new Response('Route not found', { status: 404 });
  }
  
  let redirectTo = config.realUrl;
  let decision = 'real' as 'real' | 'fake';
  let blockReason = '';

  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const country = request.geo?.country || 'unknown';
  const referer = request.headers.get('referer');
  
  // --- Start of Decision Logic ---

  // 1. IP Rotation Redirect (Requires Redis or similar for stateful tracking)
  if (config.ipRotation) {
    // PSEUDO-CODE: This logic would need a stateful cache like Redis.
    // const ipAccessCount = await redis.incr(`ip_count:${slug}:${ip}`);
    // await redis.expire(`ip_count:${slug}:${ip}`, 60); // 60-second window
    // if (ipAccessCount > 10) { // Example: more than 10 requests in 60s
    //   blockReason = `IP Rate Limit Exceeded: ${ip}`;
    // }
  }
  
  // 2. Emergency mode has highest priority
  if (!blockReason && config.emergency) {
    blockReason = 'Emergency mode';
  }

  const userAgentLower = userAgent.toLowerCase();
  
  // 3. Heuristic check for bots (e.g., direct access without a referrer)
  if (!blockReason && !referer) {
      blockReason = 'No referer';
  }
  
  const blockedIps = config.blockedIps || [];
  const blockedUserAgents = config.blockedUserAgents || [];
  
  // 4. Block User Agents (including specific Facebook rule)
  if (!blockReason && config.blockFacebookBots && (userAgentLower.includes('facebookexternalhit') || userAgentLower.includes('facebot'))) {
    blockReason = 'Facebook Bot';
  }
  
  if (!blockReason && blockedUserAgents.some((ua:string) => userAgentLower.includes(ua.toLowerCase()))) {
    blockReason = `UA blacklisted: ${userAgent}`;
  }
  
  // 5. Block IPs
  if (!blockReason && blockedIps.includes(ip)) {
    blockReason = `IP blacklisted: ${ip}`;
  }
  
  // 6. Geo-targeting rules
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

  // NOTE: A real implementation of "CDN Injection" and "Honeypot" would happen on the frontend of the destination URL (the money page),
  // not in this middleware. This middleware can only redirect. The switches in the UI serve to inform the user how to set up their pages.

  const urlWithRedirect = new URL(request.url);
  urlWithRedirect.pathname = `/cloak/${slug}/loading`;
  urlWithRedirect.searchParams.set('target', redirectTo);
  
  // Pass delay parameter to loading page only if it's a real user and delay is enabled
  if (decision === 'real' && config.randomDelay) {
    urlWithRedirect.searchParams.set('delay', 'true');
  }
  
  return NextResponse.redirect(urlWithRedirect.toString());
}
