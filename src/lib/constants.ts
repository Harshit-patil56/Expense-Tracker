import type { LucideIcon } from 'lucide-react';

export interface Category {
  name: string;
  iconName: keyof typeof import('lucide-react'); // Store icon name for dynamic import
  color?: string; // Optional color for category specific styling
}

export const CATEGORIES: Category[] = [
  { name: "Food", iconName: "Utensils", color: "text-red-500" },
  { name: "Transport", iconName: "Car", color: "text-blue-500" },
  { name: "Entertainment", iconName: "Ticket", color: "text-yellow-500" },
  { name: "Utilities", iconName: "Home", color: "text-green-500" },
  { name: "Shopping", iconName: "ShoppingBag", color: "text-purple-500" },
  { name: "Clothing", iconName: "Shirt", color: "text-pink-500" },
  { name: "Health", iconName: "HeartPulse", color: "text-red-700" },
  { name: "Education", iconName: "BookOpen", color: "text-indigo-500" },
  { name: "Gifts", iconName: "Gift", color: "text-orange-500" },
  { name: "Other", iconName: "HelpCircle", color: "text-gray-500" },
];

export interface Expense {
  id: string;
  date: Date;
  description: string;
  category: string;
  amount: number;
}

export const placeholderExpenses: Expense[] = [
  { id: '1', date: new Date(2024, 6, 20), description: 'Groceries for the week', category: 'Food', amount: 75.50 },
  { id: '2', date: new Date(2024, 6, 20), description: 'Monthly bus pass', category: 'Transport', amount: 40.00 },
  { id: '3', date: new Date(2024, 6, 19), description: 'Cinema tickets - new blockbuster', category: 'Entertainment', amount: 30.00 },
  { id: '4', date: new Date(2024, 6, 18), description: 'Electricity bill for June', category: 'Utilities', amount: 120.00 },
  { id: '5', date: new Date(2024, 6, 17), description: 'Summer T-shirt', category: 'Clothing', amount: 25.00 },
  { id: '6', date: new Date(2024, 6, 16), description: 'Painkillers and vitamins', category: 'Health', amount: 15.25 },
  { id: '7', date: new Date(2024, 6, 15), description: 'Online course subscription', category: 'Education', amount: 49.99 },
];

export interface BudgetGoal {
  id: string;
  category: string;
  goalAmount: number;
  spentAmount: number;
}

export const placeholderBudgets: BudgetGoal[] = [
  { id: '1', category: 'Food', goalAmount: 500, spentAmount: 310.75 },
  { id: '2', category: 'Entertainment', goalAmount: 150, spentAmount: 90.00 },
  { id: '3', category: 'Shopping', goalAmount: 200, spentAmount: 190.50 },
  { id: '4', category: 'Utilities', goalAmount: 250, spentAmount: 120.00 },
];
