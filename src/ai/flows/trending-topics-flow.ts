'use server';
/**
 * @fileOverview An AI flow to identify trending topics from a list of news articles.
 *
 * - getTrendingTopics - A function that analyzes articles and returns trending topics.
 * - TrendingTopicsInput - The input type for the getTrendingTopics function.
 * - TrendingTopicsOutput - The return type for the getTrendingTopics function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const TrendingTopicsInputSchema = z.object({
  articles: z.array(
    z.object({
      title: z.string().describe('The title of the news article.'),
      content: z.string().optional().describe('A snippet or summary of the article content.'),
    })
  ).describe('A list of fresh news articles to analyze.'),
});
export type TrendingTopicsInput = z.infer<typeof TrendingTopicsInputSchema>;

export const TrendingTopicsOutputSchema = z.object({
  topics: z.array(
    z.object({
      topic: z.string().describe('A concise name for the trending topic (e.g., "SEC Regulations", "Solana Memecoin Surge").'),
      summary: z.string().describe('A one or two sentence summary of why this topic is trending, based on the provided articles.'),
      sentiment: z.enum(['Positive', 'Negative', 'Neutral']).describe('The overall market sentiment for this topic based on the articles.'),
      relevanceScore: z.number().min(1).max(10).describe('A score from 1 to 10 indicating how prominent this topic is in the provided articles.')
    })
  ).describe('A list of identified trending topics, sorted by relevance score in descending order.'),
});
export type TrendingTopicsOutput = z.infer<typeof TrendingTopicsOutputSchema>;


const prompt = ai.definePrompt({
  name: 'trendingTopicsPrompt',
  input: { schema: TrendingTopicsInputSchema },
  output: { schema: TrendingTopicsOutputSchema },
  prompt: `You are a crypto market analyst. Your job is to identify trending topics from a list of news headlines and summaries.
Analyze the following articles and identify the top 3-5 most important or frequently mentioned topics.

For each topic, provide:
1.  A short, descriptive name for the topic.
2.  A brief summary explaining what's happening and why it's significant.
3.  The overall market sentiment (Positive, Negative, or Neutral).
4.  A relevance score from 1-10, where 10 is the most talked-about topic.

Base your analysis solely on the information provided in the articles below.
Sort the final list of topics by the relevance score, from highest to lowest.

Articles:
{{#each articles}}
- Title: {{{title}}}
  {{#if content}}Summary: {{{content}}}{{/if}}
{{/each}}
`,
});

const trendingTopicsFlow = ai.defineFlow(
  {
    name: 'trendingTopicsFlow',
    inputSchema: TrendingTopicsInputSchema,
    outputSchema: TrendingTopicsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


export async function getTrendingTopics(input: TrendingTopicsInput): Promise<TrendingTopicsOutput> {
  return trendingTopicsFlow(input);
}
