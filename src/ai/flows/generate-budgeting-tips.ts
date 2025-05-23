// src/ai/flows/generate-budgeting-tips.ts
'use server';

/**
 * @fileOverview Generates personalized budgeting tips based on spending habits and financial goals.
 *
 * - generateBudgetingTips - A function that generates budgeting tips.
 * - GenerateBudgetingTipsInput - The input type for the generateBudgetingTips function.
 * - GenerateBudgetingTipsOutput - The return type for the generateBudgetingTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBudgetingTipsInputSchema = z.object({
  spendingHabits: z
    .string()
    .describe('Description of the user spending habits.'),
  financialGoals: z
    .string()
    .describe('Description of the user financial goals.'),
});
export type GenerateBudgetingTipsInput = z.infer<typeof GenerateBudgetingTipsInputSchema>;

const GenerateBudgetingTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('An array of personalized budgeting tips.'),
});
export type GenerateBudgetingTipsOutput = z.infer<typeof GenerateBudgetingTipsOutputSchema>;

export async function generateBudgetingTips(
  input: GenerateBudgetingTipsInput
): Promise<GenerateBudgetingTipsOutput> {
  return generateBudgetingTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBudgetingTipsPrompt',
  input: {schema: GenerateBudgetingTipsInputSchema},
  output: {schema: GenerateBudgetingTipsOutputSchema},
  prompt: `You are a financial advisor. Analyze the user's spending habits and financial goals to generate personalized budgeting tips.

Spending Habits: {{{spendingHabits}}}
Financial Goals: {{{financialGoals}}}

Provide 3-5 concise and actionable tips to help the user improve their financial management.
Format the tips as a bulleted list.
`,
});

const generateBudgetingTipsFlow = ai.defineFlow(
  {
    name: 'generateBudgetingTipsFlow',
    inputSchema: GenerateBudgetingTipsInputSchema,
    outputSchema: GenerateBudgetingTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
