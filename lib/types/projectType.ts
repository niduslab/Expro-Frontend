// lib/types/projectType.ts

export interface Project {
  id: number;
  title: string;
  title_bangla?: string;
  slug: string;
  category?: string;
  short_description?: string;
  description: string;
  featured_image?: string;
  gallery?: string[];
  status?: string;
  start_date?: string;
  end_date?: string;
  budget?: string;
  funds_raised?: string;
  funds_utilized?: string;
  project_lead_id?: number;
  is_featured?: boolean;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Pagination object returned by the API
 */
export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

/**
 * API response when it includes pagination
 */
export interface ApiResponseWithPagination<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: Pagination;
}

/**
 * Generic paginated response for frontend usage
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

/**
 * API response without pagination
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
