import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest, ApiResponse, PaginatedResponse } from '@/lib/api/axios';
import { AxiosError } from 'axios';

/**
 * Member Account Transfer Types
 */
export interface MemberAccountTransfer {
  id: number;
  transfer_number: string;
  pension_enrollment_id: number;
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
    address: string;
    photo_path?: string;
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
  created_at: string;
  updated_at: string;
  
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
}

export interface PensionEnrollment {
  id: number;
  enrollment_number: string;
  package_name: string;
  monthly_amount: number;
  total_installments: number;
  installments_paid: number;
  total_amount_paid: number;
  status: string;
  can_transfer: boolean;
}

export interface TransferEligibility {
  eligible: boolean;
  reasons?: string[];
  outstanding_balance: number;
  transfer_fee: number;
  total_amount_to_clear: number;
  enrollment?: PensionEnrollment;
}

export interface RequestTransferPayload {
  pension_enrollment_id: number;
  transfer_reason: string;
  reason_details: string;
  new_member_name: string;
  new_member_email: string;
  new_member_phone: string;
  new_member_nid: string;
  new_member_date_of_birth: string;
  new_member_gender: string;
  new_member_address: string;
  new_member_photo?: File;
  documents?: File[];
}

/**
 * Hook: Get My Transfer Requests
 * Fetches all transfer requests made by the current member
 * 
 * @returns React Query result with member's transfer requests
 * 
 * @example
 * const { data, isLoading } = useMyTransferRequests();
 */
export const useMyTransferRequests = () => {
  return useQuery({
    queryKey: ['myTransferRequests'],
    queryFn: async () => {
      const response = await apiRequest.get<any>(
        '/account-transfers/my-requests'
      );
      // API returns paginated data: { success: true, data: { data: [...], current_page, total, etc } }
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook: Get Received Transfers
 * Fetches transfers where current member is the new member
 * 
 * @returns React Query result with received transfers
 * 
 * @example
 * const { data } = useReceivedTransfers();
 */
export const useReceivedTransfers = () => {
  return useQuery({
    queryKey: ['receivedTransfers'],
    queryFn: async () => {
      const response = await apiRequest.get<any>(
        '/account-transfers/my-received'
      );
      // API returns paginated data: { success: true, data: { data: [...], current_page, total, etc } }
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook: Get Single Transfer
 * Fetches details of a specific transfer
 * 
 * @param id - Transfer ID
 * @returns React Query result with transfer details
 * 
 * @example
 * const { data } = useTransfer(1);
 */
export const useTransfer = (id: number | null) => {
  return useQuery({
    queryKey: ['transfer', id],
    queryFn: async () => {
      const response = await apiRequest.get<ApiResponse<MemberAccountTransfer>>(
        `/account-transfer/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook: Check Transfer Eligibility
 * Checks if a pension enrollment is eligible for transfer
 * 
 * @param enrollmentId - Pension Enrollment ID
 * @returns React Query result with eligibility details
 * 
 * @example
 * const { data } = useTransferEligibility(123);
 */
export const useTransferEligibility = (enrollmentId: number | null) => {
  return useQuery({
    queryKey: ['transferEligibility', enrollmentId],
    queryFn: async () => {
      const response = await apiRequest.get<{ eligible: boolean; [key: string]: any }>(
        `/pension-enrollment/${enrollmentId}/transfer-eligibility`
      );
      
      // API returns: { success: true, data: { eligible: true, ...other_fields } }
      // response.data.data contains the actual eligibility data
      return response.data.data;
    },
    enabled: !!enrollmentId,
  });
};

/**
 * Hook: Request Transfer
 * Creates a new transfer request
 * 
 * @returns React Query mutation for requesting transfer
 * 
 * @example
 * const { mutate, isPending } = useRequestTransfer();
 * 
 * const formData = new FormData();
 * formData.append('pension_enrollment_id', '123');
 * formData.append('transfer_reason', 'unable_to_continue');
 * // ... add other fields
 * 
 * mutate(formData);
 */
export const useRequestTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<MemberAccountTransfer>,
    AxiosError,
    FormData
  >({
    mutationFn: async (formData) => {
      const response = await apiRequest.post<MemberAccountTransfer>(
        '/account-transfers/request',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTransferRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myPensionEnrollments'] });
    },
  });
};

/**
 * Hook: Cancel Transfer
 * Cancels a pending transfer request
 * 
 * @returns React Query mutation for cancelling transfer
 * 
 * @example
 * const { mutate } = useCancelTransfer();
 * mutate(1);
 */
export const useCancelTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<MemberAccountTransfer>,
    AxiosError,
    number
  >({
    mutationFn: async (id) => {
      const response = await apiRequest.put<MemberAccountTransfer>(
        `/account-transfer/${id}/cancel`
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['transfer', id] });
      queryClient.invalidateQueries({ queryKey: ['myTransferRequests'] });
    },
  });
};

/**
 * Hook: Upload Additional Document
 * Uploads additional supporting document to a transfer
 * 
 * @returns React Query mutation for uploading document
 * 
 * @example
 * const { mutate } = useUploadDocument();
 * 
 * const formData = new FormData();
 * formData.append('document', file);
 * 
 * mutate({ id: 1, formData });
 */
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<MemberAccountTransfer>,
    AxiosError,
    { id: number; formData: FormData }
  >({
    mutationFn: async ({ id, formData }) => {
      const response = await apiRequest.post<MemberAccountTransfer>(
        `/account-transfer/${id}/upload-document`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['transfer', id] });
      queryClient.invalidateQueries({ queryKey: ['myTransferRequests'] });
    },
  });
};
