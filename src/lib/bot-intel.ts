
import { db } from './firebase/server';
import type { BotIntelData, GlobalBlocklists } from '@/lib/types';

// In-memory cache for bot intelligence data
let cachedData: BotIntelData | null = null;
let lastFetchTimestamp = 0;

const CACHE_TTL = 1000 * 60 * 30; // 30 minutes in milliseconds

// Default, hardcoded list of known bad actors. This is a baseline.
const BASELINE_BOT_INTEL_DATA: GlobalBlocklists = {
  blockedIps: [
    "199.59.148.0/22", // Twitter Bot
  ],
  blockedUserAgents: [
    // General Crawlers
    "SemrushBot", "AhrefsBot", "DotBot", "PetalBot", "Bytespider",
    "bingbot", "adidxbot",
    // AI Crawlers
    "GPTBot", "ClaudeBot", "Perplexity-User", "anthropic-ai", "CCBot",
    // Official Facebook Bots
    "facebookexternalhit", "Facebot",
    // Official Google Bots
    "Googlebot", "AdsBot-Google", "Googlebot-Image", "Googlebot-Video", "Googlebot-News", "Mediapartners-Google",
    // Official TikTok Bots
    "TikTokBot",
  ],
  blockedAsns: [
    "15169", // Google LLC
    "32934", // Meta Platforms, Inc. (Facebook)
    "16509", // AMAZON-02
    "8075",  // MICROSOFT-CORP-MSN-AS-BLOCK
    "714",   // Apple Inc.
    "13335"  // Cloudflare
  ],
};


/**
 * Fetches global blocklists from Firestore, combines them with a baseline list,
 * and caches the result.
 */
export async function getBotIntelData(): Promise<BotIntelData> {
  const now = Date.now();

  if (cachedData && (now - lastFetchTimestamp < CACHE_TTL)) {
    console.log("[BotIntel] Serving from cache.");
    return cachedData;
  }

  console.log("[BotIntel] Cache expired or empty. Fetching new data from Firestore.");
  
  let adminLists: GlobalBlocklists = { blockedIps: [], blockedUserAgents: [], blockedAsns: [] };
  
  try {
    const docRef = db.collection('settings').doc('botIntel');
    const docSnap = await docRef.get();
    if (docSnap.exists) {
        adminLists = docSnap.data() as GlobalBlocklists;
    }
  } catch (error) {
    console.error("[BotIntel] Error fetching admin blocklists from Firestore:", error);
    // Proceed with baseline data if Firestore fetch fails
  }

  // Combine baseline and admin lists, ensuring no duplicates
  const combinedIps = [...new Set([...BASELINE_BOT_INTEL_DATA.blockedIps, ...(adminLists.blockedIps || [])])];
  const combinedUAs = [...new Set([...BASELINE_BOT_INTEL_DATA.blockedUserAgents, ...(adminLists.blockedUserAgents || [])])];
  const combinedAsns = [...new Set([...BASELINE_BOT_INTEL_DATA.blockedAsns, ...(adminLists.blockedAsns || [])])];

  cachedData = {
    blockedIps: combinedIps,
    blockedUserAgents: combinedUAs,
    blockedAsns: combinedAsns,
    lastUpdated: new Date().toISOString(),
  };

  lastFetchTimestamp = now;

  return cachedData;
}
