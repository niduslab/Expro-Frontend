import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest, ApiResponse, PaginatedResponse } from '@/lib/api/axios';
import { AxiosError } from 'axios';

/**
 * Membership Application Types
 */
export interface MembershipApplication {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  branch_id: number;
  membership_type: 'general' | 'executive';
  nid_number: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface MembershipApplicationInput {
  full_name: string;
  email: string;
  phone: string;
  branch_id: number;
  membership_type: 'general' | 'executive';
  nid_number: string;
  address?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface MembershipApplicationsParams {
  page?: number;
  per_page?: number;
  status?: 'pending' | 'approved' | 'rejected';
  search?: string;
}

/**
 * Hook: Get Membership Applications (Paginated)
 * Fetches list of membership applications with pagination
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns React Query result with paginated applications
 * 
 * @example
 * const { data, isLoading, error } = useMembershipApplications({ page: 1, per_page: 15 });
 */
export const useMembershipApplications = (params?: MembershipApplicationsParams) => {
  return useQuery({
    queryKey: ['membership-applications', params],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<MembershipApplication>>(
        '/public/membership-applications',
        { params }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: Get Single Membership Application
 * Fetches details of a specific membership application
 * 
 * @param id - Application ID
 * @returns React Query result with application details
 * 
 * @example
 * const { data, isLoading } = useMembershipApplication(1);
 */
export const useMembershipApplication = (id: number) => {
  return useQuery({
    queryKey: ['membership-application', id],
    queryFn: async () => {
      const response = await apiRequest.get<MembershipApplication>(
        `/public/membership-applications/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook: Submit Membership Application
 * Creates a new membership application
 * 
 * @returns React Query mutation for submitting application
 * 
 * @example
 * const { mutate, isLoading, error } = useSubmitMembershipApplication();
 * 
 * mutate({
 *   full_name: 'John Doe',
 *   email: 'john@example.com',
 *   phone: '8801712345678',
 *   branch_id: 1,
 *   membership_type: 'general',
 *   nid_number: '1234567890'
 * }, {
 *   onSuccess: (data) => {
 *     console.log('Application submitted:', data);
 *   },
 *   onError: (error) => {
 *     console.error('Submission failed:', error);
 *   }
 * });
 */
export const useSubmitMembershipApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<MembershipApplication>,
    AxiosError,
    MembershipApplicationInput
  >({
    mutationFn: async (data: MembershipApplicationInput) => {
      const response = await apiRequest.post<MembershipApplication>(
        '/public/membership-application',
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch membership applications list
      queryClient.invalidateQueries({ queryKey: ['membership-applications'] });
    },
  });
};

/**
 * Hook: Update Membership Application (Admin)
 * Updates an existing membership application (requires authentication)
 * 
 * @returns React Query mutation for updating application
 * 
 * @example
 * const { mutate } = useUpdateMembershipApplication();
 * 
 * mutate({
 *   id: 1,
 *   status: 'approved',
 *   remarks: 'Application approved'
 * });
 */
export const useUpdateMembershipApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<MembershipApplication>,
    AxiosError,
    { id: number; status: string; remarks?: string }
  >({
    mutationFn: async ({ id, ...data }) => {
      const response = await apiRequest.put<MembershipApplication>(
        `/membership-application/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific application and list
      queryClient.invalidateQueries({ queryKey: ['membership-application', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['membership-applications'] });
    },
  });
};

/**
 * Hook: Delete Membership Application (Admin)
 * Deletes a membership application (requires authentication)
 * 
 * @returns React Query mutation for deleting application
 * 
 * @example
 * const { mutate } = useDeleteMembershipApplication();
 * 
 * mutate(1, {
 *   onSuccess: () => {
 *     console.log('Application deleted');
 *   }
 * });
 */
export const useDeleteMembershipApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, AxiosError, number>({
    mutationFn: async (id: number) => {
      const response = await apiRequest.delete(`/membership-application/${id}`);
      return response.data;
    },
    onSuccess: (_, id) => {
      // Invalidate specific application and list
      queryClient.invalidateQueries({ queryKey: ['membership-application', id] });
      queryClient.invalidateQueries({ queryKey: ['membership-applications'] });
    },
  });
};

/**
 * Hook: Register User Account
 * Creates a new user account with branch and sponsor
 * 
 * @returns React Query mutation for user registration
 * 
 * @example
 * const { mutate, isLoading } = useRegisterUser();
 * 
 * mutate({
 *   email: 'user@example.com',
 *   password: 'SecurePass123!',
 *   password_confirmation: 'SecurePass123!',
 *   branch_id: 1,
 *   sponsor_id: 5
 * });
 */
export interface RegisterUserInput {
  email: string;
  password: string;
  password_confirmation: string;
  branch_id: number;
  sponsor_id?: number;
}

export interface RegisterUserResponse {
  user: {
    id: number;
    email: string;
    branch_id: number;
    sponsor_id?: number;
    status: string;
  };
  token: string;
}

export const useRegisterUser = () => {
  return useMutation<ApiResponse<RegisterUserResponse>, AxiosError, RegisterUserInput>({
    mutationFn: async (data: RegisterUserInput) => {
      const response = await apiRequest.post<RegisterUserResponse>(
        '/public/register',
        data
      );
      return response.data;
    },
  });
};
