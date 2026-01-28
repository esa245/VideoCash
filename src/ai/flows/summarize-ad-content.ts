'use server';
/**
 * @fileOverview A video ad content summarization AI agent.
 *
 * - summarizeAdContent - A function that handles the ad content summarization process.
 * - SummarizeAdContentInput - The input type for the summarizeAdContent function.
 * - SummarizeAdContentOutput - The return type for the summarizeAdContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAdContentInputSchema = z.object({
  videoTranscript: z
    .string()
    .describe("The transcript of the video ad's content."),
});
export type SummarizeAdContentInput = z.infer<typeof SummarizeAdContentInputSchema>;

const SummarizeAdContentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the video ad content.'),
});
export type SummarizeAdContentOutput = z.infer<typeof SummarizeAdContentOutputSchema>;

export async function summarizeAdContent(input: SummarizeAdContentInput): Promise<SummarizeAdContentOutput> {
  return summarizeAdContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAdContentPrompt',
  input: {schema: SummarizeAdContentInputSchema},
  output: {schema: SummarizeAdContentOutputSchema},
  prompt: `You are an expert marketing analyst. Your task is to summarize the content of a video ad based on its transcript. Provide a concise and informative summary that captures the main points of the ad.

Transcript: {{{videoTranscript}}}`,
});

const summarizeAdContentFlow = ai.defineFlow(
  {
    name: 'summarizeAdContentFlow',
    inputSchema: SummarizeAdContentInputSchema,
    outputSchema: SummarizeAdContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
