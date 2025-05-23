
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { BudgetForm } from "@/components/features/budgets/budget-form";
import { BudgetList } from "@/components/features/budgets/budget-list";
import type { BudgetGoal, Expense } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loadBudgets, saveBudgets, loadExpenses } from '@/lib/data-store';

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
  const [budgets, setBudgets] = useState<BudgetGoal[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);

  const refreshBudgetsWithSpentAmounts = useCallback(() => {
    const currentBudgets = loadBudgets();
    const currentExpenses = loadExpenses(); // Load expenses for calculation
    setAllExpenses(currentExpenses); // Keep a copy for other potential uses
    setBudgets(calculateSpentAmounts(currentBudgets, currentExpenses));
  }, []);

  useEffect(() => {
    refreshBudgetsWithSpentAmounts();
  }, [refreshBudgetsWithSpentAmounts]);

  // Effect to re-calculate spent amounts if expenses change from another part of the app
  // This uses a simple localStorage event listener as a basic cross-tab/component sync trigger
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'fiscalCompassExpenses' || event.key === 'fiscalCompassBudgets') {
        refreshBudgetsWithSpentAmounts();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshBudgetsWithSpentAmounts]);


  const handleAddBudget = (newBudgetData: Omit<BudgetGoal, 'id' | 'spentAmount'>) => {
    const tempNewBudget: BudgetGoal = {
      ...newBudgetData,
      id: String(Date.now()),
      spentAmount: 0, // Will be recalculated
    };
    
    const currentBudgets = loadBudgets();
    const updatedBudgetsList = [tempNewBudget, ...currentBudgets.filter(b => b.category !== tempNewBudget.category)];
    saveBudgets(updatedBudgetsList);
    refreshBudgetsWithSpentAmounts(); // Recalculate with potentially new expenses too
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
