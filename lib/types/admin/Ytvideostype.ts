/**
 * YouTube Videos Types
 * Based on YouTubeVideoResource and API response structure
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type VideoStatus = "published" | "draft" | "archived";

// ─── Base Entities ────────────────────────────────────────────────────────────

export interface VideoUser {
  id: number;
  name: string;
  email: string;
}

export interface YouTubeVideo {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  youtube_url: string;
  youtube_video_id: string;
  thumbnail_url: string | null;
  view_count: number;
  is_featured: boolean;
  status: VideoStatus;
  status_label: string;
  created_by: VideoUser | null;
  updated_by: VideoUser | null;
  created_at: string;
  updated_at: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface YouTubeVideosResponse {
  success: boolean;
  message?: string;
  data: YouTubeVideo[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface YouTubeVideoResponse {
  success: boolean;
  message?: string;
  data: YouTubeVideo;
}

// ─── Query / Filter Params ────────────────────────────────────────────────────

export interface GetYouTubeVideosParams {
  page?: number;
  per_page?: number;
  status?: VideoStatus;
  is_featured?: boolean;
  search?: string;
}

export interface GetFeaturedVideosParams {
  per_page?: number;
}
