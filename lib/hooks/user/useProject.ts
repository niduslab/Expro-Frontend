import {
  fetchMyProjects,
  MyProjectsParams,
  MyProjectsResponse,
  ProjectMember,
} from "@/lib/types/projectMemberType";
import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const myProjectsKeys = {
  all: ["myProjects"] as const,
  lists: () => [...myProjectsKeys.all, "list"] as const,
  list: (params?: MyProjectsParams) =>
    [...myProjectsKeys.lists(), params ?? {}] as const,
  infinite: (params?: Omit<MyProjectsParams, "page">) =>
    [...myProjectsKeys.all, "infinite", params ?? {}] as const,
};

// ─── Paginated Hook ───────────────────────────────────────────────────────────

/**
 * useMyProjects
 *
 * Standard paginated hook. Pass filter / pagination params and the data
 * will automatically refetch whenever they change.
 *
 * @example
 * const { data, isLoading, isError } = useMyProjects({ status: "active", page: 1 });
 */
export const useMyProjects = (params?: MyProjectsParams) => {
  return useQuery<MyProjectsResponse, Error>({
    queryKey: myProjectsKeys.list(params),
    queryFn: () => fetchMyProjects(params),
    placeholderData: keepPreviousData, // keeps old data visible while fetching next page
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// ─── Infinite Scroll Hook ─────────────────────────────────────────────────────

/**
 * useMyProjectsInfinite
 *
 * Infinite-scroll / "load more" variant. Automatically appends the next
 * page of results when `fetchNextPage` is called.
 *
 * @example
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
 *   useMyProjectsInfinite({ status: "active" });
 */
export const useMyProjectsInfinite = (
  params?: Omit<MyProjectsParams, "page">,
) => {
  return useInfiniteQuery<MyProjectsResponse, Error>({
    queryKey: myProjectsKeys.infinite(params),
    queryFn: ({ pageParam = 1 }) =>
      fetchMyProjects({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.pagination;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 2,
  });
};

// ─── Selector Helpers (use with useMyProjects) ────────────────────────────────

/**
 * Flatten all project members from an infinite query result.
 */
export const flattenInfiniteMyProjects = (
  data: ReturnType<typeof useMyProjectsInfinite>["data"],
): ProjectMember[] => {
  return data?.pages.flatMap((page) => page.data) ?? [];
};
