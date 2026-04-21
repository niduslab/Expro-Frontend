/**
 * Payment Gateway Config — Types
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type GatewayType = "bkash" | "nagad" | "rocket" | "stripe" | "paypal" | string;

// ─── Core Model ───────────────────────────────────────────────────────────────

export interface PaymentGatewayConfig {
  id: number;
  gateway_type: GatewayType;
  is_active: boolean;
 credentials: Record<string, string | boolean>;
  created_at: string;
  updated_at: string;
}

// ─── Request Payloads ─────────────────────────────────────────────────────────

export interface CreatePaymentGatewayConfigPayload {
  gateway_type: GatewayType;
  is_active: boolean;
  credentials: Record<string, string | boolean>;
}

export interface UpdatePaymentGatewayConfigPayload {
  is_active?: boolean;
 credentials: Record<string, string | boolean>;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface PaymentGatewayConfigQueryParams {
  page?: number;
  per_page?: number;
  gateway_type?: GatewayType;
  is_active?: boolean;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface PaymentGatewayConfigResponse {
  success: boolean;
  message: string;
  data: PaymentGatewayConfig;
}

export interface PaymentGatewayConfigListResponse {
  success: boolean;
  message: string;
  data: PaymentGatewayConfig[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}