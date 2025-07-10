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
      emergency: false,
    };
  }
  return null;
};

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // 1. Fetch route configuration
  const config = getRouteConfig(slug);

  if (!config) {
    return new Response('Route not found', { status: 404 });
  }
  
  // Default to real URL
  let redirectTo = config.realUrl;

  // 2. Check for Emergency Mode
  if (config.emergency) {
    console.log(`[${slug}] Emergency mode ON. Redirecting to fake URL.`);
    return NextResponse.redirect(config.fakeUrl);
  }

  // 3. Get visitor information
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const country = request.geo?.country || 'unknown';

  console.log(`[${slug}] Visitor Info: IP=${ip}, UA=${userAgent}, Country=${country}`);

  // 4. Apply filtering rules
  // Rule: Check blocked IPs
  if (config.blockedIps.includes(ip)) {
    console.log(`[${slug}] IP ${ip} is blacklisted. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
  }
  
  // Rule: Check blocked User-Agents
  else if (config.blockedUserAgents.some(ua => userAgent.toLowerCase().includes(ua.toLowerCase()))) {
    console.log(`[${slug}] UA ${userAgent} is blacklisted. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
  }
  
  // Rule: Check blocked countries
  else if (config.blockedCountries.includes(country)) {
    console.log(`[${slug}] Country ${country} is blacklisted. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
  }
  
  // Rule: Check allowed countries (if any are specified)
  else if (config.allowedCountries.length > 0 && !config.allowedCountries.includes(country)) {
    console.log(`[${slug}] Country ${country} is not in allowed list. Redirecting to fake URL.`);
    redirectTo = config.fakeUrl;
  }

  // In a real app, you would log this visit to your database here.
  console.log(`[${slug}] Final decision: Redirecting to ${redirectTo}`);

  // 5. Perform the redirect
  return NextResponse.redirect(redirectTo);
}
