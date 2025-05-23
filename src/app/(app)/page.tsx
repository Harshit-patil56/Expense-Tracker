
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ListChecks, PlusCircle } from "lucide-react";
import { OverviewCard } from "@/components/features/dashboard/overview-card";
import { BudgetProgressCard } from "@/components/features/budgets/budget-progress-card";
import { RecentTransactionsList } from "@/components/features/expenses/recent-transactions-list";
import type { Expense, BudgetGoal } from "@/lib/constants";
import { loadExpenses, loadBudgets, loadUserInfo, saveUserInfo, type UserInfo } from '@/lib/data-store';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from '@/hooks/use-currency';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<BudgetGoal[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [netSavings, setNetSavings] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { currencySymbol } = useCurrency();
  const { toast } = useToast();

  const [isAddIncomeDialogOpen, setIsAddIncomeDialogOpen] = useState(false);
  const [incomeToAdd, setIncomeToAdd] = useState<string>("");

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
    
    const currentIncome = loadedUserInfo?.totalIncome ?? 0;
    setNetSavings(currentIncome - currentTotalSpent);
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

  const displayIncome = userInfo?.totalIncome ?? 0;

  const handleAddIncomeSubmit = () => {
    const amount = parseFloat(incomeToAdd);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number for income.",
        variant: "destructive",
      });
      return;
    }

    const currentUserInfo = loadUserInfo() || { name: '', email: '', totalIncome: 0, currency: 'INR' };
    const updatedIncome = (currentUserInfo.totalIncome || 0) + amount;
    
    saveUserInfo({ ...currentUserInfo, totalIncome: updatedIncome });
    
    toast({
      title: "Income Added",
      description: `${currencySymbol}${amount.toFixed(2)} added to your total income.`,
    });
    
    refreshDashboardData(); // Refresh dashboard to show new income
    setIsAddIncomeDialogOpen(false);
    setIncomeToAdd("");
    window.dispatchEvent(new Event('storage')); // Notify other components
  };

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currencySymbol}{displayIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Your estimated monthly income</p>
            <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => setIsAddIncomeDialogOpen(true)}>
              <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
              Add Income
            </Button>
          </CardContent>
        </Card>
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

      {/* Add Income Dialog */}
      <Dialog open={isAddIncomeDialogOpen} onOpenChange={setIsAddIncomeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Income</DialogTitle>
            <DialogDescription>
              Enter the amount you want to add to your current total income.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="income-amount" className="text-right">
                Amount ({currencySymbol})
              </Label>
              <Input
                id="income-amount"
                type="number"
                step="0.01"
                value={incomeToAdd}
                onChange={(e) => setIncomeToAdd(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 100.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddIncomeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddIncomeSubmit}>Add to Total Income</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
