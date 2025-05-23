"use client"; // To manage state for budgets
import React, { useState } from 'react';
import { BudgetForm } from "@/components/features/budgets/budget-form";
import { BudgetList } from "@/components/features/budgets/budget-list";
import { placeholderBudgets, placeholderExpenses, type BudgetGoal } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Function to calculate spent amount for each category from expenses
const calculateSpentAmounts = (budgets: BudgetGoal[], expenses: typeof placeholderExpenses): BudgetGoal[] => {
  return budgets.map(budget => {
    const spentAmount = expenses
      .filter(expense => expense.category === budget.category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return { ...budget, spentAmount };
  });
};


export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetGoal[]>(calculateSpentAmounts(placeholderBudgets, placeholderExpenses));

  const handleAddBudget = (newBudgetData: Omit<BudgetGoal, 'id' | 'spentAmount'>) => {
    const newBudget: BudgetGoal = {
      ...newBudgetData,
      id: String(Date.now()),
      spentAmount: placeholderExpenses
        .filter(expense => expense.category === newBudgetData.category)
        .reduce((sum, expense) => sum + expense.amount, 0),
    };
    setBudgets(prevBudgets => calculateSpentAmounts([newBudget, ...prevBudgets.filter(b => b.category !== newBudget.category)], placeholderExpenses));
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
