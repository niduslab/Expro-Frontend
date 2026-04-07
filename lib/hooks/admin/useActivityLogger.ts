import { useCallback, useEffect, useRef, useState } from "react";
import { fetchActivityLogs } from "@/lib/api/functions/admin/activityLoggerApi"; // adjust path
import type {
  ActivityLog,
  ActivityLogFilters,
  ActivityLogPagination,
  UseActivityLogsReturn,
} from "@/lib/types/admin/ActivityLoggerType";

const DEFAULT_FILTERS: ActivityLogFilters = {
  page: 1,
  per_page: 15,
};

/**
 * useActivityLogs
 *
 * Fetches paginated activity logs with filter, search, and pagination support.
 *
 * @param initialFilters - Optional initial filter values merged with defaults.
 *
 * @example
 * const {
 *   logs, pagination, isLoading, isError, error,
 *   filters, setFilters, resetFilters, refetch, goToPage,
 * } = useActivityLogs({ per_page: 20 });
 */
export const useActivityLogs = (
  initialFilters: ActivityLogFilters = {},
): UseActivityLogsReturn => {
  const [filters, setFiltersState] = useState<ActivityLogFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<ActivityLogPagination | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent stale closure fetches when filters change rapidly
  const abortRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async (currentFilters: ActivityLogFilters) => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await fetchActivityLogs(currentFilters);

      setLogs(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      // Ignore abort errors (caused by rapid filter changes)
      if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;

      setIsError(true);
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Failed to fetch activity logs.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Re-fetch whenever filters change
  useEffect(() => {
    fetch(filters);
  }, [filters, fetch]);

  /**
   * Merge partial filter updates and reset to page 1 unless page is explicitly set.
   */
  const setFilters = useCallback((partial: Partial<ActivityLogFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...partial,
      // If caller didn't supply a page, reset to 1 on filter change
      page: partial.page ?? 1,
    }));
  }, []);

  /**
   * Reset all filters back to defaults.
   */
  const resetFilters = useCallback(() => {
    setFiltersState({ ...DEFAULT_FILTERS, ...initialFilters });
  }, [initialFilters]);

  /**
   * Navigate to a specific page without touching other filters.
   */
  const goToPage = useCallback((page: number) => {
    setFiltersState((prev) => ({ ...prev, page }));
  }, []);

  /**
   * Manually re-trigger the current fetch.
   */
  const refetch = useCallback(() => {
    fetch(filters);
  }, [fetch, filters]);

  return {
    logs,
    pagination,
    isLoading,
    isError,
    error,
    filters,
    setFilters,
    resetFilters,
    refetch,
    goToPage,
  };
};
