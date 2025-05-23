
"use client";

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { saveUserInfo, markSetupAsComplete, type UserInfo } from "@/lib/data-store";
import { useToast } from "@/hooks/use-toast";
import { Wallet } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrencySymbol } from '@/lib/data-store';


const userSetupFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  totalIncome: z.coerce.number().nonnegative("Income must be a positive number or zero.").default(0),
  currency: z.string().min(3, "Currency is required.").default('INR'),
});

type UserSetupFormValues = z.infer<typeof userSetupFormSchema>;

interface UserSetupModalProps {
  isOpen: boolean;
  onSetupComplete: () => void;
}

export function UserSetupModal({ isOpen, onSetupComplete }: UserSetupModalProps) {
  const { toast } = useToast();
  // const { currencySymbol } = useCurrency(); // Cannot use hook here before context is fully ready

  const form = useForm<UserSetupFormValues>({
    resolver: zodResolver(userSetupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      totalIncome: 0,
      currency: 'INR',
    },
  });

  const selectedCurrencySymbol = getCurrencySymbol(form.watch('currency'));

  function onSubmit(data: UserSetupFormValues) {
    const userInfo: UserInfo = {
      name: data.name,
      email: data.email,
      currency: data.currency,
      totalIncome: data.totalIncome,
    };
    saveUserInfo(userInfo); // This will also set the active user prefix
    markSetupAsComplete(); // This will use the active user prefix set by saveUserInfo

    toast({
      title: "Welcome to Expense Tracker!",
      description: "Your information has been saved.",
    });
    onSetupComplete(); // This typically reloads the page
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) {/* For now, don't allow closing via overlay click */} }}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" /> Welcome to Expense Tracker!
          </DialogTitle>
          <DialogDescription>
            Let's get you set up. Please enter your details below. This information will be stored locally on your device, specific to this user profile.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INR">INR - Indian Rupee ({getCurrencySymbol('INR')})</SelectItem>
                      <SelectItem value="USD">USD - United States Dollar ({getCurrencySymbol('USD')})</SelectItem>
                      <SelectItem value="EUR">EUR - Euro ({getCurrencySymbol('EUR')})</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound ({getCurrencySymbol('GBP')})</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar ({getCurrencySymbol('CAD')})</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Monthly Income ({selectedCurrencySymbol})</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 50000.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full">Get Started</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
