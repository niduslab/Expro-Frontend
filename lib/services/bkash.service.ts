import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export interface PaymentSuccessRequest {
  payment_id: number;
  gateway_transaction_id?: string;
}

export interface PaymentFailedRequest {
  payment_id: number;
  failure_reason?: string;
}

export interface RetryPaymentRequest {
  payment_method: "bkash" | "sslcommerz";
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface CreatePaymentRequest {
  amount: number;
  payment_type: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  user_id?: number;
  reference_id?: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  message: string;
  data: {
    bkashURL: string;
    payment_id: number;
    paymentID?: string;
  };
}

class BkashService {
  private getAuthHeaders() {
    const token = localStorage.getItem("auth_token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async createPayment(
    data: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> {
    const response = await axios.post(
      `${API_URL}/public/payment/bkash/create`, // ← adjust to your actual endpoint
      data,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  async confirmPaymentSuccess(
    data: PaymentSuccessRequest,
  ): Promise<PaymentResponse> {
    const response = await axios.post(
      `${API_URL}/public/membership-application/payment-success`,
      data,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  async reportPaymentFailure(
    data: PaymentFailedRequest,
  ): Promise<PaymentResponse> {
    const response = await axios.post(
      `${API_URL}/public/membership-application/payment-failed`,
      data,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  async retryPayment(
    applicationId: number,
    data: RetryPaymentRequest,
  ): Promise<PaymentResponse> {
    const response = await axios.post(
      `${API_URL}/public/membership-application/${applicationId}/retry-payment`,
      data,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }
}

export const bkashService = new BkashService();
