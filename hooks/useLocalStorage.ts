// fix: Import Dispatch and SetStateAction to avoid needing the 'React' namespace.
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// fix: Use Dispatch and SetStateAction directly in the return type.
export function useLocalStorage<T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
        console.error(error);
    }
  }, [key]);

  // fix: Use Dispatch and SetStateAction directly in the type cast.
  return [storedValue, setValue as Dispatch<SetStateAction<T>>];
}
