
// src/lib/data-store.ts
'use client';

import type { Expense, BudgetGoal } from './constants';
import { placeholderExpenses, placeholderBudgets } from './constants';

const EXPENSES_KEY = 'fiscalCompassExpenses';
const BUDGETS_KEY = 'fiscalCompassBudgets';

// Helper to safely access localStorage
const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;

    // Revive dates properly from ISO strings
    const parsed = JSON.parse(item, (k, v) => {
      if (k === 'date' && typeof v === 'string' && v.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
        return new Date(v);
      }
      return v;
    });
    return parsed;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    // If parsing fails or any other error, remove the corrupted item and return default
    window.localStorage.removeItem(key);
    return defaultValue;
  }
};

const setLocalStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
};

export const loadExpenses = (): Expense[] => {
  return getLocalStorageItem<Expense[]>(EXPENSES_KEY, placeholderExpenses);
};

export const saveExpenses = (expenses: Expense[]): void => {
  setLocalStorageItem(EXPENSES_KEY, expenses);
};

export const loadBudgets = (): BudgetGoal[] => {
  return getLocalStorageItem<BudgetGoal[]>(BUDGETS_KEY, placeholderBudgets);
};

export const saveBudgets = (budgets: BudgetGoal[]): void => {
  setLocalStorageItem(BUDGETS_KEY, budgets);
};

// Initialize localStorage with placeholder data if it's empty
// This should be called once, e.g., in a top-level layout component or on app start.
// For now, loadExpenses/loadBudgets handle returning placeholders if localStorage is empty.
export const initializeLocalData = (): void => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem(EXPENSES_KEY) === null) {
            saveExpenses(placeholderExpenses);
        }
        if (localStorage.getItem(BUDGETS_KEY) === null) {
            saveBudgets(placeholderBudgets);
        }
    }
};
