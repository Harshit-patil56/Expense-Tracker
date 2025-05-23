
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CategoryIcon } from "@/components/icons/category-icon";
import type { Expense } from "@/lib/constants";

interface RecentTransactionsListProps {
  transactions: Expense[];
}

export function RecentTransactionsList({ transactions }: RecentTransactionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest spending activities.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.length === 0 && <p className="text-sm text-muted-foreground">No recent transactions.</p>}
        {transactions.slice(0, 5).map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-secondary">
                <CategoryIcon categoryName={transaction.category} className="h-5 w-5 text-secondary-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium leading-none">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">{transaction.category} - {transaction.date.toLocaleDateString()}</p>
            </div>
            <div className="text-sm font-medium">-₹{transaction.amount.toFixed(2)}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
