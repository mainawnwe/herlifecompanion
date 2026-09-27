import { useState, useEffect } from 'react';

/**
 * localStorage နဲ့ ချိတ်ဆက်ထားတဲ့ state hook
 * - Browser refresh လုပ်ရင်လည်း data မပျောက်
 * - JSON serialize/deserialize အလိုအလျောက်
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (err) {
      console.warn(`[useLocalStorage] read error for "${key}":`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(stored));
    } catch (err) {
      console.warn(`[useLocalStorage] write error for "${key}":`, err);
    }
  }, [key, stored]);

  return [stored, setStored];
}
