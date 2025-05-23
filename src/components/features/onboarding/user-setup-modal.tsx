
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

const userSetupFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
});

type UserSetupFormValues = z.infer<typeof userSetupFormSchema>;

interface UserSetupModalProps {
  isOpen: boolean;
  onSetupComplete: () => void;
}

export function UserSetupModal({ isOpen, onSetupComplete }: UserSetupModalProps) {
  const { toast } = useToast();
  const form = useForm<UserSetupFormValues>({
    resolver: zodResolver(userSetupFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  function onSubmit(data: UserSetupFormValues) {
    const userInfo: UserInfo = {
      name: data.name,
      email: data.email,
    };
    saveUserInfo(userInfo);
    markSetupAsComplete();
    toast({
      title: "Welcome to Expense Tracker!",
      description: "Your information has been saved.",
    });
    onSetupComplete();
    // Consider a full page reload if necessary to re-initialize other components
    // window.location.reload(); 
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) {/* For now, don't allow closing via overlay click */} }}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" /> Welcome to Expense Tracker!
          </DialogTitle>
          <DialogDescription>
            Let's get you set up. Please enter your details below. This information will be stored locally on your device.
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
            <DialogFooter>
              <Button type="submit" className="w-full">Get Started</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
