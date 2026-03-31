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
  budget?: number; // was string — backend stores numeric
  funds_raised?: number; // was string
  funds_utilized?: number; // was string
  project_lead_id?: number;
  is_featured?: boolean;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface ApiResponseWithPagination<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: Pagination;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ── Mutation payloads ──────────────────────────────────────────────
export interface CreateProjectPayload {
  title: string;
  title_bangla?: string;
  slug?: string;
  category: string;
  short_description?: string;
  description?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  funds_raised?: number;
  funds_utilized?: number;
  project_lead_id?: number;
  is_featured?: boolean;
  is_published?: boolean;
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>;
