import apiClient from "@/lib/api/axios";
import { useQuery } from "@tanstack/react-query";

/**
 * Donation Types
 */
export interface Donation {
  id: number;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: number;
  currency: string;
  donation_type: string;
  purpose?: string;
  is_anonymous: boolean;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_method?: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DonationsResponse {
  data: Donation[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
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
      const response = await apiClient.get<{
        success: boolean;
        data: DonationsResponse;
      }>("/donations", {
        params: { page, per_page: 15, ...params },
      });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
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
