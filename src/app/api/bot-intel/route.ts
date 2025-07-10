
import { NextResponse } from 'next/server';
import { getBotIntelData } from '@/lib/bot-intel';

export async function GET() {
  try {
    const data = await getBotIntelData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/bot-intel route:", error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
