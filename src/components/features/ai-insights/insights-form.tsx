"use client";
import React, { useState, useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateBudgetingTips, type GenerateBudgetingTipsOutput } from '@/ai/flows/generate-budgeting-tips';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Bot } from 'lucide-react';

const insightsFormSchema = z.object({
  spendingHabits: z.string().min(20, "Please describe your spending habits in at least 20 characters."),
  financialGoals: z.string().min(10, "Please describe your financial goals in at least 10 characters."),
});

type InsightsFormValues = z.infer<typeof insightsFormSchema>;

export function InsightsForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [tips, setTips] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<InsightsFormValues>({
    resolver: zodResolver(insightsFormSchema),
    defaultValues: {
      spendingHabits: "",
      financialGoals: "",
    },
  });

  async function onSubmit(data: InsightsFormValues) {
    setError(null);
    setTips(null);
    startTransition(async () => {
      try {
        const result: GenerateBudgetingTipsOutput = await generateBudgetingTips({
          spendingHabits: data.spendingHabits,
          financialGoals: data.financialGoals,
        });
        if (result && result.tips) {
          setTips(result.tips);
          toast({
            title: "Insights Generated!",
            description: "Personalized budgeting tips are ready.",
          });
        } else {
          throw new Error("No tips were generated or the response was empty.");
        }
      } catch (e: any) {
        console.error("Error generating tips:", e);
        const errorMessage = e.message || "Failed to generate tips. Please try again.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="spendingHabits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Spending Habits</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., I tend to eat out 3-4 times a week, subscribe to multiple streaming services, and often make impulse purchases online..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe your typical spending patterns. The more detail, the better the advice.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="financialGoals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Financial Goals</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., I want to save for a down payment on a house, pay off my student loans, and build an emergency fund..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  What are you trying to achieve financially?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            {isPending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Insights...
                </>
            ) : "Get AI Budgeting Tips"}
          </Button>
        </form>
      </Form>

      {error && (
        <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-4">
                <p className="text-destructive text-sm font-medium">{error}</p>
            </CardContent>
        </Card>
      )}

      {tips && tips.length > 0 && (
        <Card className="mt-8 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary">
              <Sparkles className="h-6 w-6" /> Your Personalized Budgeting Tips
            </h3>
            <ul className="list-disc space-y-3 pl-5 text-sm text-foreground">
              {tips.map((tip, index) => (
                <li key={index} className="leading-relaxed">{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
