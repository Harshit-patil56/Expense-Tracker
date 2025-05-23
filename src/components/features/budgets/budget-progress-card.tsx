
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { BudgetGoal } from "@/lib/constants";
import { CategoryIcon } from "@/components/icons/category-icon";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";

interface BudgetProgressCardProps {
  budget: BudgetGoal;
  onDelete: () => void;
}

export function BudgetProgressCard({ budget, onDelete }: BudgetProgressCardProps) {
  const { currencySymbol } = useCurrency();
  const progress = budget.goalAmount > 0 ? (budget.spentAmount / budget.goalAmount) * 100 : 0;
  const remaining = budget.goalAmount - budget.spentAmount;

  return (
    <Card className="relative group">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        onClick={onDelete}
        aria-label="Delete budget"
      >
        <X className="h-4 w-4" />
      </Button>
      <CardHeader className="pb-2 pr-10"> {/* Added pr-10 to avoid overlap with delete button */}
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
          Spent {currencySymbol}{budget.spentAmount.toFixed(2)} of {currencySymbol}{budget.goalAmount.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} aria-label={`${budget.category} budget progress`} className={progress > 100 ? "[&>div]:bg-destructive" : ""} />
        <p className="text-xs text-muted-foreground mt-2">
          {remaining >= 0 ? `${currencySymbol}${remaining.toFixed(2)} remaining` : `${currencySymbol}${Math.abs(remaining).toFixed(2)} over budget`}
        </p>
      </CardContent>
    </Card>
  );
}
