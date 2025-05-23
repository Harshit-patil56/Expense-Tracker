
"use client";

import { useState, useEffect, useCallback } from 'react';
import { loadUserInfo, getCurrencySymbol as getSymbol, reinitializeActiveUserPrefix } from '@/lib/data-store';

export function useCurrency() {
  const [currencySymbol, setCurrencySymbol] = useState<string>('₹'); // Default
  const [currencyCode, setCurrencyCode] = useState<string>('INR'); // Default

  const updateCurrency = useCallback(() => {
    const userInfo = loadUserInfo(); // This now loads for the active user
    const code = userInfo?.currency || 'INR'; // UserInfo.currency is now required
    setCurrencyCode(code);
    setCurrencySymbol(getSymbol(code));
  }, []);

  useEffect(() => {
    // Ensure the prefix is initialized before first update
    reinitializeActiveUserPrefix();
    updateCurrency();

    const handleStorageChange = (event: StorageEvent) => {
      // Listen for changes to active user or specific user info
      if (event.key === 'fiscalCompassActiveUserId' || 
          (event.key && event.key.endsWith('fiscalCompassUserInfo')) ||
          (event.key && event.key.endsWith('fiscalCompassSetupComplete')) // Also listen for setup completion
      ) {
        reinitializeActiveUserPrefix(); // Make sure the prefix is up-to-date
        updateCurrency();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [updateCurrency]);

  return { currencySymbol, currencyCode };
}
