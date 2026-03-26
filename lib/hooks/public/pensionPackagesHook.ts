// lib/hooks/public/pensionPackageHooks.ts

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import {
  PensionPackage,
  PaginatedResponse,
} from "@/lib/types/pensionPackageType";
import {
  fetchPensionPackages,
  fetchPensionPackageById,
} from "@/lib/api/functions/public/pensionPackagesApi";

/**
 * Get paginated pension packages
 */
export const usePensionPackages = (page: number, per_page: number = 10) => {
  const options: UseQueryOptions<
    PaginatedResponse<PensionPackage>,
    Error,
    PaginatedResponse<PensionPackage>,
    [string, number, number]
  > = {
    queryKey: ["pensionPackages", page, per_page],
    queryFn: () => fetchPensionPackages(page, per_page),
    placeholderData: (prev) => prev,
  };

  return useQuery(options);
};

/**
 * Get single pension package
 */
export const usePensionPackage = (id: number) =>
  useQuery<PensionPackage, Error>({
    queryKey: ["pensionPackage", id],
    queryFn: () => fetchPensionPackageById(id),
    enabled: !!id,
  });
