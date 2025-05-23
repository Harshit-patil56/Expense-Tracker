import { DollarSign, TrendingUp, TrendingDown, ListChecks } from "lucide-react";
import { OverviewCard } from "@/components/features/dashboard/overview-card";
import { BudgetProgressCard } from "@/components/features/budgets/budget-progress-card";
import { RecentTransactionsList } from "@/components/features/expenses/recent-transactions-list";
import { placeholderExpenses, placeholderBudgets } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

// Calculate some overview stats from placeholder data
const totalSpent = placeholderExpenses.reduce((sum, exp) => sum + exp.amount, 0);
const totalBudgeted = placeholderBudgets.reduce((sum, bud) => sum + bud.goalAmount, 0);
const incomePlaceholder = 3000; // Example income

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/expenses/add">
          <Button>Add Expense</Button>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Total Income"
          value={`$${incomePlaceholder.toFixed(2)}`}
          description="This month (placeholder)"
          icon={DollarSign}
        />
        <OverviewCard
          title="Total Spent"
          value={`$${totalSpent.toFixed(2)}`}
          description={`${placeholderExpenses.length} transactions`}
          icon={TrendingDown}
        />
        <OverviewCard
          title="Net Savings"
          value={`$${(incomePlaceholder - totalSpent).toFixed(2)}`}
          description="Income - Expenses"
          icon={TrendingUp}
        />
         <OverviewCard
          title="Active Budgets"
          value={`${placeholderBudgets.length}`}
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
            {placeholderBudgets.slice(0,3).map((budget) => (
              <BudgetProgressCard key={budget.id} budget={budget} />
            ))}
             {placeholderBudgets.length > 3 && (
              <Link href="/budgets" className="block text-center mt-2">
                <Button variant="link" className="text-primary">View All Budgets</Button>
              </Link>
            )}
            {placeholderBudgets.length === 0 && <p className="text-sm text-muted-foreground">No budgets set yet. <Link href="/budgets" className="text-primary underline">Create one?</Link></p>}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <RecentTransactionsList transactions={placeholderExpenses} />
        </div>
      </div>
      
      {/* Placeholder for AI Insights or other promotional content */}
      <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-background">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <Image src="https://placehold.co/300x200.png" alt="Financial Planning" width={300} height={200} className="rounded-lg shadow-md" data-ai-hint="finance planning" />
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
