import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest, ApiResponse, PaginatedResponse } from '@/lib/api/axios';
import { AxiosError } from 'axios';

/**
 * Pension Investment Types
 */
export type InvestmentSector = 'productive' | 'service' | 'income_project' | 'reserve';
export type InvestmentStatus = 'active' | 'matured' | 'closed' | 'underperforming' | 'defaulted';
export type RiskLevel = 'low' | 'medium' | 'high';
export type DistributionStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface InvestmentPaginatedData {
  current_page: number;
  data: PensionInvestment[];
  total: number;
  per_page?: number;
  last_page?: number;
}

export interface PensionInvestment {
  id: number;
  investment_code: string;
  investment_name: string;
  investment_name_bangla?: string;
  sector: InvestmentSector;
  sub_sector?: string;
  amount_invested: string;
  current_value: string;
  profit_generated: string;
  monthly_return?: string;
  roi_percentage: string;
  investment_date: string;
  maturity_date?: string;
  investment_duration_months?: number;
  status: InvestmentStatus;
  expected_return_percentage: string;
  actual_return_percentage?: string;
  last_valuation_date?: string;
  risk_level: RiskLevel;
  is_mature: boolean;
  days_to_maturity?: number;
  performance_status?: string;
  description?: string;
  terms_conditions?: string;
  documents?: string[];
  notes?: string;
  managed_by?: number;
  approved_by?: number;
  approved_at?: string;
  manager?: {
    id: number;
    name: string;
    email: string;
  };
  approver?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProfitDistribution {
  id: number;
  pension_investment_id: number;
  pension_enrollment_id: number;
  user_id: number;
  investment_amount_basis: string;
  profit_share_amount: string;
  distribution_percentage: string;
  distribution_date: string;
  status: DistributionStatus;
  payment_method?: string;
  transaction_reference?: string;
  wallet_transaction_id?: number;
  paid_at?: string;
  processed_by?: number;
  pension_investment?: PensionInvestment;
  pension_enrollment?: {
    id: number;
    enrollment_number: string;
  };
  wallet_transaction?: {
    id: number;
    transaction_id: string;
    amount: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface InvestmentStatistics {
  total_investments: number;
  active_investments: number;
  mature_investments: number;
  total_invested: string;
  current_value: string;
  total_profit: string;
  average_roi: string;
  by_sector: Array<{
    sector: InvestmentSector;
    count: number;
    total_invested: string;
    total_profit: string;
  }>;
  by_status: Array<{
    status: InvestmentStatus;
    count: number;
  }>;
  by_risk_level: Array<{
    risk_level: RiskLevel;
    count: number;
    total_invested: string;
  }>;
}

export interface InvestmentsParams {
  page?: number;
  per_page?: number;
  sector?: InvestmentSector;
  status?: InvestmentStatus;
  risk_level?: RiskLevel;
  active_only?: boolean;
  mature_only?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CreateInvestmentPayload {
  investment_name: string;
  investment_name_bangla?: string;
  sector: InvestmentSector;
  sub_sector?: string;
  amount_invested: number;
  investment_date: string;
  maturity_date?: string;
  investment_duration_months?: number;
  expected_return_percentage: number;
  risk_level: RiskLevel;
  description?: string;
  terms_conditions?: string;
  documents?: string[];
  managed_by?: number;
  notes?: string;
}

export interface UpdateInvestmentPayload {
  investment_name?: string;
  investment_name_bangla?: string;
  sector?: InvestmentSector;
  sub_sector?: string;
  current_value?: number;
  status?: InvestmentStatus;
  maturity_date?: string;
  expected_return_percentage?: number;
  risk_level?: RiskLevel;
  description?: string;
  terms_conditions?: string;
  documents?: string[];
  notes?: string;
}

export interface UpdateValuationPayload {
  current_value: number;
  notes?: string;
}

export interface DistributeProfitsResponse {
  total_distributions: number;
  total_profit_distributed: string;
  distributions: ProfitDistribution[];
}

export interface ProcessDistributionsResponse {
  total: number;
  processed: number;
  failed: number;
}

export interface MyProfitDistributionsParams {
  page?: number;
  per_page?: number;
  status?: DistributionStatus;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface MyProfitDistributionsResponse {
  data: PaginatedResponse<ProfitDistribution>;
  totals: {
    total_profit_received: string;
    total_paid: string;
    total_pending: string;
  };
}

/**
 * Hook: Get All Pension Investments (Public)
 * Fetches paginated list of all pension investments
 * 
 * @param params - Query parameters for filtering
 * @returns React Query result with paginated investments
 * 
 * @example
 * const { data, isLoading } = usePensionInvestments({ sector: 'service', active_only: true });
 */
export const usePensionInvestments = (params?: InvestmentsParams) => {
  return useQuery({
    queryKey: ['pensionInvestments', params],
    queryFn: async () => {
      const response = await apiRequest.get<InvestmentPaginatedData>(
        '/public/pension-investments',
        { params }
      );
      // API returns { success: true, data: { current_page, data: [], total } }
      // response.data is the ApiResponse wrapper, response.data.data is the actual data
      const result = response.data.data;
      
      // Ensure we have the correct structure
      if (!result || typeof result !== 'object') {
        console.error('Invalid response structure:', response.data);
        return { current_page: 1, data: [], total: 0, per_page: 10, last_page: 1 };
      }
      
      return result;
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * Hook: Get Single Pension Investment (Public)
 * Fetches details of a specific pension investment
 * 
 * @param id - Investment ID
 * @returns React Query result with investment details
 * 
 * @example
 * const { data } = usePensionInvestment(1);
 */
export const usePensionInvestment = (id: number) => {
  return useQuery({
    queryKey: ['pensionInvestment', id],
    queryFn: async () => {
      const response = await apiRequest.get<ApiResponse<PensionInvestment>>(
        `/public/pension-investment/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook: Get Investment Statistics (Public)
 * Fetches comprehensive investment statistics
 * 
 * @returns React Query result with statistics
 * 
 * @example
 * const { data } = useInvestmentStatistics();
 */
export const useInvestmentStatistics = () => {
  return useQuery({
    queryKey: ['investmentStatistics'],
    queryFn: async () => {
      const response = await apiRequest.get<ApiResponse<InvestmentStatistics>>(
        '/public/pension-investments/statistics'
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: Create Pension Investment (Admin)
 * Creates a new pension investment
 * 
 * @returns React Query mutation for creating investment
 * 
 * @example
 * const { mutate, isPending } = useCreateInvestment();
 * 
 * mutate({
 *   investment_name: 'Healthcare Clinic',
 *   sector: 'service',
 *   amount_invested: 5000000,
 *   investment_date: '2026-04-15',
 *   risk_level: 'medium'
 * });
 */
export const useCreateInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<PensionInvestment>,
    AxiosError,
    CreateInvestmentPayload
  >({
    mutationFn: async (payload) => {
      const response = await apiRequest.post<PensionInvestment>(
        '/pension-investments',
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pensionInvestments'] });
      queryClient.invalidateQueries({ queryKey: ['investmentStatistics'] });
    },
  });
};

/**
 * Hook: Update Pension Investment (Admin)
 * Updates an existing pension investment
 * 
 * @returns React Query mutation for updating investment
 * 
 * @example
 * const { mutate } = useUpdateInvestment();
 * 
 * mutate({ id: 1, investment_name: 'Updated Name', current_value: 5500000 });
 */
export const useUpdateInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<PensionInvestment>,
    AxiosError,
    { id: number } & UpdateInvestmentPayload
  >({
    mutationFn: async ({ id, ...payload }) => {
      const response = await apiRequest.put<PensionInvestment>(
        `/pension-investments/${id}`,
        payload
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pensionInvestment', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['pensionInvestments'] });
      queryClient.invalidateQueries({ queryKey: ['investmentStatistics'] });
    },
  });
};

/**
 * Hook: Update Investment Valuation (Admin)
 * Updates the current value of an investment
 * 
 * @returns React Query mutation for updating valuation
 * 
 * @example
 * const { mutate } = useUpdateValuation();
 * 
 * mutate({ id: 1, current_value: 5500000, notes: 'Q2 2026 valuation' });
 */
export const useUpdateValuation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<PensionInvestment>,
    AxiosError,
    { id: number } & UpdateValuationPayload
  >({
    mutationFn: async ({ id, ...payload }) => {
      const response = await apiRequest.post<PensionInvestment>(
        `/pension-investments/${id}/update-valuation`,
        payload
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pensionInvestment', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['pensionInvestments'] });
      queryClient.invalidateQueries({ queryKey: ['investmentStatistics'] });
    },
  });
};

/**
 * Hook: Approve Investment (Admin)
 * Approves a pension investment
 * 
 * @returns React Query mutation for approving investment
 * 
 * @example
 * const { mutate } = useApproveInvestment();
 * 
 * mutate(1);
 */
export const useApproveInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<PensionInvestment>,
    AxiosError,
    number
  >({
    mutationFn: async (id) => {
      const response = await apiRequest.post<PensionInvestment>(
        `/pension-investments/${id}/approve`
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['pensionInvestment', id] });
      queryClient.invalidateQueries({ queryKey: ['pensionInvestments'] });
    },
  });
};

/**
 * Hook: Distribute Profits (Admin)
 * Creates profit distribution records for all completed pension enrollments
 * 
 * @returns React Query mutation for distributing profits
 * 
 * @example
 * const { mutate } = useDistributeProfits();
 * 
 * mutate(1);
 */
export const useDistributeProfits = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<DistributeProfitsResponse>,
    AxiosError,
    number
  >({
    mutationFn: async (id) => {
      const response = await apiRequest.post<DistributeProfitsResponse>(
        `/pension-investments/${id}/distribute-profits`
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['pensionInvestment', id] });
      queryClient.invalidateQueries({ queryKey: ['pensionInvestments'] });
    },
  });
};

/**
 * Hook: Process Profit Distributions (Admin)
 * Processes all pending profit distributions by crediting member wallets
 * 
 * @returns React Query mutation for processing distributions
 * 
 * @example
 * const { mutate } = useProcessDistributions();
 * 
 * mutate(1);
 */
export const useProcessDistributions = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ProcessDistributionsResponse>,
    AxiosError,
    number
  >({
    mutationFn: async (id) => {
      const response = await apiRequest.post<ProcessDistributionsResponse>(
        `/pension-investments/${id}/process-distributions`
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['pensionInvestment', id] });
      queryClient.invalidateQueries({ queryKey: ['myProfitDistributions'] });
    },
  });
};

/**
 * Hook: Get My Profit Distributions (Member)
 * Fetches the authenticated member's profit distribution history
 * 
 * @param params - Query parameters for filtering
 * @returns React Query result with profit distributions
 * 
 * @example
 * const { data } = useMyProfitDistributions({ status: 'completed' });
 */
export const useMyProfitDistributions = (params?: MyProfitDistributionsParams) => {
  return useQuery({
    queryKey: ['myProfitDistributions', params],
    queryFn: async () => {
      const response = await apiRequest.get<MyProfitDistributionsResponse>(
        '/pension-investments/my-profit-distributions',
        { params }
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook: Delete Pension Investment (Admin)
 * Deletes a pension investment
 * 
 * @returns React Query mutation for deleting investment
 * 
 * @example
 * const { mutate } = useDeleteInvestment();
 * 
 * mutate(1);
 */
export const useDeleteInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<void>,
    AxiosError,
    number
  >({
    mutationFn: async (id) => {
      const response = await apiRequest.delete(`/pension-investments/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pensionInvestments'] });
      queryClient.invalidateQueries({ queryKey: ['investmentStatistics'] });
    },
  });
};
