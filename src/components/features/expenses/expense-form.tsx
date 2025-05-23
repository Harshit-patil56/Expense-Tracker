
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CATEGORIES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/use-currency";

const expenseFormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  description: z.string().min(1, "Description is required."),
  category: z.string().min(1, "Category is required."),
  amount: z.coerce.number().positive("Amount must be positive."),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

const defaultValues: Partial<ExpenseFormValues> = {
  date: new Date(),
  description: "",
  amount: undefined, // Use undefined for placeholder to show
};

export function ExpenseForm({ onSubmitSuccess }: { onSubmitSuccess?: (data: ExpenseFormValues) => void }) {
  const { toast } = useToast();
  const { currencySymbol } = useCurrency();
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues,
  });

  function onSubmit(data: ExpenseFormValues) {
    console.log(data);
    toast({
      title: "Expense Added",
      description: `${data.description} for ${currencySymbol}${data.amount.toFixed(2)} successfully added.`,
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
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Lunch with colleagues" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
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
            name="amount"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Amount ({currencySymbol})</FormLabel>
                <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <Button type="submit" className="w-full sm:w-auto">Add Expense</Button>
      </form>
    </Form>
  );
}
