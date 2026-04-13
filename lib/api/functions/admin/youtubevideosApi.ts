import {
  GetFeaturedVideosParams,
  GetYouTubeVideosParams,
  YouTubeVideoResponse,
  YouTubeVideosResponse,
} from "@/lib/types/admin/Ytvideostype";
import { apiRequest } from "../../axios";

export interface CreateYouTubeVideoPayload {
  title: string;
  slug: string;
  description?: string | null;
  youtube_url: string;
  is_featured?: boolean;
  status: "draft" | "published" | "archived";
}

export interface UpdateYouTubeVideoPayload extends CreateYouTubeVideoPayload {}

const BASE = "/youtube-videos";

export const getYouTubeVideos = async (
  params: GetYouTubeVideosParams = {},
): Promise<YouTubeVideosResponse> => {
  const response = await apiRequest.get<YouTubeVideosResponse>(BASE, {
    params,
  });
  return response.data as unknown as YouTubeVideosResponse;
};

export const getYouTubeVideo = async (
  id: number,
): Promise<YouTubeVideoResponse> => {
  const response = await apiRequest.get<YouTubeVideoResponse>(`${BASE}/${id}`);
  return response.data as unknown as YouTubeVideoResponse;
};

export const createYouTubeVideo = async (
  payload: CreateYouTubeVideoPayload,
): Promise<YouTubeVideoResponse> => {
  const response = await apiRequest.post<YouTubeVideoResponse>(BASE, payload);
  return response.data as unknown as YouTubeVideoResponse;
};

export const updateYouTubeVideo = async (
  id: number,
  payload: UpdateYouTubeVideoPayload,
): Promise<YouTubeVideoResponse> => {
  const response = await apiRequest.put<YouTubeVideoResponse>(
    `${BASE}/${id}`,
    payload,
  );
  return response.data as unknown as YouTubeVideoResponse;
};

export const deleteYouTubeVideo = async (
  id: number,
): Promise<{ success: boolean; message: string }> => {
  const response = await apiRequest.delete(`${BASE}/${id}`);
  return response.data as unknown as { success: boolean; message: string };
};

export const getFeaturedYouTubeVideos = async (
  params: GetFeaturedVideosParams = {},
): Promise<YouTubeVideosResponse> => {
  const response = await apiRequest.get<YouTubeVideosResponse>(BASE, {
    params: { ...params, is_featured: true, status: "published" },
  });
  return response.data as unknown as YouTubeVideosResponse;
};
