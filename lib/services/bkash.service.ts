import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface PaymentSuccessRequest {
  payment_id: number;
  gateway_transaction_id?: string;
}

export interface PaymentFailedRequest {
  payment_id: number;
  failure_reason?: string;
}

export interface RetryPaymentRequest {
  payment_method: 'bkash' | 'sslcommerz';
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: any;
}

class BkashService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Confirm payment success after user completes payment in gateway
   */
  async confirmPaymentSuccess(data: PaymentSuccessRequest): Promise<PaymentResponse> {
    const response = await axios.post(
      `${API_URL}/public/membership-application/payment-success`,
      data,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  /**
   * Report payment failure
   */
  async reportPaymentFailure(data: PaymentFailedRequest): Promise<PaymentResponse> {
    const response = await axios.post(
      `${API_URL}/public/membership-application/payment-failed`,
      data,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  /**
   * Retry payment for an existing application
   */
  async retryPayment(applicationId: number, data: RetryPaymentRequest): Promise<PaymentResponse> {
    const response = await axios.post(
      `${API_URL}/public/membership-application/${applicationId}/retry-payment`,
      data,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }
}

export const bkashService = new BkashService();
