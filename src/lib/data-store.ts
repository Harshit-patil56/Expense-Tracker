
// src/lib/data-store.ts
'use client';

import type { Expense, BudgetGoal } from './constants';

const EXPENSES_KEY = 'fiscalCompassExpenses';
const BUDGETS_KEY = 'fiscalCompassBudgets';
const USER_INFO_KEY = 'fiscalCompassUserInfo';
const SETUP_COMPLETE_KEY = 'fiscalCompassSetupComplete';

export interface UserInfo {
  name: string;
  email: string;
  currency?: string;
  totalIncome?: number; // Added totalIncome
}

// Helper to safely access localStorage
const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;

    const parsed = JSON.parse(item, (k, v) => {
      if (k === 'date' && typeof v === 'string' && v.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
        return new Date(v);
      }
      return v;
    });
    return parsed;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    window.localStorage.removeItem(key); // Clear corrupted item
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
  return getLocalStorageItem<Expense[]>(EXPENSES_KEY, []);
};

export const saveExpenses = (expenses: Expense[]): void => {
  setLocalStorageItem(EXPENSES_KEY, expenses);
};

export const loadBudgets = (): BudgetGoal[] => {
  return getLocalStorageItem<BudgetGoal[]>(BUDGETS_KEY, []);
};

export const saveBudgets = (budgets: BudgetGoal[]): void => {
  setLocalStorageItem(BUDGETS_KEY, budgets);
};

export const loadUserInfo = (): UserInfo | null => {
  const defaultUserInfo: UserInfo = { name: '', email: '', currency: 'INR', totalIncome: 0 };
  const userInfo = getLocalStorageItem<UserInfo | null>(USER_INFO_KEY, null);
  if (userInfo) {
    // Ensure totalIncome has a default if it's missing from old stored data
    return { ...defaultUserInfo, ...userInfo, totalIncome: userInfo.totalIncome ?? 0 };
  }
  return null;
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

export const getCurrencySymbol = (currencyCode: string | undefined): string => {
    switch (currencyCode) {
        case 'USD': return '$';
        case 'EUR': return '€';
        case 'GBP': return '£';
        case 'CAD': return 'C$';
        case 'INR':
        default:
            return '₹';
    }
};

export const initializeLocalData = (): void => {
    // This function is a placeholder if needed for future sample data features.
};
