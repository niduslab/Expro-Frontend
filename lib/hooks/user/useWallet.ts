import { useQuery } from '@tanstack/react-query';
import { apiRequest, PaginatedResponse } from '@/lib/api/axios';

/**
 * Wallet Types
 */
export interface Wallet {
  id: number;
  user_id: number;
  balance: number;
  currency: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface WalletTransaction {
  id: number;
  type: 'credit' | 'debit';
  category: string;
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

export interface WalletTransactionsParams {
  page?: number;
  per_page?: number;
  type?: 'credit' | 'debit';
  category?: string;
  from_date?: string;
  to_date?: string;
}

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
    queryKey: ['my-wallet'],
    queryFn: async () => {
      const response = await apiRequest.get<Wallet>('/mywallet');
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
    queryKey: ['my-wallet-transactions', params],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<WalletTransaction>>(
        '/mywallettransactions',
        { params }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};
