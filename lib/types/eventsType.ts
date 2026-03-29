// lib/types/eventType.ts

export interface EventType {
  id: number;
  project_id: number | null;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  status: "draft" | "published" | string;
  max_attendees: number | null;
  registration_fee: string;
  image: string;
  metadata: any | null;
  created_by: number | null;
}

/**
 * Pagination meta
 */
export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

/**
 * Frontend formatted response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

/**
 * Raw API response
 */
export interface ApiResponseWithPagination<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: Pagination;
}
