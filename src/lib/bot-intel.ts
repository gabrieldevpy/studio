
export type BotIntelData = {
  lastUpdated: string;
  blockedIps: string[];
  blockedUserAgents: string[];
  blockedAsns: string[];
};

// In-memory cache for bot intelligence data
let cachedData: BotIntelData | null = null;
let lastFetchTimestamp = 0;

const CACHE_TTL = 1000 * 60 * 60; // 1 hour in milliseconds

// Mock data source
const MOCK_BOT_INTEL_DATA: Omit<BotIntelData, 'lastUpdated'> = {
  blockedIps: [
    "199.59.148.0/22", // Twitter Bot
    "8.8.8.8", // Example IP
  ],
  blockedUserAgents: [
    "SemrushBot",
    "AhrefsBot",
    "DotBot",
    "PetalBot",
    "Bytespider"
  ],
  blockedAsns: [
    "15169", // Google LLC
    "32934", // Meta Platforms, Inc.
    "16509", // AMAZON-02
    "8075"   // MICROSOFT-CORP-MSN-AS-BLOCK
  ],
};

/**
 * Fetches bot intelligence data, using an in-memory cache to avoid
 * fetching on every request.
 */
export async function getBotIntelData(): Promise<BotIntelData> {
  const now = Date.now();

  // Check if cache is still valid
  if (cachedData && (now - lastFetchTimestamp < CACHE_TTL)) {
    console.log("[BotIntel] Serving from cache.");
    return cachedData;
  }

  console.log("[BotIntel] Cache expired or empty. Fetching new data.");
  
  // In a real application, you would fetch this from an external API
  // For this prototype, we'll use mock data.
  const fetchedData = MOCK_BOT_INTEL_DATA;

  cachedData = {
    ...fetchedData,
    lastUpdated: new Date().toISOString(),
  };

  lastFetchTimestamp = now;

  return cachedData;
}
