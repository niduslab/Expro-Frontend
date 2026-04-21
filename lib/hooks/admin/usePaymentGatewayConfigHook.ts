import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  fetchPaymentGatewayConfigs,
  fetchPaymentGatewayConfigById,
  createPaymentGatewayConfig,
  updatePaymentGatewayConfig,
  deletePaymentGatewayConfig,
} from "@/lib//api/functions/admin/PaymentgatewayconfigApi";
import type {
  CreatePaymentGatewayConfigPayload,
  UpdatePaymentGatewayConfigPayload,
  PaymentGatewayConfigQueryParams,
} from "@/lib/types/admin/Paymentgatewayconfig";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const paymentGatewayConfigKeys = {
  all: ["payment-gateway-configs"] as const,
  lists: () => [...paymentGatewayConfigKeys.all, "list"] as const,
  list: (params?: PaymentGatewayConfigQueryParams) =>
    [...paymentGatewayConfigKeys.lists(), params] as const,
  details: () => [...paymentGatewayConfigKeys.all, "detail"] as const,
  detail: (id: number) => [...paymentGatewayConfigKeys.details(), id] as const,
};

// ─── usePaymentGatewayConfigs ─────────────────────────────────────────────────

export const usePaymentGatewayConfigs = (
  params?: PaymentGatewayConfigQueryParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: paymentGatewayConfigKeys.list(params),
    queryFn: () => fetchPaymentGatewayConfigs(params),
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
  });
};

// ─── usePaymentGatewayConfig ──────────────────────────────────────────────────

export const usePaymentGatewayConfig = (
  id: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: paymentGatewayConfigKeys.detail(id),
    queryFn: () => fetchPaymentGatewayConfigById(id),
    enabled: (options?.enabled ?? true) && !!id,
  });
};

// ─── useCreatePaymentGatewayConfig ────────────────────────────────────────────

export const useCreatePaymentGatewayConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentGatewayConfigPayload) =>
      createPaymentGatewayConfig(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentGatewayConfigKeys.lists() });
    },
  });
};

// ─── useUpdatePaymentGatewayConfig ────────────────────────────────────────────

export const useUpdatePaymentGatewayConfig = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePaymentGatewayConfigPayload) =>
      updatePaymentGatewayConfig(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentGatewayConfigKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: paymentGatewayConfigKeys.lists() });
    },
  });
};

// ─── useDeletePaymentGatewayConfig ────────────────────────────────────────────

export const useDeletePaymentGatewayConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePaymentGatewayConfig(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: paymentGatewayConfigKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: paymentGatewayConfigKeys.lists() });
    },
  });
};