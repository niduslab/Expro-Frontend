// lib/api/functions/public/exproMembers.ts

import {
  ExproMember,
  PaginatedResponse,
  ApiResponseWithPagination,
} from "@/lib/types/expromemberType";
import { apiClient } from "@/lib/api/axios";

/**
 * Fetch Expro members with pagination
 */
export const fetchExproMembers = async (
  page = 1,
  per_page = 10,
): Promise<PaginatedResponse<ExproMember>> => {
  const res = await apiClient.get<ApiResponseWithPagination<ExproMember>>(
    `/public/exproteammembers?page=${page}&per_page=${per_page}`,
  );

  const { data, pagination } = res.data;

  return { data, pagination };
};

/**
 * Fetch single Expro member by ID
 */
export const fetchExproMemberById = async (
  id: number,
): Promise<ExproMember> => {
  const res = await apiClient.get<{
    success: boolean;
    message: string;
    data: ExproMember;
  }>(`/public/exproteammember/${id}`);

  return res.data.data;
};
