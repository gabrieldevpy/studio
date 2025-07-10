
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/firebase/server'; // Use server-side admin SDK

// Helper to fetch route config from Firestore
const getRouteConfig = async (slug: string) => {
  try {
    console.log(`[Firestore] Looking up config for slug: ${slug}`);
    const routesRef = db.collection('routes');
    const snapshot = await routesRef.where('slug', '==', slug).limit(1).get();

    if (snapshot.empty) {
      console.log(`[Firestore] No route found for slug: ${slug}`);
      return null;
    }

    const routeDoc = snapshot.docs[0];
    // In a real app, you would add more validation here
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

  // --- Start of Decision Logic ---

  if (config.emergency) {
    console.log(`[${slug}] Emergency mode ON. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
    decision = 'fake';
  }

  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const country = request.geo?.country || 'unknown';
  const referer = request.headers.get('referer');

  console.log(`[${slug}] Visitor Info: IP=${ip}, UA=${userAgent}, Country=${country}, Referer=${referer}`);

  const userAgentLower = userAgent.toLowerCase();
  
  // Heuristic check for bots
  if (!referer) {
      console.log(`[${slug}] No referer header. Potential bot. Redirecting to fake URL.`);
      redirectTo = config.fakeUrl;
      decision = 'fake';
  }
  
  else if (config.blockFacebookBots && (userAgentLower.includes('facebookexternalhit') || userAgentLower.includes('facebot'))) {
    console.log(`[${slug}] Facebook Bot detected. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
    decision = 'fake';
  }
  
  else if (config.blockedIps?.includes(ip)) {
    console.log(`[${slug}] IP ${ip} is blacklisted. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
    decision = 'fake';
  }
  
  else if (config.blockedUserAgents?.some((ua:string) => userAgentLower.includes(ua.toLowerCase()))) {
    console.log(`[${slug}] UA ${userAgent} is blacklisted. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
    decision = 'fake';
  }
  
  else if (config.blockedCountries?.includes(country)) {
    console.log(`[${slug}] Country ${country} is blacklisted. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
    decision = 'fake';
  }
  
  else if (config.allowedCountries?.length > 0 && !config.allowedCountries.includes(country)) {
    console.log(`[${slug}] Country ${country} is not in allowed list. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
    decision = 'fake';
  }

  // --- End of Decision Logic ---

  console.log(`[${slug}] Final decision: Redirecting to ${redirectTo}`);
  
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
    });
  } catch(error) {
    console.error("Error writing log to Firestore:", error);
  }


  const urlWithRedirect = new URL(request.url);
  urlWithRedirect.pathname = `/cloak/${slug}/loading`;
  urlWithRedirect.searchParams.set('target', redirectTo);
  
  return NextResponse.redirect(urlWithRedirect.toString());
}
