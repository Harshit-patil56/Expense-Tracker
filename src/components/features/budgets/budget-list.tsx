import type { BudgetGoal } from "@/lib/constants";
import { BudgetProgressCard } from "./budget-progress-card";
import Link from "next/link";

interface BudgetListProps {
  budgets: BudgetGoal[];
}

export function BudgetList({ budgets }: BudgetListProps) {
  if (budgets.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">You haven't set any budget goals yet.</p>
        <p className="mt-2">
            Why not <Link href="#add-budget-form" className="text-primary underline">create one now</Link> to start tracking?
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => (
        <BudgetProgressCard key={budget.id} budget={budget} />
      ))}
    </div>
  );
}
