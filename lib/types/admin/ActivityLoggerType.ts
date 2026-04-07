/**
 * Activity Log Types
 */

export interface ActivityLogSubject {
  id: number;
  type: string;
  [key: string]: any;
}

export interface ActivityLogCauser {
  id: number;
  name?: string;
  email?: string;
  photo?: string | null;
  type: string;
  [key: string]: any;
}

export interface ActivityLog {
  id: number;
  log_name: string;
  description: string;
  subject_type: string | null;
  subject_id: number | null;
  causer_type: string | null;
  causer_id: number | null;
  properties: Record<string, any>;
  event: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
  subject?: ActivityLogSubject | null;
  causer?: ActivityLogCauser | null;
}

/**
 * Query / Filter Parameters
 */
export interface ActivityLogFilters {
  causer_id?: number;
  log_name?: string;
  created_at?: string; // ISO date string e.g. "2024-01-15"
  search?: string; // searches description & log_name
  page?: number;
  per_page?: number;
}

/**
 * API Response Shapes
 */
export interface ActivityLogPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface ActivityLogListResponse {
  success: boolean;
  message: string;
  data: ActivityLog[];
  pagination: ActivityLogPagination;
}

/**
 * Hook Return Shape
 */
export interface UseActivityLogsReturn {
  logs: ActivityLog[];
  pagination: ActivityLogPagination | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  filters: ActivityLogFilters;
  setFilters: (filters: Partial<ActivityLogFilters>) => void;
  resetFilters: () => void;
  refetch: () => void;
  goToPage: (page: number) => void;
}
