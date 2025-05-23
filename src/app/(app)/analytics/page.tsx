
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { SpendingBarChart } from "@/components/features/analytics/spending-bar-chart";
import { SpendingPieChart } from "@/components/features/analytics/spending-pie-chart";
import type { Expense } from "@/lib/constants";
import { loadExpenses } from '@/lib/data-store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [topSpendingCategory, setTopSpendingCategory] = useState<{ name: string; amount: number } | null>(null);
  const [averageDailySpend, setAverageDailySpend] = useState<number>(0);
  const [mostFrequentExpenseType, setMostFrequentExpenseType] = useState<string | null>(null);
  // Savings rate would require income, which is currently a placeholder or needs to be user-input
  // For now, we'll omit dynamic savings rate calculation here.

  const refreshAnalyticsData = useCallback(() => {
    const loadedExpenses = loadExpenses();
    setExpenses(loadedExpenses);

    if (loadedExpenses.length > 0) {
      // Top Spending Category
      const spendingByCategory: Record<string, number> = {};
      loadedExpenses.forEach(exp => {
        spendingByCategory[exp.category] = (spendingByCategory[exp.category] || 0) + exp.amount;
      });
      const topCat = Object.entries(spendingByCategory).sort(([,a],[,b]) => b-a)[0];
      if (topCat) {
        setTopSpendingCategory({ name: topCat[0], amount: topCat[1] });
      } else {
        setTopSpendingCategory(null);
      }

      // Average Daily Spend
      const totalSpent = loadedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const uniqueDays = new Set(loadedExpenses.map(exp => exp.date.toDateString())).size;
      setAverageDailySpend(uniqueDays > 0 ? totalSpent / uniqueDays : 0);
      
      // Most Frequent Expense Type (Category)
      const categoryCounts: Record<string, number> = {};
      loadedExpenses.forEach(exp => {
        categoryCounts[exp.category] = (categoryCounts[exp.category] || 0) + 1;
      });
      const freqCat = Object.entries(categoryCounts).sort(([,a],[,b]) => b-a)[0];
      setMostFrequentExpenseType(freqCat ? freqCat[0] : null);

    } else {
      setTopSpendingCategory(null);
      setAverageDailySpend(0);
      setMostFrequentExpenseType(null);
    }
  }, []);
  
  useEffect(() => {
    refreshAnalyticsData();
  }, [refreshAnalyticsData]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'fiscalCompassExpenses') {
        refreshAnalyticsData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshAnalyticsData]);
  
  const handleExportData = () => {
    toast({ title: "Export Data", description: "This feature is coming soon!" });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Visualize your spending habits and financial patterns.</p>
        </div>
        <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <SpendingBarChart expenses={expenses} />
        <SpendingPieChart expenses={expenses} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Insights Overview</CardTitle>
          <CardDescription>Summary of key financial metrics and trends.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold">Top Spending Category</h3>
                    {topSpendingCategory ? (
                        <p className="text-primary text-xl">{topSpendingCategory.name} (₹{topSpendingCategory.amount.toFixed(2)})</p>
                    ) : (
                        <p className="text-muted-foreground text-xl">N/A</p>
                    )}
                </div>
                <div>
                    <h3 className="font-semibold">Average Daily Spend</h3>
                    <p className="text-primary text-xl">₹{averageDailySpend.toFixed(2)}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Most Frequent Expense Category</h3>
                     {mostFrequentExpenseType ? (
                        <p className="text-primary text-xl">{mostFrequentExpenseType}</p>
                    ) : (
                        <p className="text-muted-foreground text-xl">N/A</p>
                    )}
                </div>
                 <div>
                    <h3 className="font-semibold">Savings Rate</h3>
                    <p className="text-accent-foreground text-xl">XX%</p>
                    {/* TODO: Calculate this dynamically based on income (requires income input) */}
                </div>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
                More detailed reports and custom date range filtering will be available soon.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
