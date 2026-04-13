// lib/types/galleryType.ts

export interface GalleryImage {
  id: number;
  gallery_id: number;
  image_path: string;
  title: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryCreator {
  id: number;
  name: string | null;
  email: string;
}

export interface Gallery {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  view_count: number;
  is_featured: boolean;
  status: string;
  status_label: string;
  images_count: number; // ← was missing
  images: GalleryImage[]; // ← was missing
  created_by: GalleryCreator;
  updated_by?: GalleryCreator;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}
