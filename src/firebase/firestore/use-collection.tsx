'use client';

import { useState, useEffect } from 'react';
import {
  DatabaseReference,
  onValue,
  off,
  DataSnapshot,
  Query,
} from 'firebase/database';

export type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useCollection<T = any>(
  memoizedDbQuery: DatabaseReference | Query | null | undefined
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!memoizedDbQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);

    const handleValue = (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const value = snapshot.val();
        const list: WithId<T>[] = Object.keys(value).map(key => ({
          ...value[key],
          id: key,
        }));
        setData(list);
      } else {
        setData([]);
      }
      setIsLoading(false);
      setError(null);
    };

    const handleError = (err: Error) => {
      console.error(err);
      setError(err);
      setIsLoading(false);
    };

    onValue(memoizedDbQuery, handleValue, handleError);

    const unsubscribe = () => {
      off(memoizedDbQuery, 'value', handleValue);
    };

    return unsubscribe;
  }, [memoizedDbQuery]);

  return { data, isLoading, error };
}
