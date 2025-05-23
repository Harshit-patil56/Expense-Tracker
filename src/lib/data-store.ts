
// src/lib/data-store.ts
'use client';

import type { Expense, BudgetGoal } from './constants';

// Base keys (will be prefixed per user)
const EXPENSES_KEY_BASE = 'fiscalCompassExpenses';
const BUDGETS_KEY_BASE = 'fiscalCompassBudgets';
const USER_INFO_KEY_BASE = 'fiscalCompassUserInfo';
const SETUP_COMPLETE_KEY_BASE = 'fiscalCompassSetupComplete';

// Global key to store the identifier of the currently active user
const ACTIVE_USER_ID_KEY = 'fiscalCompassActiveUserId';

export interface UserInfo {
  name: string;
  email: string;
  currency: string; // Now required
  totalIncome: number; // Now required
}

// Helper to sanitize strings for use in localStorage keys
const sanitizeForKey = (str: string): string => {
  return str.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
};

// Generates a unique prefix for a user based on name and email
const generateUserPrefix = (name: string, email: string): string => {
  const saneName = sanitizeForKey(name);
  const saneEmail = sanitizeForKey(email);
  return `user_${saneName}_${saneEmail}`;
};

// Retrieves the prefix for the currently active user
let memoizedActiveUserPrefix: string | null = undefined; // Use undefined to signify not yet fetched

const getActiveUserPrefix = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  if (memoizedActiveUserPrefix === undefined) {
    memoizedActiveUserPrefix = window.localStorage.getItem(ACTIVE_USER_ID_KEY);
  }
  return memoizedActiveUserPrefix;
};

// Call this if the active user changes (e.g., after setup or if a user switch feature is added)
const resetMemoizedActiveUserPrefix = (): void => {
  memoizedActiveUserPrefix = undefined;
};

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
  const prefix = getActiveUserPrefix();
  if (!prefix) return [];
  return getLocalStorageItem<Expense[]>(`${prefix}_${EXPENSES_KEY_BASE}`, []);
};

export const saveExpenses = (expenses: Expense[]): void => {
  const prefix = getActiveUserPrefix();
  if (!prefix) {
    console.warn("Cannot save expenses, no active user prefix.");
    return;
  }
  setLocalStorageItem(`${prefix}_${EXPENSES_KEY_BASE}`, expenses);
};

export const loadBudgets = (): BudgetGoal[] => {
  const prefix = getActiveUserPrefix();
  if (!prefix) return [];
  return getLocalStorageItem<BudgetGoal[]>(`${prefix}_${BUDGETS_KEY_BASE}`, []);
};

export const saveBudgets = (budgets: BudgetGoal[]): void => {
  const prefix = getActiveUserPrefix();
  if (!prefix) {
    console.warn("Cannot save budgets, no active user prefix.");
    return;
  }
  setLocalStorageItem(`${prefix}_${BUDGETS_KEY_BASE}`, budgets);
};

export const loadUserInfo = (): UserInfo | null => {
  const prefix = getActiveUserPrefix();
  if (!prefix) return null;
  
  const storedUserInfo = getLocalStorageItem<UserInfo | null>(`${prefix}_${USER_INFO_KEY_BASE}`, null);
  if (storedUserInfo) {
    // Ensure default values for currency and totalIncome if they are somehow missing (though unlikely with new setup)
    return {
      name: storedUserInfo.name,
      email: storedUserInfo.email,
      currency: storedUserInfo.currency || 'INR',
      totalIncome: storedUserInfo.totalIncome ?? 0,
    };
  }
  return null;
};

export const saveUserInfo = (userInfo: UserInfo): void => {
  if (typeof window === 'undefined') return;

  const userPrefix = generateUserPrefix(userInfo.name, userInfo.email);
  setLocalStorageItem(ACTIVE_USER_ID_KEY, userPrefix);
  setLocalStorageItem(`${userPrefix}_${USER_INFO_KEY_BASE}`, userInfo);
  resetMemoizedActiveUserPrefix(); // Ensure the memoized prefix is updated
  // Dispatch a storage event to notify other tabs/components about user change
  window.dispatchEvent(new StorageEvent('storage', { key: ACTIVE_USER_ID_KEY }));
  window.dispatchEvent(new StorageEvent('storage', { key: `${userPrefix}_${USER_INFO_KEY_BASE}` }));
};

export const hasActiveUserCompletedSetup = (): boolean => {
  const prefix = getActiveUserPrefix();
  if (!prefix) return false; // No active user means setup not complete for anyone "active"
  return getLocalStorageItem<boolean>(`${prefix}_${SETUP_COMPLETE_KEY_BASE}`, false);
};

export const markSetupAsComplete = (): void => {
  const prefix = getActiveUserPrefix();
  if (!prefix) {
    console.warn("Cannot mark setup as complete, no active user prefix.");
    return;
  }
  setLocalStorageItem(`${prefix}_${SETUP_COMPLETE_KEY_BASE}`, true);
  // Dispatch storage event for setup completion
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new StorageEvent('storage', { key: `${prefix}_${SETUP_COMPLETE_KEY_BASE}` }));
  }
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

export const clearAllUserData = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  const prefix = getActiveUserPrefix();

  if (prefix) {
    window.localStorage.removeItem(`${prefix}_${EXPENSES_KEY_BASE}`);
    window.localStorage.removeItem(`${prefix}_${BUDGETS_KEY_BASE}`);
    window.localStorage.removeItem(`${prefix}_${USER_INFO_KEY_BASE}`);
    window.localStorage.removeItem(`${prefix}_${SETUP_COMPLETE_KEY_BASE}`);
  }
  window.localStorage.removeItem(ACTIVE_USER_ID_KEY);
  resetMemoizedActiveUserPrefix(); // Clear memoized prefix
  // Dispatch storage events for data clearing
  window.dispatchEvent(new StorageEvent('storage', { key: ACTIVE_USER_ID_KEY, oldValue: prefix, newValue: null }));
  // Potentially dispatch events for other cleared keys too, if components listen to them specifically
};

// Call this on initial app load if needed, or after specific user-switching actions
export const reinitializeActiveUserPrefix = (): void => {
    resetMemoizedActiveUserPrefix();
    getActiveUserPrefix(); // Re-fetch and memoize
}
