
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { BudgetGoal } from "@/lib/constants";
import { CategoryIcon } from "@/components/icons/category-icon";

interface BudgetProgressCardProps {
  budget: BudgetGoal;
}

export function BudgetProgressCard({ budget }: BudgetProgressCardProps) {
  const progress = budget.goalAmount > 0 ? (budget.spentAmount / budget.goalAmount) * 100 : 0;
  const remaining = budget.goalAmount - budget.spentAmount;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
                <CategoryIcon categoryName={budget.category} className="h-5 w-5" />
                {budget.category}
            </CardTitle>
            <span className={`text-sm font-semibold ${progress > 100 ? 'text-destructive' : 'text-accent-foreground'}`}>
                {progress.toFixed(0)}%
            </span>
        </div>
        <CardDescription>
          Spent ₹{budget.spentAmount.toFixed(2)} of ₹{budget.goalAmount.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} aria-label={`${budget.category} budget progress`} className={progress > 100 ? "[&>div]:bg-destructive" : ""} />
        <p className="text-xs text-muted-foreground mt-2">
          {remaining >= 0 ? `₹${remaining.toFixed(2)} remaining` : `₹${Math.abs(remaining).toFixed(2)} over budget`}
        </p>
      </CardContent>
    </Card>
  );
}
