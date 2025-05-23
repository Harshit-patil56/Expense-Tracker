
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { ExpenseForm } from "@/components/features/expenses/expense-form";
import { ExpenseTable } from "@/components/features/expenses/expense-table";
import type { Expense } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loadExpenses, saveExpenses } from '@/lib/data-store';
import { useToast } from "@/hooks/use-toast";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setExpenses(loadExpenses());
  }, []);

  const handleAddExpense = (newExpenseData: Omit<Expense, 'id'>) => {
    setExpenses(prevExpenses => {
      const newExpense: Expense = {
        ...newExpenseData,
        id: String(Date.now()), // simple unique id
      };
      const updatedExpenses = [newExpense, ...prevExpenses];
      saveExpenses(updatedExpenses);
      // No need to call refreshBudgetsWithSpentAmounts here, other pages listen to storage
      return updatedExpenses;
    });
  };

  const handleDeleteExpense = useCallback((expenseId: string) => {
    setExpenses(prevExpenses => {
      const updatedExpenses = prevExpenses.filter(exp => exp.id !== expenseId);
      saveExpenses(updatedExpenses);
      toast({ title: "Expense Deleted", description: "The expense has been removed." });
      // No need to call refreshBudgetsWithSpentAmounts here, other pages listen to storage
      return updatedExpenses;
    });
  }, [toast]);

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
