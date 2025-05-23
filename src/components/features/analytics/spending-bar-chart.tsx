
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartTooltipContent, ChartContainer } from "@/components/ui/chart"
import type { Expense } from "@/lib/constants"

interface SpendingBarChartProps {
  expenses: Expense[]
}

export function SpendingBarChart({ expenses }: SpendingBarChartProps) {
  const dataByCategory = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.category === expense.category)
    if (existing) {
      existing.total += expense.amount
    } else {
      acc.push({ category: expense.category, total: expense.amount })
    }
    return acc
  }, [] as { category: string; total: number }[])

  const chartConfig = {
    total: {
      label: "Total Spent",
      color: "hsl(var(--primary))",
    },
  }

  if (dataByCategory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Bar chart showing total spending per category.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available for bar chart.</p>
        </CardContent>
      </Card>
    )
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Bar chart showing total spending per category.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataByCategory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="category" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
              <Tooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
