import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
  authApi,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "@/lib/api/functions/public/forgetPasswordApi";
import { ApiError, ApiResponse } from "@/lib/api/axios";

// ─── useForgotPassword ────────────────────────────────────────────────────────

/**
 * Hook: useForgotPassword
 *
 * Sends a 6-digit OTP reset token to the provided email address.
 *
 * @example
 * const { mutate, isPending } = useForgotPassword({
 *   onSuccess: (data) => toast.success(data.message),
 * });
 *
 * mutate({ email: "user@example.com" });
 */
export const useForgotPassword = (options?: {
  onSuccess?: (data: ApiResponse<ForgotPasswordResponse>) => void;
  onError?: (error: AxiosError<ApiError>) => void;
}) => {
  return useMutation<
    ApiResponse<ForgotPasswordResponse>,
    AxiosError<ApiError>,
    ForgotPasswordPayload
  >({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      const response = await authApi.forgotPassword(payload);
      return response.data;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

// ─── useVerifyOtp ─────────────────────────────────────────────────────────────

/**
 * Hook: useVerifyOtp
 *
 * Verifies the 6-digit OTP sent to the user's email.
 * The token expires in 5 minutes.
 *
 * @example
 * const { mutate, isPending } = useVerifyOtp({
 *   onSuccess: (data) => {
 *     if (data.verified) navigate("/reset-password");
 *   },
 * });
 *
 * mutate({ email: "user@example.com", token: "123456" });
 */
export const useVerifyOtp = (options?: {
  onSuccess?: (data: ApiResponse<VerifyOtpResponse>) => void;
  onError?: (error: AxiosError<ApiError>) => void;
}) => {
  return useMutation<
    ApiResponse<VerifyOtpResponse>,
    AxiosError<ApiError>,
    VerifyOtpPayload
  >({
    mutationFn: async (payload: VerifyOtpPayload) => {
      const response = await authApi.verifyOtp(payload);
      return response.data;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

// ─── useResetPassword ─────────────────────────────────────────────────────────

/**
 * Hook: useResetPassword
 *
 * Resets the user's password using a valid OTP token.
 * The token expires in 60 minutes. All existing sessions are
 * revoked on success.
 *
 * @example
 * const { mutate, isPending } = useResetPassword({
 *   onSuccess: (data) => {
 *     toast.success(data.message);
 *     navigate("/login");
 *   },
 * });
 *
 * mutate({
 *   email: "user@example.com",
 *   token: "123456",
 *   password: "newpassword123",
 *   password_confirmation: "newpassword123",
 * });
 */
export const useResetPassword = (options?: {
  onSuccess?: (data: ApiResponse<ResetPasswordResponse>) => void;
  onError?: (error: AxiosError<ApiError>) => void;
}) => {
  return useMutation<
    ApiResponse<ResetPasswordResponse>,
    AxiosError<ApiError>,
    ResetPasswordPayload
  >({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const response = await authApi.resetPassword(payload);
      return response.data;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
