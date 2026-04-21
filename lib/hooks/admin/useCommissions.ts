import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, ApiResponse, PaginatedResponse } from "@/lib/api/axios";
import { AxiosError } from "axios";

/**
 * Commission Types
 */
export interface Commission {
  id: number;
  user_id: number;
  type: string;
  amount: string;
  percentage: string | null;
  base_amount: string | null;
  source_type: string;
  source_id: number;
  source_user_id: number;
  status: "pending" | "approved" | "rejected" | string;
  approved_by: number | null;
  approved_at: string | null;
  wallet_transaction_id: number | null;
  description?: string;
  rejection_reason?: string | null;
  project_id: number | null;
  commission_rule_id: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CommissionsParams {
  page?: number;
  per_page?: number;
  status?: string;
  type?: string;
  user_id?: number;
}

export interface CreateCommissionPayload {
  user_id: number;
  type: string;
  amount: number;
  percentage?: number | null;
  base_amount?: number | null;
  source_type?: string;
  source_id?: number;
  source_user_id?: number;
  status: string;
  description?: string;
  project_id?: number | null;
  commission_rule_id?: number | null;
}

export interface UpdateCommissionPayload {
  user_id?: number;
  type?: string;
  amount?: number;
  percentage?: number | null;
  base_amount?: number | null;
  status?: string;
  description?: string;
  rejection_reason?: string;
  approved_by?: number;
}

/**
 * Commission Rule Types
 */
export interface CommissionRule {
  id: number;
  name: string;
  slug: string;
  rule_type: "referral" | "milestone" | "hierarchy" | "package" | string;
  role_slug: string | null;
  min_collection: string | null;
  max_collection: string | null;
  commission_type: "fixed" | "percentage";
  commission_value: string;
  is_one_time: boolean;
  is_active: boolean;
  priority: number;
  conditions: Record<string, any> | null;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommissionRulesParams {
  page?: number;
  per_page?: number;
  role_slug?: string;
  rule_type?: string;
  is_active?: boolean;
}

export interface CreateCommissionRulePayload {
  name: string;
  slug: string;
  rule_type: string;
  role_slug?: string | null;
  min_collection?: number | null;
  max_collection?: number | null;
  commission_type: "fixed" | "percentage";
  commission_value: number;
  is_one_time: boolean;
  is_active: boolean;
  priority?: number;
  conditions?: Record<string, any> | null;
  description?: string;
}

export interface UpdateCommissionRulePayload {
  name?: string;
  slug?: string;
  rule_type?: string;
  role_slug?: string | null;
  min_collection?: number | null;
  max_collection?: number | null;
  commission_type?: "fixed" | "percentage";
  commission_value?: number;
  is_one_time?: boolean;
  is_active?: boolean;
  priority?: number;
  conditions?: Record<string, any> | null;
  description?: string;
}

// ==================== COMMISSION HOOKS ====================

/**
 * Hook: Get All Commissions
 * Fetches paginated list of all commissions with advanced filtering
 *
 * @param params - Query parameters for filtering
 * @returns React Query result with paginated commissions
 *
 * @example
 * const { data, isLoading } = useCommissions({ page: 1, status: 'paid' });
 */
export const useCommissions = (params?: CommissionsParams) => {
  return useQuery({
    queryKey: ["commissions", params],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<Commission>>(
        "/commissions",
        { params },
      );
      // API shape: { success, message, data: Commission[], pagination: {...} }
      // axios puts the full response body in response.data
      return response.data as unknown as {
        data: Commission[];
        pagination: {
          total: number;
          per_page: number;
          current_page: number;
          last_page: number;
        };
      };
    },
    staleTime: 1000 * 60 * 3,
  });
};

/**
 * Hook: Create Commission
 * Creates a new commission
 *
 * @returns React Query mutation for creating commission
 *
 * @example
 * const { mutate, isPending } = useCreateCommission();
 *
 * mutate({
 *   user_id: 1,
 *   amount: 500,
 *   type: 'referral',
 *   status: 'pending'
 * });
 */
export const useCreateCommission = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Commission>,
    AxiosError,
    CreateCommissionPayload
  >({
    mutationFn: async (payload) => {
      const response = await apiRequest.post<Commission>(
        "/commission",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commissions"] });
    },
  });
};

/**
 * Hook: Update Commission
 * Updates an existing commission
 *
 * @returns React Query mutation for updating commission
 *
 * @example
 * const { mutate } = useUpdateCommission();
 *
 * mutate({ id: 1, status: 'paid' });
 */
export const useUpdateCommission = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Commission>,
    AxiosError,
    { id: number } & UpdateCommissionPayload
  >({
    mutationFn: async ({ id, ...payload }) => {
      const response = await apiRequest.put<Commission>(
        `/commission/${id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commissions"] });
    },
  });
};

/**
 * Hook: Delete Commission
 * Deletes a commission
 *
 * @returns React Query mutation for deleting commission
 *
 * @example
 * const { mutate } = useDeleteCommission();
 *
 * mutate(1);
 */
export const useDeleteCommission = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, AxiosError, number>({
    mutationFn: async (id) => {
      const response = await apiRequest.delete(`/commission/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commissions"] });
    },
  });
};

// ==================== COMMISSION RULES HOOKS ====================

/**
 * Hook: Get All Commission Rules
 * Fetches paginated list of all commission rules
 *
 * @param params - Query parameters for filtering
 * @returns React Query result with paginated commission rules
 *
 * @example
 * const { data, isLoading } = useCommissionRules({ page: 1 });
 */
export const useCommissionRules = (params?: CommissionRulesParams) => {
  return useQuery({
    queryKey: ["commission-rules", params],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<CommissionRule>>(
        "/commission-rules",
        { params },
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * Hook: Get Active Commission Rules
 * Fetches only active commission rules
 *
 * @returns React Query result with active commission rules
 *
 * @example
 * const { data, isLoading } = useActiveCommissionRules();
 */
export const useActiveCommissionRules = () => {
  return useQuery({
    queryKey: ["commission-rules", "active"],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<CommissionRule>>(
        "/commission-rules/active",
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook: Get Commission Rules by Role
 * Fetches commission rules for a specific role
 *
 * @param roleSlug - Role slug to filter by
 * @returns React Query result with commission rules for the role
 *
 * @example
 * const { data } = useCommissionRulesByRole('admin');
 */
export const useCommissionRulesByRole = (roleSlug: string) => {
  return useQuery({
    queryKey: ["commission-rules", "role", roleSlug],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<CommissionRule>>(
        `/commission-rules/by-role/${roleSlug}`,
      );
      return response.data;
    },
    enabled: !!roleSlug,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * Hook: Get Commission Rules by Type
 * Fetches commission rules for a specific type
 *
 * @param ruleType - Rule type to filter by
 * @returns React Query result with commission rules for the type
 *
 * @example
 * const { data } = useCommissionRulesByType('referral');
 */
export const useCommissionRulesByType = (ruleType: string) => {
  return useQuery({
    queryKey: ["commission-rules", "type", ruleType],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<CommissionRule>>(
        `/commission-rules/by-type/${ruleType}`,
      );
      return response.data;
    },
    enabled: !!ruleType,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * Hook: Get Single Commission Rule
 * Fetches details of a specific commission rule
 *
 * @param id - Commission Rule ID
 * @returns React Query result with commission rule details
 *
 * @example
 * const { data } = useCommissionRule(1);
 */
export const useCommissionRule = (id: number) => {
  return useQuery({
    queryKey: ["commission-rule", id],
    queryFn: async () => {
      const response = await apiRequest.get<CommissionRule>(
        `/commission-rule/${id}`,
      );
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook: Create Commission Rule
 * Creates a new commission rule
 *
 * @returns React Query mutation for creating commission rule
 *
 * @example
 * const { mutate, isPending } = useCreateCommissionRule();
 *
 * mutate({
 *   role_slug: 'admin',
 *   rule_type: 'referral',
 *   percentage: 10,
 *   is_active: true
 * });
 */
export const useCreateCommissionRule = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<CommissionRule>,
    AxiosError,
    CreateCommissionRulePayload
  >({
    mutationFn: async (payload) => {
      const response = await apiRequest.post<CommissionRule>(
        "/commission-rule",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-rules"] });
    },
  });
};

/**
 * Hook: Update Commission Rule
 * Updates an existing commission rule
 *
 * @returns React Query mutation for updating commission rule
 *
 * @example
 * const { mutate } = useUpdateCommissionRule();
 *
 * mutate({ id: 1, percentage: 15 });
 */
export const useUpdateCommissionRule = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<CommissionRule>,
    AxiosError,
    { id: number } & UpdateCommissionRulePayload
  >({
    mutationFn: async ({ id, ...payload }) => {
      const response = await apiRequest.put<CommissionRule>(
        `/commission-rule/${id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["commission-rule", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["commission-rules"] });
    },
  });
};

/**
 * Hook: Delete Commission Rule
 * Deletes a commission rule
 *
 * @returns React Query mutation for deleting commission rule
 *
 * @example
 * const { mutate } = useDeleteCommissionRule();
 *
 * mutate(1);
 */
export const useDeleteCommissionRule = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, AxiosError, number>({
    mutationFn: async (id) => {
      const response = await apiRequest.delete(`/commission-rule/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-rules"] });
    },
  });
};
