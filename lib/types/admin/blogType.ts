// ─── Blog Category ──────────────────────────────────────────────

export interface BlogCategory {
  id: number;
  name: string;
  name_bangla?: string | null;
  slug: string;
  description?: string | null;
  parent_id?: number | null;
  parent?: BlogCategory | null;
  children?: BlogCategory[];
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BlogCategoryListResponse {
  success: boolean;
  message: string;
  data: BlogCategory[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface SingleBlogCategoryResponse {
  success: boolean;
  message: string;
  data: BlogCategory;
}

export interface BlogCategoryPayload {
  name: string;
  name_bangla?: string | null;
  slug: string;
  description?: string | null;
  parent_id?: number | null;
  order?: number;
  is_active?: boolean;
}

export interface DeleteBlogCategoryResponse {
  success: boolean;
  message: string;
}

// ─── Blog Post ───────────────────────────────────────────────────

export type BlogPostStatus = "draft" | "published" | "archived";

export interface BlogPostAuthor {
  id: number;
  name: string;
  email: string;
  member?: BlogPostAuthorMember | null;
}
export interface BlogPostAuthorMember {
  id: number;
  name_english: string;
  name_bangla?: string | null;
  photo?: string | null;
  mobile?: string | null;
  // add other fields as needed
}

export interface BlogPost {
  id: number;
  title: string;
  title_bangla?: string | null;
  slug: string;
  excerpt?: string | null;
  content: string;

  featured_image?: File | null;
  featured_image_url?: string | null;

  author_id: number;
  author?: BlogPostAuthor | null;
  category_id?: number | null;
  category?: BlogCategory | null;
  status: BlogPostStatus;
  published_at?: string | null;
  view_count: number;
  is_featured: boolean;
  tags?: string[] | string | null;
  meta?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export type BlogPostListResponse = {
  success: boolean;
  message: string;
  data: BlogPost[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};

export interface SingleBlogPostResponse {
  success: boolean;
  message: string;
  data: BlogPost;
}

export interface BlogPostPayload {
  id: number | null;
  title: string;
  title_bangla?: string | null;
  slug: string;
  excerpt?: string | null;
  content: string;
  featured_image?: File | null;
  author_id: number | null;
  category_id?: number | null;
  status?: BlogPostStatus;
  published_at?: string | null;
  is_featured?: boolean;
  tags?: string[] | null;
  meta?: Record<string, unknown> | null;
}

export interface DeleteBlogPostResponse {
  success: boolean;
  message: string;
}
