
import { db } from './firebase/server';
import type { BotIntelData, GlobalBlocklists } from '@/lib/types';

// In-memory cache for bot intelligence data
let cachedData: BotIntelData | null = null;
let lastFetchTimestamp = 0;

const CACHE_TTL = 1000 * 60 * 30; // 30 minutes in milliseconds

// Baseline list focused on essential blocking for Facebook Ads and other major platforms.
const BASELINE_BOT_INTEL_DATA: GlobalBlocklists = {
  blockedIps: [
    // Cloudflare WARP / Proxies are often used to mask traffic.
    "104.28.192.0/20", 
  ],
  blockedUserAgents: [
    // Essential Facebook Bots
    "facebookexternalhit",
    "Facebot",
    // General Crawlers & Ad Bots
    "Googlebot",
    "AdsBot-Google",
    "bingbot",
    "TikTokBot",
    "Bytespider",
    "SemrushBot", 
    "AhrefsBot",
    // AI Crawlers
    "GPTBot", 
    "ClaudeBot", 
    "Perplexity-User",
  ],
  blockedAsns: [
    // ASN for Meta/Facebook
    "32934",  // META-PLATFORMS-INC
    "63293",  // FACEBOOK-AS-BLOCK
    "13335",  // CLOUDFLARENET
    // Other major datacenters used by bots
    "15169", // GOOGLE
    "16509", // AMAZON-02
    "8075",  // MICROSOFT-CORP-MSN-AS-BLOCK
  ],
};


/**
 * Fetches global blocklists from Firestore, combines them with a baseline list,
 * and caches the result. This simulates an "AI" that frequently updates lists
 * by combining a managed baseline with user-specific rules.
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
