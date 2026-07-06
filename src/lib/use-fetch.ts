import { useState, useRef, useEffect } from "react";

const cache = new Map<string, unknown>();
const pending = new Map<string, Promise<unknown>>();

export function useFetch<T>(key: string | null, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(() => {
    if (!key) return null;
    return (cache.get(key) as T | null) ?? null;
  });
  const [loading, setLoading] = useState(() => {
    if (!key) return false;
    return !cache.has(key);
  });
  const [version, setVersion] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!key) return;

    const cached = cache.get(key) as T | undefined;
    if (cached !== undefined) {
      setData(cached);
      setLoading(false);
      return;
    }

    if (pending.has(key)) {
      pending.get(key)!.then((result) => {
        if (mounted.current) {
          setData(result as T);
          setLoading(false);
        }
      });
      return;
    }

    setLoading(true);
    const promise = fetcher().then((result) => {
      cache.set(key, result);
      return result;
    });
    pending.set(key, promise);
    promise.then((result) => {
      if (mounted.current) {
        setData(result as T);
        setLoading(false);
      }
    });
  }, [key, version, fetcher]);

  function refetch() {
    if (!key) return;
    cache.delete(key);
    pending.delete(key);
    setVersion((v) => v + 1);
  }

  return { data, loading, refetch };
}
