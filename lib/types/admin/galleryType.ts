/**
 * Gallery Types
 * Based on GalleryResource, GalleryImageResource, and migration schemas
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type GalleryStatus = "draft" | "published" | "archived";

// ─── User Reference ───────────────────────────────────────────────────────────

export interface GalleryUserRef {
  id: number;
  name: string;
  email: string;
}

// ─── Gallery Image ────────────────────────────────────────────────────────────

export interface GalleryImage {
  id: number;
  gallery_id: number;
  image_path: string | null;
  image_url: string | null; // full URL resolved by GalleryImageResource
  title: string | null;
  description: string | null;
  display_order: number;
  created_at: string | null;
  updated_at: string | null;
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export interface Gallery {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  cover_image_url: string | null; // full URL resolved by GalleryResource
  view_count: number;
  is_featured: boolean;
  status: GalleryStatus;
  status_label: string;
  images_count: number;
  images?: GalleryImage[];
  created_by: GalleryUserRef | null;
  updated_by: GalleryUserRef | null;
  created_at: string;
  updated_at: string;
}

// ─── Request Payloads ─────────────────────────────────────────────────────────

export interface CreateGalleryPayload {
  title: string;
  slug: string;
  description?: string | null;
  cover_image?: File | null;
  is_featured?: boolean;
  status: GalleryStatus;
}

export interface UpdateGalleryPayload extends Partial<CreateGalleryPayload> {}

export interface CreateGalleryImagePayload {
  image: File;
  title?: string | null;
  description?: string | null;
  display_order?: number;
}

export interface UpdateGalleryImagePayload {
  image?: File | null;
  title?: string | null;
  description?: string | null;
  display_order?: number;
}

export interface ReorderGalleryImagesPayload {
  images: Array<{
    id: number;
    display_order: number;
  }>;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface GalleryListParams {
  page?: number;
  per_page?: number;
  status?: GalleryStatus;
  is_featured?: boolean;
  search?: string;
}

export interface GalleryImageListParams {
  page?: number;
  per_page?: number;
  /**
   * "recent"  → ORDER BY created_at DESC
   * anything else (or omitted) → ORDER BY display_order ASC
   * Matches the backend controller logic exactly.
   */
  sort_by?: "recent" | "display_order";
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface GalleryListResponse {
  success: boolean;
  data: Gallery[];
  pagination: PaginationMeta;
}

export interface GalleryDetailResponse {
  success: boolean;
  data: Gallery;
}

export interface GalleryImageListResponse {
  success: boolean;
  data: GalleryImage[];
  pagination: PaginationMeta;
}

export interface GalleryImageDetailResponse {
  success: boolean;
  data: GalleryImage;
}
