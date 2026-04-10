import { apiRequest, ApiResponse } from "@/lib/api/axios";
import { Wallet, WalletTransaction } from "@/lib/types/admin/walletsType";

/**
 * Get the authenticated user's wallet
 *
 * GET /mywallet
 */
export const getMyWallet = async (): Promise<ApiResponse<Wallet>> => {
  const response = await apiRequest.get<Wallet>("/mywallet");
  return response.data;
};

/**
 * Get the authenticated user's wallet transactions
 *
 * GET /mywallettransactions
 */
export const getMyWalletTransactions = async (): Promise<
  ApiResponse<WalletTransaction[]>
> => {
  const response = await apiRequest.get<WalletTransaction[]>(
    "/mywallettransactions",
  );
  return response.data;
};
