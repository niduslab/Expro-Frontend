import {
  GetFeaturedVideosParams,
  GetYouTubeVideosParams,
  YouTubeVideo,
  YouTubeVideosResponse,
} from "@/lib/types/admin/Ytvideostype";
import { publicApiRequest } from "../../axios";

const BASE = "/public/youtube-videos";

/**
 * Fetch paginated list of published YouTube videos.
 *
 * The axios instance returns AxiosResponse<ApiResponse<T>>, so:
 *   axiosResponse.data         → ApiResponse  { success, data, pagination }
 *   axiosResponse.data.data    → would be T (wrong nesting for paginated)
 *
 * For paginated endpoints the backend returns the full shape at the top level
 * of the JSON body, so we just return axiosResponse.data directly.
 */
export const getYouTubeVideos = async (
  params: GetYouTubeVideosParams = {},
): Promise<YouTubeVideosResponse> => {
  const response = await publicApiRequest.get<YouTubeVideosResponse>(BASE, {
    params,
  });
  // response.data is the raw JSON body: { success, data: [...], pagination: {...} }
  return response.data as unknown as YouTubeVideosResponse;
};

/**
 * Fetch paginated list of featured + published YouTube videos.
 */
export const getFeaturedYouTubeVideos = async (
  params: GetFeaturedVideosParams = {},
): Promise<YouTubeVideosResponse> => {
  const response = await publicApiRequest.get<YouTubeVideosResponse>(
    `${BASE}/featured`,
    { params },
  );
  return response.data as unknown as YouTubeVideosResponse;
};

/**
 * Fetch a single YouTube video by its ID or slug.
 * Also increments the video's view count on the backend.
 */
export const getYouTubeVideoById = async (
  videoId: string | number,
): Promise<YouTubeVideo> => {
  const response = await publicApiRequest.get(`${BASE}/${videoId}`);
  // Single resource: { success, data: { ...video } }
  return (response.data as any).data as YouTubeVideo;
};
