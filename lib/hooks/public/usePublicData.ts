import { useQuery } from '@tanstack/react-query';
import { apiRequest, PaginatedResponse } from '@/lib/api/axios';

/**
 * Branch Types
 */
export interface Branch {
  id: number;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
}

/**
 * Hook: Get All Branches
 * Fetches list of all branches (public access)
 * 
 * @returns React Query result with branches list
 * 
 * @example
 * const { data, isLoading } = useBranches();
 */
export const useBranches = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<Branch>>('/branches');
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook: Get Single Branch
 * Fetches details of a specific branch
 * 
 * @param id - Branch ID
 * @returns React Query result with branch details
 * 
 * @example
 * const { data } = useBranch(1);
 */
export const useBranch = (id: number) => {
  return useQuery({
    queryKey: ['branch', id],
    queryFn: async () => {
      const response = await apiRequest.get<Branch>(`/branch/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
