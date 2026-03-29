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
export const useExproMembers = (page: number, per_page: number = 6) => {
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

  return useQuery(options);
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
