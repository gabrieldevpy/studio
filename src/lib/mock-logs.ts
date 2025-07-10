
export type MockLog = {
  id: string;
  slug: string;
  ip: string;
  country: string;
  dateTime: string;
  redirectedTo: 'real' | 'fake';
  userAgent: string;
};

export const MOCK_LOGS: MockLog[] = [
  // Suspicious IP: 101.102.103.104
  { id: '101', slug: 'promo-abc', ip: '101.102.103.104', country: 'RU', dateTime: '2024-07-30 11:00:00 UTC', redirectedTo: 'fake', userAgent: 'Googlebot/2.1' },
  { id: '102', slug: 'promo-abc', ip: '101.102.103.104', country: 'RU', dateTime: '2024-07-30 11:05:00 UTC', redirectedTo: 'fake', userAgent: 'AhrefsBot/7.0' },
  { id: '103', slug: 'promo-abc', ip: '101.102.103.104', country: 'RU', dateTime: '2024-07-30 11:10:00 UTC', redirectedTo: 'fake', userAgent: 'SemrushBot' },
  { id: '104', slug: 'promo-abc', ip: '101.102.103.104', country: 'RU', dateTime: '2024-07-30 11:15:00 UTC', redirectedTo: 'fake', userAgent: 'Googlebot/2.1' },

  // Suspicious IP: 45.56.67.78
  { id: '201', slug: 'campaign-xyz', ip: '45.56.67.78', country: 'CN', dateTime: '2024-07-30 12:00:00 UTC', redirectedTo: 'fake', userAgent: 'facebookexternalhit/1.1' },
  { id: '202', slug: 'campaign-xyz', ip: '45.56.67.78', country: 'CN', dateTime: '2024-07-30 12:01:00 UTC', redirectedTo: 'fake', userAgent: 'facebookexternalhit/1.1' },
  { id: '203', slug: 'campaign-xyz', ip: '45.56.67.78', country: 'CN', dateTime: '2024-07-30 12:02:00 UTC', redirectedTo: 'fake', userAgent: 'facebookexternalhit/1.1' },

  // A mix of real and fake traffic
  { id: '301', ip: '123.45.67.89', country: 'Estados Unidos', dateTime: '2024-07-29 10:00:00 UTC', redirectedTo: 'real', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...', slug: 'promo-abc' },
  { id: '302', ip: '98.76.54.32', country: 'Canadá', dateTime: '2024-07-29 10:01:15 UTC', redirectedTo: 'real', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...', slug: 'promo-abc' },
  { id: '303', ip: '8.8.8.8', country: 'Estados Unidos', dateTime: '2024-07-29 10:05:00 UTC', redirectedTo: 'fake', userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)', slug: 'lander-v2' },
  { id: '304', ip: '1.1.1.1', country: 'Austrália', dateTime: '2024-07-29 10:06:15 UTC', redirectedTo: 'fake', userAgent: 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)', slug: 'lander-v2' },
];
