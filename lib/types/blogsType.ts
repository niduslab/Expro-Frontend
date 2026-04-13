// lib/types/blogType.ts

import { MemberProfile } from "../hooks";

export interface Author {
  id: number;
  email: string;
  status: string;
  member: MemberProfile;
  last_login_at: string | null;
  roles: any[];
  permissions: any[];
}

export interface BlogPost {
  id: number;
  title: string;
  title_bangla: string | null;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image?: string | null;
  author: Author;
  category: any | null;
  status: "draft" | "published" | string;
  published_at: string;
  view_count: number;
  is_featured: boolean;
  tags: any | null;
  meta: any | null;
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
