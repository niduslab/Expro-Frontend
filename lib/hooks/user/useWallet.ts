import { useQuery } from "@tanstack/react-query";
import { apiRequest, PaginatedResponse } from "@/lib/api/axios";
import {
  Wallet,
  WalletTransaction,
  WalletTransactionsParams,
} from "@/lib/types/admin/walletsType";

/**
 * Wallet Types
 */

/**
 * Hook: Get My Wallet
 * Fetches the authenticated user's wallet information
 *
 * @returns React Query result with wallet data
 *
 * @example
 * const { data, isLoading } = useMyWallet();
 */
export const useMyWallet = () => {
  return useQuery({
    queryKey: ["my-wallet"],
    queryFn: async () => {
      const response = await apiRequest.get<Wallet>("/mywallet");
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook: Get My Wallet Transactions
 * Fetches the authenticated user's wallet transactions with filtering
 *
 * @param params - Query parameters for filtering transactions
 * @returns React Query result with paginated transactions
 *
 * @example
 * const { data, isLoading } = useMyWalletTransactions({
 *   page: 1,
 *   type: 'credit',
 *   category: 'commission'
 * });
 */
export const useMyWalletTransactions = (params?: WalletTransactionsParams) => {
  return useQuery({
    queryKey: ["my-wallet-transactions", params],
    queryFn: async () => {
      const response = await apiRequest.get<
        PaginatedResponse<WalletTransaction>
      >("/mywallettransactions", { params });
      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};
