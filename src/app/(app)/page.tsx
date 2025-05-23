
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ListChecks } from "lucide-react";
import { OverviewCard } from "@/components/features/dashboard/overview-card";
import { BudgetProgressCard } from "@/components/features/budgets/budget-progress-card";
import { RecentTransactionsList } from "@/components/features/expenses/recent-transactions-list";
import type { Expense, BudgetGoal } from "@/lib/constants";
import { loadExpenses, loadBudgets, loadUserInfo, type UserInfo } from '@/lib/data-store';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from '@/hooks/use-currency';

const incomePlaceholder = 250000; // Example income, could be made configurable

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<BudgetGoal[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [netSavings, setNetSavings] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { currencySymbol } = useCurrency();

  const refreshDashboardData = useCallback(() => {
    const loadedExpenses = loadExpenses();
    const loadedBudgets = loadBudgets();
    const loadedUserInfo = loadUserInfo();
    
    setExpenses(loadedExpenses);
    setUserInfo(loadedUserInfo);

    // Recalculate spent amounts for budgets based on current expenses
    const spentByCategory = new Map<string, number>();
    loadedExpenses.forEach(exp => {
        spentByCategory.set(exp.category, (spentByCategory.get(exp.category) || 0) + exp.amount);
    });
    const updatedBudgets = loadedBudgets.map(budget => ({
        ...budget,
        spentAmount: spentByCategory.get(budget.category) || 0,
    }));
    setBudgets(updatedBudgets);


    const currentTotalSpent = loadedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    setTotalSpent(currentTotalSpent);
    setNetSavings(incomePlaceholder - currentTotalSpent);
  }, []);

  useEffect(() => {
    refreshDashboardData();
  }, [refreshDashboardData]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'fiscalCompassExpenses' || event.key === 'fiscalCompassBudgets' || event.key === 'fiscalCompassUserInfo') {
        refreshDashboardData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshDashboardData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {userInfo?.name ? `Welcome back, ${userInfo.name.split(' ')[0]}!` : "Dashboard"}
          </h1>
          {!userInfo?.name && <p className="text-muted-foreground">Your financial overview.</p>}
        </div>
        <Link href="/expenses">
          <Button>Add Expense</Button>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Total Income"
          value={`${currencySymbol}${incomePlaceholder.toFixed(2)}`}
          description="This month (placeholder)"
          icon={DollarSign}
        />
        <OverviewCard
          title="Total Spent"
          value={`${currencySymbol}${totalSpent.toFixed(2)}`}
          description={`${expenses.length} transactions`}
          icon={TrendingDown}
        />
        <OverviewCard
          title="Net Savings"
          value={`${currencySymbol}${netSavings.toFixed(2)}`}
          description="Income - Expenses"
          icon={TrendingUp}
        />
         <OverviewCard
          title="Active Budgets"
          value={`${budgets.length}`}
          description="Tracking progress"
          icon={ListChecks}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Budget Status */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
            <CardDescription>Overview of your budget goals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgets.slice(0,3).map((budget) => (
              <BudgetProgressCard key={budget.id} budget={budget} onDelete={() => { /* Deletion handled on budgets page */}} />
            ))}
             {budgets.length > 3 && (
              <Link href="/budgets" className="block text-center mt-2">
                <Button variant="link" className="text-primary">View All Budgets</Button>
              </Link>
            )}
            {budgets.length === 0 && <p className="text-sm text-muted-foreground">No budgets set yet. <Link href="/budgets" className="text-primary underline">Create one?</Link></p>}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <RecentTransactionsList transactions={expenses} />
        </div>
      </div>
      
      <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-background">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <Image src="https://placehold.co/300x200.png" alt="Financial Planning" width={300} height={200} className="rounded-lg shadow-md" />
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-2">Unlock Your Financial Potential</h2>
            <p className="text-muted-foreground mb-4">
              Get personalized AI-driven insights to help you save more and achieve your financial goals faster.
            </p>
            <Link href="/ai-insights">
              <Button variant="default" size="lg">
                Discover AI Tips
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

