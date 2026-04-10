import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface PensionPaymentRequest {
  count: number;
  payment_method?: 'bkash' | 'sslcommerz';
}

export interface PensionPaymentData {
  payment_id: number;
  payment_method: string;
  bkashURL?: string;
  paymentID?: string;
  amount: string;
  currency: string;
  gateway_url?: string;
}

export interface PensionPaymentResponse {
  success: boolean;
  message: string;
  data?: PensionPaymentData;
}

export interface PensionPaymentCallbackRequest {
  payment_id: number;
  status: 'success' | 'failed';
  gateway_transaction_id?: string;
}

export interface PensionPaymentCallbackResponse {
  success: boolean;
  message: string;
  status: string;
  payment_id: string;
}

class PensionPaymentService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Initiate pension installment payment
   */
  async initiatePayment(
    enrollmentId: number,
    data: PensionPaymentRequest
  ): Promise<PensionPaymentResponse> {
    const response = await axios.post(
      `${API_URL}/pension-enrollment/pay/${enrollmentId}`,
      data,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  /**
   * Complete pension payment after callback
   */
  async completePayment(
    data: PensionPaymentCallbackRequest
  ): Promise<PensionPaymentCallbackResponse> {
    const response = await axios.post(
      `${API_URL}/pension-enrollment/pay/callback`,
      data,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }
}

export const pensionPaymentService = new PensionPaymentService();
