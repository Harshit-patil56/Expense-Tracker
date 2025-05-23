
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { ExpenseForm } from "@/components/features/expenses/expense-form";
import { ExpenseTable } from "@/components/features/expenses/expense-table";
import type { Expense } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loadExpenses, saveExpenses, reinitializeActiveUserPrefix } from '@/lib/data-store';
import { useToast } from "@/hooks/use-toast";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { toast } = useToast();

  const refreshExpenses = useCallback(() => {
    reinitializeActiveUserPrefix(); // Ensure correct user context
    setExpenses(loadExpenses());
  }, []);

  useEffect(() => {
    refreshExpenses();
  }, [refreshExpenses]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && (event.key.endsWith('fiscalCompassExpenses') || event.key === 'fiscalCompassActiveUserId') ) {
        refreshExpenses();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshExpenses]);

  const handleAddExpense = (newExpenseData: Omit<Expense, 'id'>) => {
    // expenses are already loaded with user context by refreshExpenses
    const newExpense: Expense = {
      ...newExpenseData,
      id: String(Date.now()), 
    };
    const updatedExpenses = [newExpense, ...expenses]; // Use current state expenses
    saveExpenses(updatedExpenses); // Saves for current active user
    setExpenses(updatedExpenses); // Update local state immediately
    // saveExpenses will dispatch a storage event, so other components will update.
  };

  const handleDeleteExpense = useCallback((expenseId: string) => {
    // expenses are already loaded with user context
    const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
    saveExpenses(updatedExpenses); // Saves for current active user
    setExpenses(updatedExpenses); // Update local state immediately
    toast({ title: "Expense Deleted", description: "The expense has been removed." });
    // saveExpenses dispatches storage event
  }, [expenses, toast]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <p className="text-muted-foreground">Track and manage your spending.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
          <CardDescription>Fill in the details below to record a new expense.</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseForm onSubmitSuccess={handleAddExpense} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription>A list of all your recorded expenses.</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseTable expenses={expenses} onDeleteExpense={handleDeleteExpense} />
        </CardContent>
      </Card>
    </div>
  );
}
