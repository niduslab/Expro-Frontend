import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest, ApiResponse, PaginatedResponse } from '@/lib/api/axios';
import { AxiosError } from 'axios';

/**
 * Member Types
 */
export interface Member {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  membership_type: 'general' | 'executive';
  branch_id: number;
  created_at: string;
}

export interface MembersParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
  branch_id?: number;
}

/**
 * Hook: Get All Members (Admin)
 * Fetches paginated list of all members
 * 
 * @param params - Query parameters for filtering
 * @returns React Query result with paginated members
 * 
 * @example
 * const { data, isLoading } = useMembers({ page: 1, status: 'active' });
 */
export const useMembers = (params?: MembersParams) => {
  return useQuery({
    queryKey: ['members', params],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<Member>>(
        '/admin/members',
        { params }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * Hook: Get Single Member (Admin)
 * Fetches details of a specific member
 * 
 * @param id - Member ID
 * @returns React Query result with member details
 * 
 * @example
 * const { data } = useMember(1);
 */
export const useMember = (id: number) => {
  return useQuery({
    queryKey: ['member', id],
    queryFn: async () => {
      const response = await apiRequest.get<Member>(`/admin/member/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook: Update Member Status (Admin)
 * Updates a member's status
 * 
 * @returns React Query mutation for updating member
 * 
 * @example
 * const { mutate } = useUpdateMemberStatus();
 * 
 * mutate({ id: 1, status: 'active' });
 */
export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Member>,
    AxiosError,
    { id: number; status: string }
  >({
    mutationFn: async ({ id, status }) => {
      const response = await apiRequest.put<Member>(`/admin/member/${id}`, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};
