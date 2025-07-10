'use server';

/**
 * @fileOverview Flow to analyze visitor traffic and determine if it's suspicious.
 *
 * - blockSuspiciousTraffic - A function that handles the traffic analysis process.
 * - BlockSuspiciousTrafficInput - The input type for the function.
 * - BlockSuspiciousTrafficOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BlockSuspiciousTrafficInputSchema = z.object({
  ip: z.string().describe('The visitor\'s IP address.'),
  userAgent: z.string().describe('The visitor\'s user agent string.'),
  country: z.string().describe('The visitor\'s country code (e.g., US, BR).'),
  referer: z.string().optional().describe('The referer header from the visitor.'),
});
export type BlockSuspiciousTrafficInput = z.infer<typeof BlockSuspiciousTrafficInputSchema>;

const BlockSuspiciousTrafficOutputSchema = z.object({
  block: z.boolean().describe('Whether to block the traffic or not.'),
  reason: z.string().optional().describe('The reason for blocking the traffic, if applicable.'),
});
export type BlockSuspiciousTrafficOutput = z.infer<typeof BlockSuspiciousTrafficOutputSchema>;

export async function blockSuspiciousTraffic(input: BlockSuspiciousTrafficInput): Promise<BlockSuspiciousTrafficOutput> {
  return blockSuspiciousTrafficFlow(input);
}

const prompt = ai.definePrompt({
  name: 'blockSuspiciousTrafficPrompt',
  input: {schema: BlockSuspiciousTrafficInputSchema},
  output: {schema: BlockSuspiciousTrafficOutputSchema},
  prompt: `You are an expert security analyst for a traffic cloaking tool. Your job is to determine if a visitor is a human or a bot/suspicious actor based on their details.

Analyze the following visitor data:
- IP Address: {{{ip}}}
- User Agent: {{{userAgent}}}
- Country: {{{country}}}
- Referer: {{{referer}}}

Consider the following as suspicious signs:
- User agents containing "bot", "spider", "crawler", "headless".
- User agents from known data center providers (e.g., 'axios', 'python-requests', 'curl').
- Empty or missing referer, especially for non-direct traffic.
- IPs from known data centers or hosting providers (though you can't verify this directly, you can use it as a heuristic).
- Atypical combinations of User-Agent and IP/Country.

Based on your analysis, decide if the visitor should be blocked. If you decide to block, provide a short, clear reason.

Examples:
- Input: { userAgent: 'Googlebot/2.1', ... } -> Output: { block: true, reason: 'Known Crawler (Googlebot)' }
- Input: { userAgent: 'Mozilla/5.0 ... Chrome/108.0', referer: 'https://facebook.com' } -> Output: { block: false }
- Input: { userAgent: 'python-requests/2.25.1', ... } -> Output: { block: true, reason: 'Automated Tool (Python Requests)' }
- Input: { userAgent: 'Mozilla/5.0 ...', referer: '' } -> Output: { block: true, reason: 'No referer' }

Now, analyze the provided data and return your decision.`,
});

const blockSuspiciousTrafficFlow = ai.defineFlow(
  {
    name: 'blockSuspiciousTrafficFlow',
    inputSchema: BlockSuspiciousTrafficInputSchema,
    outputSchema: BlockSuspiciousTrafficOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
