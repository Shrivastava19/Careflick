import { useState, useEffect, useCallback } from 'react';
import { User, ApiUser } from '../types';
import { useAppContext } from '../context/AppContext';

// ─── useDebounce ──────────────────────────────────────────────────────────────
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── useUsers ─────────────────────────────────────────────────────────────────
export function useUsers() {
  const { users, setUsers } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (hasFetched) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch users`);
      const data: ApiUser[] = await res.json();
      const mapped: User[] = data.map((u) => ({
        ...u,
        isLocal: false,
      }));
      setUsers(mapped);
      setHasFetched(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [hasFetched, setUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}

// ─── usePagination ────────────────────────────────────────────────────────────
export function usePagination<T>(items: T[], pageSize: number = 6) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / pageSize);
  const paginated = items.slice((page - 1) * pageSize, page * pageSize);

  // Reset to page 1 when items change (e.g. search filter applied)
  useEffect(() => {
    setPage(1);
  }, [items.length]);

  return { page, setPage, totalPages, paginated };
}
