import apiClient from "@/lib/api/axios";
import { useQuery } from "@tanstack/react-query";

/**
 * Donation Types
 */
export interface Donation {
  id: number;
  project_id: number; // Added based on API response
  user_id: number | null; // Added based on API response
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: string; // API returns string "1000.00", not number
  currency: string;
  type: string; // API returns "type", not "donation_type"
  status: "pending" | "completed" | "failed" | "refunded";
  purpose?: string;
  message?: string | null;
  is_anonymous: boolean;
  payment_id?: string | null;
  wallet_transaction_id?: string | null;
  receipt_number?: string;
  metadata?: string;
  created_at: string;
  updated_at: string;
}

// This interface matches the ROOT of the API response
export interface DonationsApiResponse {
  success: boolean;
  message: string;
  data: Donation[]; // The list is directly here
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    // Note: API response didn't show 'from' or 'to', so remove them if not present
  };
}

export interface DonationsParams {
  page?: number;
  per_page?: number;
  type?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
}

/**
 * Hook: Get All Donations (Admin)
 * Fetches paginated list of all donations
 *
 * @param page - Page number (default: 1)
 * @param params - Additional query parameters
 * @returns React Query result with paginated donations
 *
 * @example
 * const { data, isLoading, error } = useDonations(1);
 *
 * // With additional params
 * const { data } = useDonations(1, {
 *   status: 'completed',
 *   type: 'general'
 * });
 */
export const useDonations = (
  page: number = 1,
  params?: Omit<DonationsParams, "page">,
) => {
  return useQuery({
    queryKey: ["donations", page, params],
    queryFn: async () => {
      // Axios response.data is the JSON body: { success, message, data: [], pagination: {} }
      const response = await apiClient.get<DonationsApiResponse>("/donations", {
        params: { page, per_page: 15, ...params },
      });

      // Return the whole parsed JSON object
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });
};
/**
 * Hook: Get Single Donation (Admin)
 * Fetches details of a specific donation
 *
 * @param id - Donation ID
 * @returns React Query result with donation details
 *
 * @example
 * const { data: donation } = useDonation(1);
 */
export const useDonation = (id: number) => {
  return useQuery({
    queryKey: ["donation", id],
    queryFn: async () => {
      const response = await apiClient.get<{
        success: boolean;
        data: Donation;
      }>(`/donation/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};
