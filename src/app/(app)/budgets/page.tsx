
"use client"; // To manage state for budgets
import React, { useState } from 'react';
import { BudgetForm } from "@/components/features/budgets/budget-form";
import { BudgetList } from "@/components/features/budgets/budget-list";
import { placeholderBudgets, placeholderExpenses, type BudgetGoal, type Expense } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Function to calculate spent amount for each category from expenses
// Optimized version: O(expenses.length + budgets.length) instead of O(expenses.length * budgets.length)
const calculateSpentAmounts = (budgets: BudgetGoal[], expenses: Expense[]): BudgetGoal[] => {
  const spentByCategory = new Map<string, number>();
  for (const expense of expenses) {
    spentByCategory.set(expense.category, (spentByCategory.get(expense.category) || 0) + expense.amount);
  }

  return budgets.map(budget => ({
    ...budget,
    spentAmount: spentByCategory.get(budget.category) || 0,
  }));
};


export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetGoal[]>(calculateSpentAmounts(placeholderBudgets, placeholderExpenses));

  const handleAddBudget = (newBudgetData: Omit<BudgetGoal, 'id' | 'spentAmount'>) => {
    const tempNewBudget: BudgetGoal = {
      ...newBudgetData,
      id: String(Date.now()),
      spentAmount: 0, // This will be correctly calculated by the optimized calculateSpentAmounts
    };
    setBudgets(prevBudgets => {
      const updatedBudgetsList = [tempNewBudget, ...prevBudgets.filter(b => b.category !== tempNewBudget.category)];
      // Call the optimized calculateSpentAmounts on the new list
      return calculateSpentAmounts(updatedBudgetsList, placeholderExpenses);
    });
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
        <p className="text-muted-foreground">Set and track your spending goals for different categories.</p>
      </div>
      
      <Card id="add-budget-form">
        <CardHeader>
          <CardTitle>Set New Budget Goal</CardTitle>
          <CardDescription>Define your spending limits for categories to stay on track.</CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetForm onSubmitSuccess={handleAddBudget} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Your Budget Goals</CardTitle>
            <CardDescription>Monitor your progress towards your financial targets.</CardDescription>
        </CardHeader>
        <CardContent>
            <BudgetList budgets={budgets} />
        </CardContent>
      </Card>
    </div>
  );
}
