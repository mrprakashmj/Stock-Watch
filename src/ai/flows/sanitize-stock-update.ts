// src/ai/flows/sanitize-stock-update.ts
'use server';

/**
 * @fileOverview Sanitizes stock updates to ensure valid numerical entries.
 *
 * - sanitizeStockUpdate - A function that sanitizes the stock update.
 * - SanitizeStockUpdateInput - The input type for the sanitizeStockUpdate function.
 * - SanitizeStockUpdateOutput - The return type for the sanitizeStockUpdate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SanitizeStockUpdateInputSchema = z.object({
  updateText: z.string().describe('The text containing the stock update information.'),
});
export type SanitizeStockUpdateInput = z.infer<typeof SanitizeStockUpdateInputSchema>;

const SanitizeStockUpdateOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the update text contains valid numerical entries.'),
  sanitizedText: z.string().describe('The sanitized text, with invalid entries removed.'),
});
export type SanitizeStockUpdateOutput = z.infer<typeof SanitizeStockUpdateOutputSchema>;

export async function sanitizeStockUpdate(input: SanitizeStockUpdateInput): Promise<SanitizeStockUpdateOutput> {
  return sanitizeStockUpdateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sanitizeStockUpdatePrompt',
  input: {schema: SanitizeStockUpdateInputSchema},
  output: {schema: SanitizeStockUpdateOutputSchema},
  prompt: `You are a data quality assurance expert. Your task is to validate and sanitize stock update entries to ensure they contain valid numerical values.

  Analyze the following stock update text:
  {{updateText}}

  Determine if the text contains valid numerical entries suitable for updating stock quantities. If not, identify and remove any invalid entries, providing a sanitized version of the text.

  Respond with a JSON object indicating whether the update is valid and providing the sanitized text.
  `,
});

const sanitizeStockUpdateFlow = ai.defineFlow(
  {
    name: 'sanitizeStockUpdateFlow',
    inputSchema: SanitizeStockUpdateInputSchema,
    outputSchema: SanitizeStockUpdateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
