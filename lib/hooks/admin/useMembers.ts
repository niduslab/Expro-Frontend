import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, ApiResponse, PaginatedResponse } from "@/lib/api/axios";
import { AxiosError } from "axios";

/**
 * Member Types
 */
export interface MemberProfile {
  id: number;
  user_id: number;
  member_id: string;
  sl_no: number;
  name_bangla: string;
  name_english: string;
  father_husband_name: string;
  mother_name: string;
  user_date_of_birth: string;
  nid_number: string;
  academic_qualification: string;
  permanent_address: string;
  present_address: string;
  religion: string;
  gender: string;
  mobile: string;
  alternate_mobile: string | null;
  photo: string | null;
  nid_front_photo: string | null;
  nid_back_photo: string | null;
  signature: string | null;
  membership_type: "general" | "executive";
  member_fee_paid: string;
  membership_date: string | null;
  membership_expiry_date: string | null;
  suspended_at: string | null;
  suspension_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: number;
  user_id: number;
  balance: string;
  commission_balance: string;
  total_deposited: string;
  total_withdrawn: string;
  total_commission_earned: string;
  total_membership_paid: string;
  total_pension_paid: string;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: number;
  email: string;
  status: "active" | "inactive" | "pending" | "suspended" | "approved";
  last_login_at: string | null;
  roles: string[];
  permissions: string[];
  branch: any | null;
  member: MemberProfile | null;
  nominee: any[];
  wallet: Wallet | null;
  wallet_transactions: any[];
  pension_enrollments: any[];
  pension_installments: any[];
}

export interface MembersParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
  branch_id?: number;
  pension_role?: string;
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
    queryKey: ["members", params],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<Member>>(
        "/admin/members",
        { params },
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
    queryKey: ["member", id],
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
      const response = await apiRequest.put<Member>(`/admin/member/${id}`, {
        status,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["member", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

/**
 * Nominee Types
 */
export interface Nominee {
  id: number;
  user_id: number;
  nominee_name_bangla: string;
  nominee_name_english: string;
  relation: string;
  percentage: number;
  nominee_mobile: string | null;
  nominee_nid_number: string | null;
  nominee_date_of_birth: string | null;
  address: string | null;
  is_active: boolean;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface NomineeFormData {
  nominee_name_bangla: string;
  nominee_name_english: string;
  relation: string;
  percentage: number;
  nominee_mobile?: string;
  nominee_nid_number?: string;
  nominee_date_of_birth?: string;
  address?: string;
  is_active?: boolean;
  is_primary?: boolean;
}

export interface UpdateMemberProfileData {
  name_bangla?: string;
  name_english?: string;
  father_husband_name?: string;
  mother_name?: string;
  user_date_of_birth?: string;
  nid_number?: string;
  academic_qualification?: string;
  permanent_address?: string;
  present_address?: string;
  religion?: string;
  gender?: string;
  mobile?: string;
  alternate_mobile?: string;
  photo?: File | string;
  nid_front_photo?: File | string;
  nid_back_photo?: File | string;
  signature?: File | string;
  membership_type?: "general" | "executive";
}

/**
 * Hook: Update Member Profile (Admin)
 * Admin can update any member's profile information
 *
 * @returns React Query mutation for updating member profile
 *
 * @example
 * const { mutate } = useUpdateMemberProfile();
 *
 * mutate({ userId: 1, data: { name_english: 'John Doe' } });
 */
export const useUpdateMemberProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<MemberProfile>,
    AxiosError,
    { userId: number; data: UpdateMemberProfileData }
  >({
    mutationFn: async ({ userId, data }) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await apiRequest.post<MemberProfile>(
        `/admin/member/${userId}/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: { _method: "PUT" },
        },
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["member", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

/**
 * Hook: Get User's Nominees (Admin)
 * Get all nominees for a specific user
 *
 * @param userId - User ID
 * @returns React Query result with nominees
 *
 * @example
 * const { data } = useNominees(1);
 */
export const useNominees = (userId: number) => {
  return useQuery({
    queryKey: ["nominees", userId],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<Nominee>>(
        `/admin/member/${userId}/nominees`,
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

/**
 * Hook: Create Nominee for User (Admin)
 * Create a new nominee for a specific user
 *
 * @returns React Query mutation for creating nominee
 *
 * @example
 * const { mutate } = useCreateNominee();
 *
 * mutate({
 *   userId: 1,
 *   data: {
 *     nominee_name_english: 'John Doe',
 *     relation: 'Brother',
 *     percentage: 50
 *   }
 * });
 */
export const useCreateNominee = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Nominee>,
    AxiosError,
    { userId: number; data: NomineeFormData }
  >({
    mutationFn: async ({ userId, data }) => {
      const response = await apiRequest.post<Nominee>(
        `/admin/member/${userId}/nominee`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["nominees", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["member", variables.userId] });
    },
  });
};

/**
 * Hook: Update User's Nominee (Admin)
 * Update a specific nominee for a user
 *
 * @returns React Query mutation for updating nominee
 *
 * @example
 * const { mutate } = useUpdateNominee();
 *
 * mutate({
 *   userId: 1,
 *   nomineeId: 5,
 *   data: { percentage: 60 }
 * });
 */
export const useUpdateNominee = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Nominee>,
    AxiosError,
    { userId: number; nomineeId: number; data: Partial<NomineeFormData> }
  >({
    mutationFn: async ({ userId, nomineeId, data }) => {
      const response = await apiRequest.put<Nominee>(
        `/admin/member/${userId}/nominee/${nomineeId}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["nominees", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["member", variables.userId] });
    },
  });
};

/**
 * Hook: Delete User's Nominee (Admin)
 * Delete a specific nominee for a user
 *
 * @returns React Query mutation for deleting nominee
 *
 * @example
 * const { mutate } = useDeleteNominee();
 *
 * mutate({ userId: 1, nomineeId: 5 });
 */
export const useDeleteNominee = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<void>,
    AxiosError,
    { userId: number; nomineeId: number }
  >({
    mutationFn: async ({ userId, nomineeId }) => {
      const response = await apiRequest.delete<void>(
        `/admin/member/${userId}/nominee/${nomineeId}`,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["nominees", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["member", variables.userId] });
    },
  });
};
