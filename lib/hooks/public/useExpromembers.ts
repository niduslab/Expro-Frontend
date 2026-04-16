// lib/hooks/useExproMembers.ts

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { ExproMember, PaginatedResponse } from "@/lib/types/expromemberType";
import {
  fetchExproMemberById,
  fetchExproMembers,
} from "@/lib/api/functions/public/expromembersApi";

/**
 * Get paginated Expro members
 */
export const useExproMembers = (page: number, per_page: number) => {
  const options: UseQueryOptions<
    PaginatedResponse<ExproMember>,
    Error,
    PaginatedResponse<ExproMember>,
    [string, number]
  > = {
    queryKey: ["exproMembers", page],
    queryFn: () => fetchExproMembers(page, per_page),
    placeholderData: (previousData) => previousData,
  };

  // Destructure refetch from useQuery result
  const { data, isLoading, refetch, ...rest } = useQuery(options);

  return {
    data,
    isLoading,
    refetch, // Return refetch so components can manually trigger a fetch
    ...rest,
  };
};

/**
 * Get single Expro member
 */
export const useExproMember = (id: number) =>
  useQuery<ExproMember, Error>({
    queryKey: ["exproMember", id],
    queryFn: () => fetchExproMemberById(id),
    enabled: !!id,
  });
