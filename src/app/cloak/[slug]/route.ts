
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/firebase/server'; // Use server-side admin SDK
import { getBotIntelData } from '@/lib/bot-intel';

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
  
  const [config, botIntel] = await Promise.all([
    getRouteConfig(slug),
    getBotIntelData() // Fetch bot intelligence data
  ]);

  if (!config) {
    return new Response('Route not found', { status: 404 });
  }
  
  let redirectTo = config.realUrl;
  let decision = 'real' as 'real' | 'fake';
  let blockReason = '';

  // --- Start of Decision Logic ---

  if (config.emergency) {
    blockReason = 'Emergency mode';
  }

  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const country = request.geo?.country || 'unknown';
  const referer = request.headers.get('referer');
  const asn = request.ipLocation?.asn;

  const userAgentLower = userAgent.toLowerCase();
  
  // Heuristic check for bots
  if (!referer) {
      blockReason = 'No referer';
  }
  
  // Combine route-specific and global blocklists
  const combinedBlockedIps = [...(config.blockedIps || []), ...(botIntel.blockedIps || [])];
  const combinedBlockedUserAgents = [...(config.blockedUserAgents || []), ...(botIntel.blockedUserAgents || [])];
  
  if (!blockReason && config.blockFacebookBots && (userAgentLower.includes('facebookexternalhit') || userAgentLower.includes('facebot'))) {
    blockReason = 'Facebook Bot';
  }
  
  if (!blockReason && combinedBlockedIps.includes(ip)) {
    blockReason = `IP blacklisted: ${ip}`;
  }
  
  if (!blockReason && combinedBlockedUserAgents.some((ua:string) => userAgentLower.includes(ua.toLowerCase()))) {
    blockReason = `UA blacklisted: ${userAgent}`;
  }
  
  if (!blockReason && botIntel.blockedAsns.some((blockedAsn: string) => asn?.toString().includes(blockedAsn))) {
    blockReason = `ASN blacklisted: ${asn}`;
  }

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


  const urlWithRedirect = new URL(request.url);
  urlWithRedirect.pathname = `/cloak/${slug}/loading`;
  urlWithRedirect.searchParams.set('target', redirectTo);
  
  return NextResponse.redirect(urlWithRedirect.toString());
}
