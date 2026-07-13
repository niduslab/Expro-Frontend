import apiClient from "@/lib/api/axios";

/**
 * Donation payment API client.
 */

export interface PayDonationPayload {
  project_id?: number | null;
  amount: number;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  purpose?: string;
  message?: string;
  is_anonymous?: boolean;
  payment_method: "sslcommerz" | "bkash" | "nagad" | "rocket";
}

export interface PayDonationResponse {
  success: boolean;
  message: string;
  data: {
    donation_id: number;
    payment_id: number;
    payment_method: string;
    /** Present for SSLCommerz — redirect the browser here. */
    gateway_url?: string;
    /** Present for bKash. */
    bkashURL?: string;
    paymentID?: string;
    invoice_number: string;
    receipt_number: string;
    amount: string | number;
  };
}

/**
 * Initiate a donation payment.
 * Requires an authenticated user (the route is behind auth:sanctum).
 */
export const payDonation = async (
  payload: PayDonationPayload,
): Promise<PayDonationResponse> => {
  const response = await apiClient.post<PayDonationResponse>(
    "/donation/pay",
    payload,
  );
  return response.data;
};
