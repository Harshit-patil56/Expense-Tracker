"use client"; // Make this a client component to manage state for expenses
import React, { useState } from 'react';
import { ExpenseForm } from "@/components/features/expenses/expense-form";
import { ExpenseTable } from "@/components/features/expenses/expense-table";
import { placeholderExpenses, type Expense } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExpensesPage() {
  // Use state to manage expenses if they are to be updated on this page
  const [expenses, setExpenses] = useState<Expense[]>(placeholderExpenses);

  const handleAddExpense = (newExpenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: String(Date.now()), // simple unique id
    };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
  };


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
