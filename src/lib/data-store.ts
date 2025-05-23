
// src/lib/data-store.ts
'use client';

import type { Expense, BudgetGoal } from './constants';
// placeholderExpenses and placeholderBudgets are no longer used for default initialization for new users.
// They can remain for reference or potential future "load sample data" features.

const EXPENSES_KEY = 'fiscalCompassExpenses';
const BUDGETS_KEY = 'fiscalCompassBudgets';
const USER_INFO_KEY = 'fiscalCompassUserInfo';
const SETUP_COMPLETE_KEY = 'fiscalCompassSetupComplete';

export interface UserInfo {
  name: string;
  email: string;
}

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
  // New users start with an empty list
  return getLocalStorageItem<Expense[]>(EXPENSES_KEY, []);
};

export const saveExpenses = (expenses: Expense[]): void => {
  setLocalStorageItem(EXPENSES_KEY, expenses);
};

export const loadBudgets = (): BudgetGoal[] => {
  // New users start with an empty list
  return getLocalStorageItem<BudgetGoal[]>(BUDGETS_KEY, []);
};

export const saveBudgets = (budgets: BudgetGoal[]): void => {
  setLocalStorageItem(BUDGETS_KEY, budgets);
};

export const loadUserInfo = (): UserInfo | null => {
  return getLocalStorageItem<UserInfo | null>(USER_INFO_KEY, null);
};

export const saveUserInfo = (userInfo: UserInfo): void => {
  setLocalStorageItem(USER_INFO_KEY, userInfo);
};

export const hasCompletedSetup = (): boolean => {
  return getLocalStorageItem<boolean>(SETUP_COMPLETE_KEY, false);
};

export const markSetupAsComplete = (): void => {
  setLocalStorageItem(SETUP_COMPLETE_KEY, true);
};

// This function is no longer needed for automatic placeholder initialization.
// It could be repurposed if a "load sample data" feature is added.
export const initializeLocalData = (): void => {
    // console.log("initializeLocalData called, but now only ensures keys exist if logic requires, doesn't populate by default for new users.");
    // if (typeof window !== 'undefined') {
    //     if (localStorage.getItem(EXPENSES_KEY) === null) {
    //         saveExpenses([]); // Start with empty
    //     }
    //     if (localStorage.getItem(BUDGETS_KEY) === null) {
    //         saveBudgets([]); // Start with empty
    //     }
    // }
};
