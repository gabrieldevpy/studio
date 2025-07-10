
import { NextResponse, type NextRequest } from 'next/server';

// This is a mock database lookup. In a real app, you'd fetch this from a database.
const getRouteConfig = (slug: string) => {
  console.log(`Looking up config for slug: ${slug}`);
  // Mock data for a route.
  if (slug === 'promo-abc') {
    return {
      realUrl: 'https://real-product.com/offer',
      fakeUrl: 'https://google.com',
      blockedUserAgents: ['GoogleBot', 'AhrefsBot', 'SemrushBot'],
      blockedIps: ['1.2.3.4'],
      allowedCountries: ['US', 'CA'],
      blockedCountries: ['RU', 'CN'],
      blockFacebookBots: true,
      emergency: false,
    };
  }
  return null;
};

// In a real app, this would be initialized with proper credentials
// and security rules would be in place.
const mockDb = {
  collection: (name: string) => ({
    add: async (data: any) => {
      console.log(`[MockDB] Adding to ${name}:`, data);
      return { id: `mock_${Date.now()}` };
    }
  })
};


export async function GET(request: NextRequest, { params }: { params: { slug:string } }) {
  const { slug } = params;
  
  const config = getRouteConfig(slug);

  if (!config) {
    return new Response('Route not found', { status: 404 });
  }
  
  let redirectTo = config.realUrl;
  let decision = 'real' as 'real' | 'fake';

  if (config.emergency) {
    console.log(`[${slug}] Emergency mode ON. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
    decision = 'fake';
  }

  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const country = request.geo?.country || 'unknown';

  console.log(`[${slug}] Visitor Info: IP=${ip}, UA=${userAgent}, Country=${country}`);

  const userAgentLower = userAgent.toLowerCase();
  
  if (config.blockFacebookBots && (userAgentLower.includes('facebookexternalhit') || userAgentLower.includes('facebot'))) {
    console.log(`[${slug}] Facebook Bot detected. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
    decision = 'fake';
  }
  
  else if (config.blockedIps.includes(ip)) {
    console.log(`[${slug}] IP ${ip} is blacklisted. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
    decision = 'fake';
  }
  
  else if (config.blockedUserAgents.some(ua => userAgentLower.includes(ua.toLowerCase()))) {
    console.log(`[${slug}] UA ${userAgent} is blacklisted. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
    decision = 'fake';
  }
  
  else if (config.blockedCountries.includes(country)) {
    console.log(`[${slug}] Country ${country} is blacklisted. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
    decision = 'fake';
  }
  
  else if (config.allowedCountries.length > 0 && !config.allowedCountries.includes(country)) {
    console.log(`[${slug}] Country ${country} is not in allowed list. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
    decision = 'fake';
  }

  console.log(`[${slug}] Final decision: Redirecting to ${redirectTo}`);
  
  // Save log to Firestore
  try {
     await mockDb.collection('logs').add({
      slug: slug,
      ip: ip,
      country: country,
      userAgent: userAgent,
      redirectedTo: decision,
      targetUrl: redirectTo,
      timestamp: new Date(),
    });
  } catch(error) {
    console.error("Error writing log to mock DB:", error);
  }


  const urlWithRedirect = new URL(request.url);
  urlWithRedirect.pathname = `/cloak/${slug}/loading`;
  urlWithRedirect.searchParams.set('target', redirectTo);
  
  return NextResponse.redirect(urlWithRedirect.toString());
}
