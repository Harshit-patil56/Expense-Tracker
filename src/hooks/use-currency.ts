
"use client";

import { useState, useEffect, useCallback } from 'react';
import { loadUserInfo, getCurrencySymbol as getSymbol } from '@/lib/data-store';

export function useCurrency() {
  const [currencySymbol, setCurrencySymbol] = useState<string>('₹'); // Default to INR
  const [currencyCode, setCurrencyCode] = useState<string>('INR');

  const updateCurrency = useCallback(() => {
    const userInfo = loadUserInfo();
    const code = userInfo?.currency || 'INR';
    setCurrencyCode(code);
    setCurrencySymbol(getSymbol(code));
  }, []);

  useEffect(() => {
    updateCurrency();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'fiscalCompassUserInfo') {
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
