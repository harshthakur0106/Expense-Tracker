"use client";

import { useCallback, useEffect, useState } from "react";
import { seedTransactions, type Transaction } from "@/lib/seed-data";

export const STORAGE_KEY = "spendwise-transactions";
export const TRANSACTIONS_UPDATED_EVENT = "spendwise:transactions-updated";

export function getStoredTransactions(): Transaction[] {
  if (typeof window === "undefined") {
    return seedTransactions;
  }

  try {
    const savedTransactions = window.localStorage.getItem(STORAGE_KEY);

    if (!savedTransactions) {
      return seedTransactions;
    }

    const parsed = JSON.parse(savedTransactions);
    return Array.isArray(parsed) ? parsed : seedTransactions;
  } catch {
    return seedTransactions;
  }
}

export function saveTransactions(transactions: Transaction[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  window.dispatchEvent(new CustomEvent<Transaction[]>(TRANSACTIONS_UPDATED_EVENT, { detail: transactions }));
}

export function useTransactions() {
  const [transactions, setTransactionsState] = useState<Transaction[]>(seedTransactions);
  const [isHydrated, setIsHydrated] = useState(false);

  const syncTransactions = useCallback(() => {
    setTransactionsState(getStoredTransactions());
  }, []);

  const setTransactions = useCallback((next: Transaction[] | ((current: Transaction[]) => Transaction[])) => {
    setTransactionsState((current) => {
      const resolved = typeof next === "function" ? next(current) : next;
      saveTransactions(resolved);
      return resolved;
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setTransactionsState(getStoredTransactions());
    setIsHydrated(true);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        syncTransactions();
      }
    };

    const handleTransactionsUpdate = () => {
      syncTransactions();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(TRANSACTIONS_UPDATED_EVENT, handleTransactionsUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(TRANSACTIONS_UPDATED_EVENT, handleTransactionsUpdate);
    };
  }, [syncTransactions]);

  return {
    transactions: isHydrated ? transactions : seedTransactions,
    setTransactions,
  };
}
