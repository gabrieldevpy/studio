

export type GlobalBlocklists = {
  blockedIps: string[];
  blockedUserAgents: string[];
  blockedAsns: string[];
};

export type BotIntelData = GlobalBlocklists & {
  lastUpdated: string;
};
