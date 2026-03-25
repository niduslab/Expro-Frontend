import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest, ApiResponse } from '@/lib/api/axios';
import { AxiosError } from 'axios';

/**
 * User Profile Types
 */
export interface UserProfile {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  nid_number?: string;
  profile_photo?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileInput {
  full_name: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  nid_number?: string;
  profile_photo?: string;
}

export interface UpdateProfileInput extends Partial<CreateProfileInput> {
  id: number;
}

/**
 * Hook: Get My Profile
 * Fetches the authenticated user's profile
 * 
 * @returns React Query result with user profile
 * 
 * @example
 * const { data, isLoading, error } = useMyProfile();
 */
export const useMyProfile = () => {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const response = await apiRequest.get<UserProfile>('/myprofile');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: Create Member Profile
 * Creates a new member profile for the authenticated user
 * 
 * @returns React Query mutation for creating profile
 * 
 * @example
 * const { mutate, isLoading } = useCreateProfile();
 * 
 * mutate({
 *   full_name: 'John Doe',
 *   phone: '8801712345678',
 *   date_of_birth: '1990-01-15',
 *   gender: 'male',
 *   address: 'Dhaka, Bangladesh'
 * });
 */
export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<UserProfile>, AxiosError, CreateProfileInput>({
    mutationFn: async (data: CreateProfileInput) => {
      const response = await apiRequest.post<UserProfile>('/memberprofile', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
  });
};

/**
 * Hook: Update Member Profile
 * Updates an existing member profile
 * 
 * @returns React Query mutation for updating profile
 * 
 * @example
 * const { mutate } = useUpdateProfile();
 * 
 * mutate({
 *   id: 1,
 *   full_name: 'John Doe Updated',
 *   phone: '8801712345679'
 * });
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<UserProfile>, AxiosError, UpdateProfileInput>({
    mutationFn: async ({ id, ...data }) => {
      const response = await apiRequest.put<UserProfile>(`/memberprofile/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
  });
};

/**
 * Hook: Delete Member Profile
 * Deletes a member profile
 * 
 * @returns React Query mutation for deleting profile
 * 
 * @example
 * const { mutate } = useDeleteProfile();
 * 
 * mutate(1);
 */
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, AxiosError, number>({
    mutationFn: async (id: number) => {
      const response = await apiRequest.delete(`/memberprofile/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
  });
};
