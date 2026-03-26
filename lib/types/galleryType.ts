// lib/types/galleryTypes.ts

export interface Gallery {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  view_count: number;
  is_featured: boolean;
  status: "draft" | "published" | "archived";
  created_by: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface GalleryImage {
  id: number;
  gallery_id: number;
  image_path: string;
  title: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}
