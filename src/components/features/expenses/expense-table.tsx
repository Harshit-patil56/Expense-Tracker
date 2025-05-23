
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Expense } from "@/lib/constants";
import { CATEGORIES } from "@/lib/constants";
import { CategoryIcon } from "@/components/icons/category-icon";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExpenseTableProps {
  expenses: Expense[];
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  if (expenses.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No expenses recorded yet.</p>;
  }
  return (
    <div className="rounded-md border">
    <Table>
      <TableCaption>A list of your recent expenses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-[50px] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => {
          const categoryInfo = CATEGORIES.find(c => c.name === expense.category);
          return (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">
                {expense.date.toLocaleDateString()}
              </TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>
                <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                  {categoryInfo && <CategoryIcon categoryName={expense.category} className="h-3.5 w-3.5" />}
                  {expense.category}
                </Badge>
              </TableCell>
              <TableCell className="text-right">₹{expense.amount.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => console.log(`Edit ${expense.id}`)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log(`Duplicate ${expense.id}`)}>Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => console.log(`Delete ${expense.id}`)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </div>
  );
}
