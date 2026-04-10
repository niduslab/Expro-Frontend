/**
 * Change Password API
 * Interfaces with the /change-password endpoint
 */

import { apiRequest, ApiResponse } from "../../axios";

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Change the authenticated user's password.
 *
 * @param payload - current_password, password, password_confirmation
 * @returns ApiResponse with success status and message
 */
export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<ApiResponse<ChangePasswordResponse>> => {
  const response = await apiRequest.post<ChangePasswordResponse>(
    "/change-password",
    payload,
  );
  return response.data;
};
