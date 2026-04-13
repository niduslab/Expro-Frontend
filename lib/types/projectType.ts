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
  budget?: number;
  funds_raised?: number;
  funds_utilized?: number;
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
  featured_image?: File;
  gallery?: File[]; // new files to upload
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {
  gallery_keep?: string[]; // existing URLs to retain (edit only)
}

export interface ProjectFormDataInterface {
  title: string;
  category: string;
  status: string;
  shortDescription: string;
  description: string;
  totalBudget: string;
  initialFund: string;
  fundsUtilized: string;
  startDate: string;
  endDate: string;
  projectLeadId: number | null;
  isFeatured: boolean;
  isPublished: boolean;
  featuredImage: File | null;
  featured_image?: string | null; // existing featured image URL (edit mode)
  galleryImages: File[]; // new gallery files to upload
  gallery?: string[]; // existing gallery URLs (edit mode)
}
