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

export const useMyWallet = () => {
  return useQuery({
    queryKey: ["my-wallet"],
    queryFn: async () => {
      const response = await apiRequest.get<Wallet>("/mywallet");
      return response.data.data; // response.data = ApiResponse<Wallet>, .data = Wallet ✅
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useMyWalletTransactions = (params?: WalletTransactionsParams) => {
  return useQuery({
    queryKey: ["my-wallet-transactions", params],
    queryFn: async () => {
      const response = await apiRequest.get<WalletTransaction[]>(
        "/mywallettransactions",
        { params },
      );
      return response.data.data; // response.data = ApiResponse<WalletTransaction[]>, .data = WalletTransaction[] ✅
    },
    staleTime: 1000 * 60 * 1,
  });
};
