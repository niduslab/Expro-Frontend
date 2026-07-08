
import type {
  CreatePaymentGatewayConfigPayload,
  UpdatePaymentGatewayConfigPayload,
  PaymentGatewayConfigQueryParams,
  PaymentGatewayConfigResponse,
  PaymentGatewayConfigListResponse,
} from "@/lib/types/admin/Paymentgatewayconfig"
import { apiRequest } from "../../axios";

const ENDPOINT = "/payment-gateway-configs";

// ─── Fetch All ────────────────────────────────────────────────────────────────

export const fetchPaymentGatewayConfigs = async (
  params?: PaymentGatewayConfigQueryParams
): Promise<PaymentGatewayConfigListResponse> => {
  const response = await apiRequest.get<PaymentGatewayConfigListResponse>(ENDPOINT, {
    params,
  });
  return response.data as unknown as PaymentGatewayConfigListResponse;
};

// ─── Fetch Single ─────────────────────────────────────────────────────────────

export const fetchPaymentGatewayConfigById = async (
  id: number
): Promise<PaymentGatewayConfigResponse> => {
  const response = await apiRequest.get<PaymentGatewayConfigResponse>(`${ENDPOINT}/${id}`);
  return response.data as unknown as PaymentGatewayConfigResponse;
};

// ─── Create ───────────────────────────────────────────────────────────────────

export const createPaymentGatewayConfig = async (
  payload: CreatePaymentGatewayConfigPayload
): Promise<PaymentGatewayConfigResponse> => {
  const response = await apiRequest.post<PaymentGatewayConfigResponse>(ENDPOINT, payload);
  return response.data as unknown as PaymentGatewayConfigResponse;
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const updatePaymentGatewayConfig = async (
  id: number,
  payload: UpdatePaymentGatewayConfigPayload
): Promise<PaymentGatewayConfigResponse> => {
  const response = await apiRequest.put<PaymentGatewayConfigResponse>(
    `${ENDPOINT}/${id}`,
    payload
  );
  return response.data as unknown as PaymentGatewayConfigResponse;
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const deletePaymentGatewayConfig = async (
  id: number
): Promise<{ success: boolean; message: string }> => {
  const response = await apiRequest.delete<{ success: boolean; message: string }>(
    `${ENDPOINT}/${id}`
  );
  return response.data as unknown as { success: boolean; message: string };
};