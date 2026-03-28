// lib/api/functions/public/pensionPackages.ts

import {
  PensionPackage,
  PaginatedResponse,
  ApiResponseWithPagination,
} from "@/lib/types/pensionPackageType";
import { apiClient } from "@/lib/api/axios";

/**
 * Fetch pension packages
 */
export const fetchPensionPackages = async (
  page = 1,
  per_page = 10,
): Promise<PaginatedResponse<PensionPackage>> => {
  const res = await apiClient.get<ApiResponseWithPagination<PensionPackage>>(
    `/public/pensionpackages?page=${page}&per_page=${per_page}`,
  );

  const { data, pagination } = res.data;

  return { data, pagination };
};

/**
 * Fetch single pension package
 */
export const fetchPensionPackageById = async (
  id: number,
): Promise<PensionPackage> => {
  const res = await apiClient.get<{
    success: boolean;
    message: string;
    data: PensionPackage;
  }>(`/public/pensionpackage/${id}`);

  return res.data.data;
};
