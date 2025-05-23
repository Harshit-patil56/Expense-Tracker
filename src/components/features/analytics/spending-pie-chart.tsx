"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartTooltipContent, ChartContainer } from "@/components/ui/chart"
import type { Expense, Category } from "@/lib/constants"
import { CATEGORIES } from "@/lib/constants"

interface SpendingPieChartProps {
  expenses: Expense[]
}

// Generate distinct colors for pie chart segments
const PIE_CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(200, 70%, 50%)", // Additional distinct colors
  "hsl(30, 90%, 60%)",
  "hsl(270, 60%, 70%)",
];


export function SpendingPieChart({ expenses }: SpendingPieChartProps) {
  const dataByCategory = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category)
    if (existing) {
      existing.value += expense.amount
    } else {
      acc.push({ name: expense.category, value: expense.amount })
    }
    return acc
  }, [] as { name: string; value: number }[]);

  const chartConfig = CATEGORIES.reduce((config, category, index) => {
    config[category.name] = {
      label: category.name,
      color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
    };
    return config;
  }, {} as Record<string, {label: string; color: string}>);

  if (dataByCategory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Distribution</CardTitle>
          <CardDescription>Pie chart showing proportion of spending by category.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available for pie chart.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Distribution</CardTitle>
        <CardDescription>Pie chart showing proportion of spending by category.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={dataByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {dataByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartConfig[entry.name]?.color || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: '12px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
