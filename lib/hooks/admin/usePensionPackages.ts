import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest, ApiResponse, PaginatedResponse } from '@/lib/api/axios';
import { AxiosError } from 'axios';

/**
 * Pension Package Types
 */
export interface PensionPackage {
  id: number;
  name: string;
  name_bangla?: string;
  slug: string;
  monthly_amount: number;
  total_installments: number;
  maturity_amount: number;
  joining_commission: number;
  installment_commission: number;
  max_advance_installments: number;
  allow_full_prepayment: boolean;
  prepayment_discount_percentage: number;
  maturity_on_schedule: boolean;
  status: 'active' | 'inactive' | 'upcoming' | 'running';
  is_active: boolean;
  accepts_new_enrollment: boolean;
  description?: string;
  terms_conditions?: string;
  enrolled_members_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PensionPackageDetails {
  package_details: PensionPackage;
  statistics: {
    enrollments: {
      total: number;
      active: number;
      completed: number;
      suspended: number;
    };
    financial: {
      total_collected: number;
      total_maturity_amount: number;
      total_installments_paid: number;
      total_installments_remaining: number;
      average_amount_per_enrollment: number;
      total_payment_transactions: number;
      total_payment_amount: number;
    };
    commissions: {
      total_joining_commissions: number;
      total_installment_commissions: number;
      total_commissions_paid: number;
    };
    applications: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
      approval_rate: number;
    };
    team_collections: {
      total_pension_collection: number;
      team_count: number;
    };
    roles: Record<string, number>;
  };
  recent_enrollments: Array<{
    id: number;
    enrollment_number: string;
    user_name: string | null;
    member_id: string;
    status: string;
    installments_paid: number;
    total_amount_paid: number;
    current_role: string;
    enrolled_at: string;
  }>;
  recent_applications: Array<{
    id: number;
    application_number: string;
    user_name: string | null;
    member_id: string;
    status: string;
    applied_at: string;
  }>;
  recent_installments: Array<{
    id: number;
    enrollment_number: string;
    user_name: string | null;
    installment_number: number;
    amount: number;
    amount_paid: number;
    due_date: string;
    paid_date: string | null;
    status: string;
    payment_method: string | null;
  }>;
  overdue_installments: Array<{
    id: number;
    enrollment_number: string;
    user_name: string | null;
    installment_number: number;
    amount: number;
    amount_paid: number;
    due_date: string;
    paid_date: string | null;
    status: string;
    payment_method: string | null;
  }>;
  project_packages: any[];
}

export interface PensionPackagesParams {
  page?: number;
  per_page?: number;
  status?: string;
}

export interface CreatePensionPackagePayload {
  name: string;
  name_bangla?: string;
  slug: string;
  monthly_amount: number;
  total_installments: number;
  maturity_amount: number;
  joining_commission: number;
  installment_commission: number;
  max_advance_installments: number;
  allow_full_prepayment: boolean;
  prepayment_discount_percentage: number;
  maturity_on_schedule: boolean;
  is_active: boolean;
  accepts_new_enrollment: boolean;
  description?: string;
  terms_conditions?: string;
}

export interface UpdatePensionPackagePayload {
  name?: string;
  name_bangla?: string;
  slug?: string;
  monthly_amount?: number;
  total_installments?: number;
  maturity_amount?: number;
  joining_commission?: number;
  installment_commission?: number;
  max_advance_installments?: number;
  allow_full_prepayment?: boolean;
  prepayment_discount_percentage?: number;
  maturity_on_schedule?: boolean;
  is_active?: boolean;
  accepts_new_enrollment?: boolean;
  description?: string;
  terms_conditions?: string;
}

/**
 * Hook: Get All Pension Packages
 * Fetches paginated list of all pension packages
 * 
 * @param params - Query parameters for filtering
 * @returns React Query result with paginated pension packages
 * 
 * @example
 * const { data, isLoading } = usePensionPackages({ page: 1, status: 'active' });
 */
export const usePensionPackages = (params?: PensionPackagesParams) => {
  return useQuery({
    queryKey: ['pensionPackages', params],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<PensionPackage>>(
        '/pensionpackages',
        { params }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * Hook: Get Single Pension Package
 * Fetches details of a specific pension package
 * 
 * @param id - Pension Package ID
 * @returns React Query result with pension package details
 * 
 * @example
 * const { data } = usePensionPackage(1);
 */
export const usePensionPackage = (id: number) => {
  return useQuery({
    queryKey: ['pensionPackage', id],
    queryFn: async () => {
      const response = await apiRequest.get<PensionPackageDetails>(`/pensionpackage/${id}`);
      return response.data.data; // Extract the actual data from ApiResponse wrapper
    },
    enabled: !!id,
  });
};

/**
 * Hook: Create Pension Package
 * Creates a new pension package
 * 
 * @returns React Query mutation for creating pension package
 * 
 * @example
 * const { mutate, isPending } = useCreatePensionPackage();
 * 
 * mutate({
 *   name: 'Gold Package',
 *   monthly_amount: 5000,
 *   duration_months: 120,
 *   total_amount: 600000,
 *   maturity_amount: 750000,
 *   status: 'active'
 * });
 */
export const useCreatePensionPackage = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<PensionPackage>,
    AxiosError,
    CreatePensionPackagePayload
  >({
    mutationFn: async (payload) => {
      const response = await apiRequest.post<PensionPackage>('/pensionpackages', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pensionPackages'] });
    },
  });
};

/**
 * Hook: Update Pension Package
 * Updates an existing pension package
 * 
 * @returns React Query mutation for updating pension package
 * 
 * @example
 * const { mutate } = useUpdatePensionPackage();
 * 
 * mutate({ id: 1, name: 'Updated Package', monthly_amount: 5500 });
 */
export const useUpdatePensionPackage = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<PensionPackage>,
    AxiosError,
    { id: number } & UpdatePensionPackagePayload
  >({
    mutationFn: async ({ id, ...payload }) => {
      const response = await apiRequest.put<PensionPackage>(`/pensionpackage/${id}`, payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pensionPackage', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['pensionPackages'] });
    },
  });
};

/**
 * Hook: Delete Pension Package
 * Deletes a pension package
 * 
 * @returns React Query mutation for deleting pension package
 * 
 * @example
 * const { mutate } = useDeletePensionPackage();
 * 
 * mutate(1);
 */
export const useDeletePensionPackage = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<void>,
    AxiosError,
    number
  >({
    mutationFn: async (id) => {
      const response = await apiRequest.delete(`/pensionpackage/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pensionPackages'] });
    },
  });
};
