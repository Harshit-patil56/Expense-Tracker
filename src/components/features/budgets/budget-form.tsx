
"use client";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/use-currency";

const budgetFormSchema = z.object({
  category: z.string().min(1, "Category is required."),
  goalAmount: z.coerce.number().positive("Goal amount must be positive."),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

const defaultValues: Partial<BudgetFormValues> = {
  goalAmount: undefined, // Use undefined to show placeholder
};

export function BudgetForm({ onSubmitSuccess }: { onSubmitSuccess?: (data: BudgetFormValues) => void }) {
  const { toast } = useToast();
  const { currencySymbol } = useCurrency();
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues,
  });

  function onSubmit(data: BudgetFormValues) {
    console.log(data);
    toast({
      title: "Budget Goal Set",
      description: `Budget for ${data.category} set to ${currencySymbol}${data.goalAmount.toFixed(2)}.`,
    });
    form.reset();
    if (onSubmitSuccess) {
        onSubmitSuccess(data);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category for budget" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Goal Amount ({currencySymbol})</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="e.g., 10000.00" {...field} />
              </FormControl>
              <FormDescription>
                Set your target spending limit for this category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full sm:w-auto">Set Budget Goal</Button>
      </form>
    </Form>
  );
}
