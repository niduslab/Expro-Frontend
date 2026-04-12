import {
  useInfiniteQuery,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  getFeaturedYouTubeVideos,
  getYouTubeVideoById,
  getYouTubeVideos,
} from "@/lib/api/functions/public/Ytvideosapi";
import type {
  GetFeaturedVideosParams,
  GetYouTubeVideosParams,
  YouTubeVideo,
  YouTubeVideosResponse,
} from "@/lib/types/admin/Ytvideostype";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const ytVideoKeys = {
  all: ["youtube-videos"] as const,
  lists: () => [...ytVideoKeys.all, "list"] as const,
  list: (params: GetYouTubeVideosParams) =>
    [...ytVideoKeys.lists(), params] as const,
  featured: (params: GetFeaturedVideosParams) =>
    [...ytVideoKeys.all, "featured", params] as const,
  detail: (id: string | number) => [...ytVideoKeys.all, "detail", id] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of YouTube videos.
 *
 * @example
 * const { data, isLoading } = useYouTubeVideos({ per_page: 12, is_featured: true });
 */
export const useYouTubeVideos = (
  params: GetYouTubeVideosParams = {},
  options?: Omit<
    UseQueryOptions<YouTubeVideosResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<YouTubeVideosResponse, Error>({
    queryKey: ytVideoKeys.list(params),
    queryFn: () => getYouTubeVideos(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/**
 * Infinite-scroll hook for YouTube videos.
 * Automatically increments `page` for each next page fetch.
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useInfiniteYouTubeVideos({ per_page: 9 });
 */
export const useInfiniteYouTubeVideos = (
  params: Omit<GetYouTubeVideosParams, "page"> = {},
) => {
  return useInfiniteQuery({
    queryKey: [...ytVideoKeys.lists(), "infinite", params],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getYouTubeVideos({ ...params, page: pageParam }),
    getNextPageParam: (lastPage: YouTubeVideosResponse) => {
      const { current_page, last_page } = lastPage.pagination;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Fetch featured YouTube videos.
 *
 * @example
 * const { data } = useFeaturedYouTubeVideos({ per_page: 6 });
 */
export const useFeaturedYouTubeVideos = (
  params: GetFeaturedVideosParams = {},
  options?: Omit<
    UseQueryOptions<YouTubeVideosResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<YouTubeVideosResponse, Error>({
    queryKey: ytVideoKeys.featured(params),
    queryFn: () => getFeaturedYouTubeVideos(params),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

/**
 * Fetch a single YouTube video by ID or slug.
 * Triggers a view count increment on the backend.
 *
 * @example
 * const { data } = useYouTubeVideo("my-video-slug");
 */
export const useYouTubeVideo = (
  videoId: string | number,
  options?: Omit<
    UseQueryOptions<YouTubeVideo, Error>,
    "queryKey" | "queryFn" | "enabled"
  >,
) => {
  return useQuery<YouTubeVideo, Error>({
    queryKey: ytVideoKeys.detail(videoId),
    queryFn: async () => {
      const res = await getYouTubeVideoById(videoId);
      return res as unknown as YouTubeVideo;
    },
    enabled: !!videoId,
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};
