import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest, ApiResponse, PaginatedResponse } from '@/lib/api/axios';
import { AxiosError } from 'axios';

/**
 * Membership Request Types
 */
export interface MembershipRequest {
  id: number;
  application_number: string;
  name_bangla: string;
  name_english: string;
  father_husband_name: string;
  mother_name: string;
  date_of_birth: string;
  nid_number: string;
  academic_qualification: string;
  permanent_address: string;
  present_address: string;
  religion: string;
  gender: string;
  mobile: string;
  email: string;
  photo: string;
  membership_type: 'general' | 'executive';
  sponsor_id: number;
  branch_id: number | null;
  pension_package_id: number | null;
  nominees: Array<{
    dob: string;
    name: string;
    relation: string;
  }>;
  status: 'pending' | 'approved' | 'rejected' | 'payment_pending';
  created_at: string;
  updated_at: string;
}

export interface MembershipRequestsParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}

/**
 * Hook: Get All Membership Requests (Admin)
 * Fetches paginated list of all membership applications
 * 
 * @param params - Query parameters for filtering
 * @returns React Query result with paginated membership requests
 * 
 * @example
 * const { data, isLoading } = useMembershipRequests({ page: 1, status: 'pending' });
 */
export const useMembershipRequests = (params?: MembershipRequestsParams) => {
  return useQuery({
    queryKey: ['membership-requests', params],
    queryFn: async () => {
      const response = await apiRequest.get<any>(
        '/public/membership-applications',
        { params }
      );
      // The API returns the paginated response directly in response.data
      return response.data as PaginatedResponse<MembershipRequest>;
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * Hook: Get Single Membership Request (Admin)
 * Fetches details of a specific membership application
 * 
 * @param id - Membership request ID
 * @returns React Query result with membership request details
 * 
 * @example
 * const { data } = useMembershipRequest(1);
 */
export const useMembershipRequest = (id: number) => {
  return useQuery({
    queryKey: ['membership-request', id],
    queryFn: async () => {
      const response = await apiRequest.get<MembershipRequest>(
        `/public/membership-applications/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook: Update Membership Request (Admin)
 * Updates a membership application status
 * 
 * @returns React Query mutation for updating membership request
 * 
 * @example
 * const { mutate } = useUpdateMembershipRequest();
 * 
 * mutate({ id: 1, status: 'approved', remarks: 'Application approved' });
 */
export const useUpdateMembershipRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<MembershipRequest>,
    AxiosError,
    { id: number; status: string; remarks?: string }
  >({
    mutationFn: async ({ id, status, remarks }) => {
      const response = await apiRequest.put<MembershipRequest>(
        `/membership-application/${id}`,
        { status, remarks }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['membership-request', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['membership-requests'] });
    },
  });
};

/**
 * Hook: Approve Membership Request (Admin)
 * Approves a membership application
 * 
 * @returns React Query mutation for approving membership request
 * 
 * @example
 * const { mutate } = useApproveMembershipRequest();
 * 
 * mutate(1);
 */
export const useApproveMembershipRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<MembershipRequest>, AxiosError, number>({
    mutationFn: async (id) => {
      const response = await apiRequest.post<MembershipRequest>(
        `/membership-application/${id}/approve`
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['membership-request', id] });
      queryClient.invalidateQueries({ queryKey: ['membership-requests'] });
    },
  });
};

/**
 * Hook: Reject Membership Request (Admin)
 * Rejects a membership application with a reason
 * 
 * @returns React Query mutation for rejecting membership request
 * 
 * @example
 * const { mutate } = useRejectMembershipRequest();
 * 
 * mutate({ id: 1, reason: 'Incomplete documents' });
 */
export const useRejectMembershipRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<MembershipRequest>,
    AxiosError,
    { id: number; reason: string }
  >({
    mutationFn: async ({ id, reason }) => {
      const response = await apiRequest.post<MembershipRequest>(
        `/membership-application/${id}/reject`,
        { reason }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['membership-request', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['membership-requests'] });
    },
  });
};

/**
 * Hook: Delete Membership Request (Admin)
 * Deletes a membership application
 * 
 * @returns React Query mutation for deleting membership request
 * 
 * @example
 * const { mutate } = useDeleteMembershipRequest();
 * 
 * mutate(1);
 */
export const useDeleteMembershipRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, AxiosError, number>({
    mutationFn: async (id) => {
      const response = await apiRequest.delete(`/membership-application/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-requests'] });
    },
  });
};
