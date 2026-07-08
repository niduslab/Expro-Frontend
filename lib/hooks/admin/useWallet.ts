import { useQuery } from "@tanstack/react-query";
import { apiRequest, PaginatedResponse } from "@/lib/api/axios";

/**
 * Company Wallet Types
 */
export interface CompanyWallet {
  id: number;
  balance: number;
  currency: string;
  status: "active" | "inactive" | "suspended";
  total_deposits: number;
  total_withdrawals: number;
  last_transaction_date: string;
}

export interface CompanyWalletDashboard {
  total_balance: number;
  commission_pool: number;
  total_deposited: number;
  total_withdrawn: number;
  pending_commissions: number;
  monthly_stats: {
    deposits: number;
    withdrawals: number;
    net_change: number;
  };
  recent_activity: Array<{
    type: "credit" | "debit";
    amount: number;
    description: string;
    date: string;
  }>;
}

export interface CompanyWalletTransaction {
  id: number;
  transaction_id: string;
  type: "credit" | "debit";
  category: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  notes?: string | null;
  status: "completed" | "pending" | "failed";
  processed_by?: number | null;
  processed_at?: string | null;
  user_id?: number;
  user_name?: string;
  created_at: string;
}

export interface CompanyWalletInfo {
  id: number;
  wallet_type: string;
  balance: number;
  total_received: number;
  total_membership_paid: number;
  total_pension_paid: number;
  total_commission_paid: number;
  total_withdrawals_paid: number;
}

export interface CompanyWalletTransactionsResponse {
  data: CompanyWalletTransaction[];
  wallet: CompanyWalletInfo;
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface CompanyWalletTransactionsParams {
  page?: number;
  per_page?: number;
  type?: "credit" | "debit";
  category?: string;
  status?: "completed" | "pending" | "failed";
  user_id?: number;
  search?: string;
  from_date?: string; // ✅ add these
  to_date?: string;
}
/**
 * Hook: Get Company Wallet
 * Fetches the company wallet information (Admin only)
 *
 * @returns React Query result with company wallet data
 *
 * @example
 * const { data, isLoading } = useCompanyWallet();
 */
export const useCompanyWallet = () => {
  return useQuery({
    queryKey: ["company-wallet"],
    queryFn: async () => {
      const response = await apiRequest.get<CompanyWallet>(
        "/admin/wallets/company",
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook: Get Company Wallet Dashboard
 * Fetches the company wallet dashboard with statistics (Admin only)
 *
 * @returns React Query result with dashboard data
 *
 * @example
 * const { data, isLoading } = useCompanyWalletDashboard();
 */
export const useCompanyWalletDashboard = () => {
  return useQuery({
    queryKey: ["company-wallet-dashboard"],
    queryFn: async () => {
      const response = await apiRequest.get<CompanyWalletDashboard>(
        "/admin/wallets/company/dashboard",
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook: Get Company Wallet Transactions
 * Fetches the company wallet transactions with filtering (Admin only)
 *
 * @param params - Query parameters for filtering transactions
 * @returns React Query result with paginated transactions and wallet info
 *
 * @example
 * const { data, isLoading } = useCompanyWalletTransactions({
 *   page: 1,
 *   type: 'credit',
 *   category: 'membership_fee'
 * });
 */
export const useCompanyWalletTransactions = (
  params?: CompanyWalletTransactionsParams,
) => {
  return useQuery({
    queryKey: ["company-wallet-transactions", params],
    queryFn: async () => {
      const response = await apiRequest.get<CompanyWalletTransactionsResponse>(
        "/admin/wallets/company/transactions",
        { params },
      );
      return response.data as unknown as CompanyWalletTransactionsResponse; // ✅ remove the extra .data
    },
    staleTime: 1000 * 60 * 1,
  });
};
