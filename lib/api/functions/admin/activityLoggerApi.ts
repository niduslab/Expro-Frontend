import type {
  ActivityLog,
  ActivityLogFilters,
  ActivityLogListResponse,
} from "@/lib/types/admin/ActivityLoggerType";
import apiClient from "../../axios";

const BASE_URL = "/activitylog";

/**
 * Build a clean query-string object from filters,
 * stripping undefined / empty-string values.
 */
const buildParams = (
  filters: ActivityLogFilters,
): Record<string, string | number> => {
  const params: Record<string, string | number> = {};

  if (filters.causer_id !== undefined) params.causer_id = filters.causer_id;
  if (filters.log_name) params.log_name = filters.log_name;
  if (filters.created_at) params.created_at = filters.created_at;
  if (filters.search) params.q = filters.search; // ✅ was: params.search = filters.search
  if (filters.page !== undefined) params.page = filters.page;
  if (filters.per_page !== undefined) params.per_page = filters.per_page;

  return params;
};

/**
 * Fetch a paginated list of activity logs.
 *
 * @example
 * const { data } = await fetchActivityLogs({ log_name: "auth", page: 1 });
 */
export const fetchActivityLogs = async (
  filters: ActivityLogFilters = {},
): Promise<ActivityLogListResponse> => {
  const { data } = await apiClient.get<ActivityLogListResponse>(BASE_URL, {
    params: buildParams(filters),
  });
  return data;
};

/**
 * Fetch a single activity log entry by ID.
 *
 * @example
 * const log = await fetchActivityLogById(42);
 */
export const fetchActivityLogById = async (
  id: number,
): Promise<ActivityLog> => {
  const { data } = await apiClient.get<{ success: boolean; data: ActivityLog }>(
    `${BASE_URL}/${id}`,
  );
  return data.data;
};

/**
 * Fetch all logs for a specific causer (user / admin).
 *
 * @example
 * const logs = await fetchLogsByCauser(5, { per_page: 20 });
 */
export const fetchLogsByCauser = async (
  causerId: number,
  extra: Omit<ActivityLogFilters, "causer_id"> = {},
): Promise<ActivityLogListResponse> => {
  return fetchActivityLogs({ ...extra, causer_id: causerId });
};

/**
 * Fetch all logs filtered by log_name (channel).
 *
 * @example
 * const logs = await fetchLogsByName("auth");
 */
export const fetchLogsByName = async (
  logName: string,
  extra: Omit<ActivityLogFilters, "log_name"> = {},
): Promise<ActivityLogListResponse> => {
  return fetchActivityLogs({ ...extra, log_name: logName });
};

/**
 * Fetch logs for a specific date (YYYY-MM-DD).
 *
 * @example
 * const logs = await fetchLogsByDate("2024-07-01");
 */
export const fetchLogsByDate = async (
  date: string,
  extra: Omit<ActivityLogFilters, "created_at"> = {},
): Promise<ActivityLogListResponse> => {
  return fetchActivityLogs({ ...extra, created_at: date });
};
