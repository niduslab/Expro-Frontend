// lib/types/pensionPackageType.ts

export interface PensionPackage {
  id: number;
  name: string;
  name_bangla: string | null;
  slug: string;
  monthly_amount: string;
  total_installments: number;
  maturity_amount: string;
  joining_commission: string;
  installment_commission: string;
  status: "running" | "closed" | string;
  is_active: boolean;
  accepts_new_enrollment: boolean;
  description: string | null;
  terms_conditions: string | null;
  created_at: string;
  updated_at: string;
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
