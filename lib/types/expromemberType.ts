// lib/types/expromemberType.ts

/**
 * Single Expro Team Member
 */
export interface ExproMember {
  id: number;
  name: string;
  designation: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  role?: string;
}

/**
 * Pagination object returned by API
 */
export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

/**
 * API response when pagination exists (raw backend response)
 */
export interface ApiResponseWithPagination<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: Pagination;
}

/**
 * Simplified paginated response for frontend usage
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

/**
 * API response without pagination (single item)
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
