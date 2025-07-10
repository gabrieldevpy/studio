
import { NextResponse } from 'next/server';
import { getBotIntelData } from '@/lib/bot-intel';
import type { GlobalBlocklists } from '@/lib/types';


export async function GET() {
  try {
    const data = await getBotIntelData();
    // Only return the lists, not the lastUpdated timestamp for the public endpoint
    const publicData: GlobalBlocklists = {
      blockedIps: data.blockedIps,
      blockedUserAgents: data.blockedUserAgents,
      blockedAsns: data.blockedAsns
    };
    return NextResponse.json(publicData);
  } catch (error) {
    console.error("Error in /api/bot-intel route:", error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
