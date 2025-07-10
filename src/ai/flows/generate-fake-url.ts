'use server';

/**
 * @fileOverview Flow to generate a plausible-sounding fake URL based on a real URL.
 *
 * - generateFakeUrl - A function that handles the fake URL generation process.
 * - GenerateFakeUrlInput - The input type for the generateFakeUrl function.
 * - GenerateFakeUrlOutput - The return type for the generateFakeUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFakeUrlInputSchema = z.object({
  realUrl: z.string().describe('The real URL to base the fake URL on.'),
});
export type GenerateFakeUrlInput = z.infer<typeof GenerateFakeUrlInputSchema>;

const GenerateFakeUrlOutputSchema = z.object({
  fakeUrl: z.string().describe('The generated fake URL.'),
});
export type GenerateFakeUrlOutput = z.infer<typeof GenerateFakeUrlOutputSchema>;

export async function generateFakeUrl(input: GenerateFakeUrlInput): Promise<GenerateFakeUrlOutput> {
  return generateFakeUrlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFakeUrlPrompt',
  input: {schema: GenerateFakeUrlInputSchema},
  output: {schema: GenerateFakeUrlOutputSchema},
  prompt: `You are a URL generator. Your job is to create a plausible sounding but fake URL based on a real URL.

Real URL: {{{realUrl}}}

Fake URL:`,
});

const generateFakeUrlFlow = ai.defineFlow(
  {
    name: 'generateFakeUrlFlow',
    inputSchema: GenerateFakeUrlInputSchema,
    outputSchema: GenerateFakeUrlOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
