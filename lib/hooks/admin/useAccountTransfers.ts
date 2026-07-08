import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest, ApiResponse, PaginatedResponse } from '@/lib/api/axios';
import { AxiosError } from 'axios';

/**
 * Account Transfer Types
 */
export interface AccountTransfer {
  id: number;
  transfer_number: string;
  pension_enrollment_id: number;
  from_user_id: number;
  to_user_id: number | null;
  transfer_reason: 'unable_to_continue' | 'financial_difficulties' | 'relocation' | 'health_issues' | 'other';
  reason_details: string;
  outstanding_balance: number;
  outstanding_cleared: boolean;
  transfer_fee: number;
  status: 'requested' | 'under_review' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  new_member_data: {
    name: string;
    email: string;
    phone: string;
    nid: string;
    date_of_birth: string;
    gender: 'male' | 'female' | 'other';
    address?: string; // Legacy field
    present_address?: string;
    permanent_address?: string;
    father_name?: string;
    mother_name?: string;
    religion?: string;
    photo_path?: string;
    nominees?: Array<{
      name: string;
      relation: string;
      phone: string;
      nid?: string;
      date_of_birth?: string;
      address?: string;
      percentage: number;
      photo?: string;
    }>;
  } | null;
  new_member_registered: boolean;
  documents: Array<{
    filename: string;
    path: string;
    size: number;
    mime_type: string;
    uploaded_at: string;
  }> | null;
  review_notes: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  approved_by: number | null;
  approved_at: string | null;
  rejected_by: number | null;
  rejected_at: string | null;
  completed_by: number | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  
  // Relations
  from_user?: {
    id: number;
    name: string;
    email: string;
    member_id: string;
  } | null;
  to_user?: {
    id: number;
    name: string;
    email: string;
    member_id: string;
  } | null;
  pension_enrollment?: {
    id: number;
    enrollment_number: string;
    package_name: string;
    monthly_amount: number;
    total_installments: number;
    installments_paid: number;
    total_amount_paid: number;
    status: string;
  } | null;
  reviewer?: {
    id: number;
    name: string;
  } | null;
  approver?: {
    id: number;
    name: string;
  } | null;
}

export interface AccountTransferStatistics {
  total_transfers: number;
  requested: number;
  under_review: number;
  approved: number;
  rejected: number;
  completed: number;
  cancelled: number;
  total_transfer_fees: number;
  total_outstanding_balance: number;
  pending_new_member_registrations: number;
  average_processing_time_days: number;
}

export interface AccountTransfersParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
  from_date?: string;
  to_date?: string;
  has_outstanding?: boolean;
  new_member_registered?: boolean;
}

export interface ReviewTransferPayload {
  review_notes?: string;
}

export interface ApproveTransferPayload {
  review_notes?: string;
}

export interface RejectTransferPayload {
  review_notes: string;
}

export interface ClearOutstandingPayload {
  notes?: string;
}

export interface DirectTransferPayload {
  pension_enrollment_id: number;
  to_user_id: number;
  transfer_reason: 'unable_to_continue' | 'financial_hardship' | 'relocation' | 'health_issues' | 'death' | 'other';
  reason_details?: string;
  review_notes?: string;
}

/**
 * Hook: Get All Account Transfers (Admin)
 * Fetches paginated list of all account transfers
 * 
 * @param params - Query parameters for filtering
 * @returns React Query result with paginated account transfers
 * 
 * @example
 * const { data, isLoading } = useAccountTransfers({ page: 1, status: 'requested' });
 */
export const useAccountTransfers = (params?: AccountTransfersParams) => {
  return useQuery({
    queryKey: ['accountTransfers', params],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<AccountTransfer>>(
        '/admin/account-transfers',
        { params }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook: Get Single Account Transfer (Admin)
 * Fetches details of a specific account transfer
 * 
 * @param id - Account Transfer ID
 * @returns React Query result with account transfer details
 * 
 * @example
 * const { data } = useAccountTransfer(1);
 */
export const useAccountTransfer = (id: number | null) => {
  return useQuery({
    queryKey: ['accountTransfer', id],
    queryFn: async () => {
      const response = await apiRequest.get<ApiResponse<AccountTransfer>>(
        `/admin/account-transfers/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook: Get Account Transfer Statistics (Admin)
 * Fetches statistics about account transfers
 * 
 * @returns React Query result with transfer statistics
 * 
 * @example
 * const { data } = useAccountTransferStatistics();
 */
export const useAccountTransferStatistics = () => {
  return useQuery({
    queryKey: ['accountTransferStatistics'],
    queryFn: async () => {
      const response = await apiRequest.get<ApiResponse<AccountTransferStatistics>>(
        '/admin/account-transfers/statistics'
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: Move Transfer to Review (Admin)
 * Moves a transfer request to under_review status
 * 
 * @returns React Query mutation for reviewing transfer
 * 
 * @example
 * const { mutate } = useReviewTransfer();
 * mutate({ id: 1, review_notes: 'Reviewing documents...' });
 */
export const useReviewTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<AccountTransfer>,
    AxiosError,
    { id: number } & ReviewTransferPayload
  >({
    mutationFn: async ({ id, ...payload }) => {
      const response = await apiRequest.put<AccountTransfer>(
        `/admin/account-transfers/${id}/review`,
        payload
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['accountTransfer', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['accountTransfers'] });
      queryClient.invalidateQueries({ queryKey: ['accountTransferStatistics'] });
    },
  });
};

/**
 * Hook: Approve Transfer (Admin)
 * Approves a transfer request
 * 
 * @returns React Query mutation for approving transfer
 * 
 * @example
 * const { mutate } = useApproveTransfer();
 * mutate({ id: 1, review_notes: 'Approved. New member can register.' });
 */
export const useApproveTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<AccountTransfer>,
    AxiosError,
    { id: number } & ApproveTransferPayload
  >({
    mutationFn: async ({ id, ...payload }) => {
      const response = await apiRequest.put<AccountTransfer>(
        `/admin/account-transfers/${id}/approve`,
        payload
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['accountTransfer', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['accountTransfers'] });
      queryClient.invalidateQueries({ queryKey: ['accountTransferStatistics'] });
    },
  });
};

/**
 * Hook: Reject Transfer (Admin)
 * Rejects a transfer request
 * 
 * @returns React Query mutation for rejecting transfer
 * 
 * @example
 * const { mutate } = useRejectTransfer();
 * mutate({ id: 1, review_notes: 'Insufficient documentation.' });
 */
export const useRejectTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<AccountTransfer>,
    AxiosError,
    { id: number } & RejectTransferPayload
  >({
    mutationFn: async ({ id, ...payload }) => {
      const response = await apiRequest.put<AccountTransfer>(
        `/admin/account-transfers/${id}/reject`,
        payload
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['accountTransfer', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['accountTransfers'] });
      queryClient.invalidateQueries({ queryKey: ['accountTransferStatistics'] });
    },
  });
};

/**
 * Hook: Clear Outstanding Balance (Admin)
 * Marks outstanding balance as cleared
 * 
 * @returns React Query mutation for clearing outstanding
 * 
 * @example
 * const { mutate } = useClearOutstanding();
 * mutate({ id: 1, notes: 'Payment received' });
 */
export const useClearOutstanding = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<AccountTransfer>,
    AxiosError,
    { id: number } & ClearOutstandingPayload
  >({
    mutationFn: async ({ id, ...payload }) => {
      const response = await apiRequest.put<AccountTransfer>(
        `/admin/account-transfers/${id}/clear-outstanding`,
        payload
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['accountTransfer', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['accountTransfers'] });
      queryClient.invalidateQueries({ queryKey: ['accountTransferStatistics'] });
    },
  });
};

/**
 * Hook: Admin Direct Transfer (Admin)
 * Transfers enrollment + wallet balance + commissions directly to an existing member.
 * Used for admin-initiated transfers (death, incapacity, etc.).
 */
export const useDirectTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<AccountTransfer>,
    AxiosError,
    DirectTransferPayload
  >({
    mutationFn: async (payload) => {
      const response = await apiRequest.post<AccountTransfer>(
        '/admin/account-transfers/direct',
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountTransfers'] });
      queryClient.invalidateQueries({ queryKey: ['accountTransferStatistics'] });
    },
  });
};

/**
 * Hook: Complete Transfer (Admin)
 * Completes the transfer and updates ownership
 * 
 * @returns React Query mutation for completing transfer
 * 
 * @example
 * const { mutate } = useCompleteTransfer();
 * mutate(1);
 */
export const useCompleteTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<AccountTransfer>,
    AxiosError,
    number
  >({
    mutationFn: async (id) => {
      const response = await apiRequest.put<AccountTransfer>(
        `/admin/account-transfer/${id}/complete`
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['accountTransfer', id] });
      queryClient.invalidateQueries({ queryKey: ['accountTransfers'] });
      queryClient.invalidateQueries({ queryKey: ['accountTransferStatistics'] });
    },
  });
};
