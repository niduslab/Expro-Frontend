import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

import {
  CreateYouTubeVideoPayload,
  createYouTubeVideo,
  deleteYouTubeVideo,
  getFeaturedYouTubeVideos,
  getYouTubeVideo,
  getYouTubeVideos,
  UpdateYouTubeVideoPayload,
  updateYouTubeVideo,
} from "@/lib/api/functions/admin/youtubevideosApi";
import {
  GetFeaturedVideosParams,
  GetYouTubeVideosParams,
  YouTubeVideo,
  YouTubeVideoResponse,
  YouTubeVideosResponse,
} from "@/lib/types/admin/Ytvideostype";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const youtubeVideoKeys = {
  all: ["youtube-videos"] as const,
  lists: () => [...youtubeVideoKeys.all, "list"] as const,
  list: (params: GetYouTubeVideosParams) =>
    [...youtubeVideoKeys.lists(), params] as const,
  details: () => [...youtubeVideoKeys.all, "detail"] as const,
  detail: (id: number) => [...youtubeVideoKeys.details(), id] as const,
  featured: (params: GetFeaturedVideosParams) =>
    [...youtubeVideoKeys.all, "featured", params] as const,
};

// ─── List Hook ────────────────────────────────────────────────────────────────

/**
 * Fetch paginated YouTube videos with optional filters.
 *
 * @example
 * const { data, isLoading } = useYouTubeVideos({ status: "published", per_page: 10 });
 */
export const useYouTubeVideos = (
  params: GetYouTubeVideosParams = {},
  options?: Omit<
    UseQueryOptions<YouTubeVideosResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<YouTubeVideosResponse>({
    queryKey: youtubeVideoKeys.list(params),
    queryFn: () => getYouTubeVideos(params),
    ...options,
  });
};

// ─── Single Video Hook ────────────────────────────────────────────────────────

/**
 * Fetch a single YouTube video by ID (also increments view count).
 *
 * @example
 * const { data, isLoading } = useYouTubeVideo(3);
 */
export const useYouTubeVideo = (
  id: number,
  options?: Omit<UseQueryOptions<YouTubeVideoResponse>, "queryKey" | "queryFn">,
) => {
  return useQuery<YouTubeVideoResponse>({
    queryKey: youtubeVideoKeys.detail(id),
    queryFn: () => getYouTubeVideo(id),
    enabled: !!id,
    ...options,
  });
};

// ─── Featured Videos Hook ─────────────────────────────────────────────────────

/**
 * Fetch featured published YouTube videos.
 *
 * @example
 * const { data } = useFeaturedYouTubeVideos({ per_page: 6 });
 */
export const useFeaturedYouTubeVideos = (
  params: GetFeaturedVideosParams = {},
  options?: Omit<
    UseQueryOptions<YouTubeVideosResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<YouTubeVideosResponse>({
    queryKey: youtubeVideoKeys.featured(params),
    queryFn: () => getFeaturedYouTubeVideos(params),
    ...options,
  });
};

// ─── Create Mutation ──────────────────────────────────────────────────────────

/**
 * Create a new YouTube video. Invalidates the list cache on success.
 *
 * @example
 * const { mutate, isPending } = useCreateYouTubeVideo();
 * mutate({ title: "...", slug: "...", youtube_url: "...", status: "draft" });
 */
export const useCreateYouTubeVideo = () => {
  const queryClient = useQueryClient();

  return useMutation<YouTubeVideoResponse, Error, CreateYouTubeVideoPayload>({
    mutationFn: createYouTubeVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: youtubeVideoKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: youtubeVideoKeys.all.concat(["featured"] as any),
      });
    },
  });
};

// ─── Update Mutation ──────────────────────────────────────────────────────────

/**
 * Update an existing YouTube video. Invalidates list and detail caches on success.
 *
 * @example
 * const { mutate, isPending } = useUpdateYouTubeVideo();
 * mutate({ id: 3, payload: { title: "New Title", ... } });
 */
export const useUpdateYouTubeVideo = () => {
  const queryClient = useQueryClient();

  return useMutation<
    YouTubeVideoResponse,
    Error,
    { id: number; payload: UpdateYouTubeVideoPayload }
  >({
    mutationFn: ({ id, payload }) => updateYouTubeVideo(id, payload),
    onSuccess: (data) => {
      const video = data.data as YouTubeVideo;

      // Update the cached detail entry immediately (optimistic-style)
      queryClient.setQueryData(youtubeVideoKeys.detail(video.id), data);

      // Invalidate list queries so they re-fetch fresh data
      queryClient.invalidateQueries({ queryKey: youtubeVideoKeys.lists() });
    },
  });
};

// ─── Delete Mutation ──────────────────────────────────────────────────────────

/**
 * Soft-delete a YouTube video. Removes the detail cache and invalidates lists.
 *
 * @example
 * const { mutate, isPending } = useDeleteYouTubeVideo();
 * mutate(3);
 */
export const useDeleteYouTubeVideo = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, number>({
    mutationFn: deleteYouTubeVideo,
    onSuccess: (_, id) => {
      // Remove detail cache for the deleted video
      queryClient.removeQueries({ queryKey: youtubeVideoKeys.detail(id) });

      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: youtubeVideoKeys.lists() });
    },
  });
};
