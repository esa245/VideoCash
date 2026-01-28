'use client';
    
import { useState, useEffect } from 'react';
import {
  DatabaseReference,
  onValue,
  off,
  DataSnapshot,
} from 'firebase/database';

export type WithId<T> = T & { id: string };

export interface UseDocResult<T> {
  data: WithId<T> | null;
  isLoading: boolean;
  error: Error | null;
}

export function useDoc<T = any>(
  memoizedDbRef: DatabaseReference | null | undefined
): UseDocResult<T> {
  const [data, setData] = useState<WithId<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!memoizedDbRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);

    const handleValue = (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        setData({ ...snapshot.val(), id: snapshot.key as string });
      } else {
        setData(null);
      }
      setIsLoading(false);
      setError(null);
    };

    const handleError = (err: Error) => {
      console.error(err);
      setError(err);
      setIsLoading(false);
    };

    onValue(memoizedDbRef, handleValue, handleError);

    const unsubscribe = () => {
      off(memoizedDbRef, 'value', handleValue);
    };

    return unsubscribe;
  }, [memoizedDbRef]);

  return { data, isLoading, error };
}
