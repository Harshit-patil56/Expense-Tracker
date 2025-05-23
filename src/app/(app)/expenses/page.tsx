
"use client";
import React, { useState, useEffect } from 'react';
import { ExpenseForm } from "@/components/features/expenses/expense-form";
import { ExpenseTable } from "@/components/features/expenses/expense-table";
import type { Expense } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loadExpenses, saveExpenses } from '@/lib/data-store';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

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
      return updatedExpenses;
    });
  };

  // Placeholder for delete/edit functionality if added to ExpenseTable
  // const handleDeleteExpense = (expenseId: string) => {
  //   setExpenses(prevExpenses => {
  //     const updatedExpenses = prevExpenses.filter(exp => exp.id !== expenseId);
  //     saveExpenses(updatedExpenses);
  //     return updatedExpenses;
  //   });
  // };

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
          <ExpenseTable expenses={expenses} />
        </CardContent>
      </Card>
    </div>
  );
}
