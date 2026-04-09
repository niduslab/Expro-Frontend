import { apiRequest } from "../../axios";

/**
 * Auth - Password Reset API Functions
 */

// ─── Forgot Password ──────────────────────────────────────────────────────────

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

// ─── Verify OTP ───────────────────────────────────────────────────────────────

export interface VerifyOtpPayload {
  email: string;
  token: string; // 6-digit OTP
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  verified: boolean;
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// ─── API Object ───────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * Request a 6-digit OTP reset token sent to the provided email.
   * POST /forgot-password
   */
  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiRequest.post<ForgotPasswordResponse>("/forgot-password", payload),

  /**
   * Verify the 6-digit OTP (expires in 5 minutes).
   * POST /verify-otp
   */
  verifyOtp: (payload: VerifyOtpPayload) =>
    apiRequest.post<VerifyOtpResponse>("/verify-otp", payload),

  /**
   * Reset the password using a verified OTP token (expires in 60 minutes).
   * POST /reset-password
   */
  resetPassword: (payload: ResetPasswordPayload) =>
    apiRequest.post<ResetPasswordResponse>("/reset-password", payload),
};
