import { useState } from "react";
import {
  changePassword,
  ChangePasswordPayload,
} from "@/lib/api/functions/admin/changePasswordApi";

/**
 * Field-level validation errors returned by the Laravel backend
 * e.g. { current_password: ["The current password is incorrect."] }
 */
export type ChangePasswordFieldErrors = Partial<
  Record<keyof ChangePasswordPayload, string[]>
>;

export interface UseChangePasswordState {
  isLoading: boolean;
  isSuccess: boolean;
  successMessage: string | null;
  error: string | null;
  fieldErrors: ChangePasswordFieldErrors;
}

export interface UseChangePasswordReturn extends UseChangePasswordState {
  mutate: (payload: ChangePasswordPayload) => Promise<void>;
  reset: () => void;
}

const initialState: UseChangePasswordState = {
  isLoading: false,
  isSuccess: false,
  successMessage: null,
  error: null,
  fieldErrors: {},
};

/**
 * useChangePassword
 *
 * Custom hook to handle the change-password flow.
 *
 * Usage:
 * ```tsx
 * const { mutate, isLoading, isSuccess, error, fieldErrors, reset } =
 *   useChangePassword();
 *
 * const handleSubmit = async (values: ChangePasswordPayload) => {
 *   await mutate(values);
 * };
 * ```
 */
export const useChangePassword = (): UseChangePasswordReturn => {
  const [state, setState] = useState<UseChangePasswordState>(initialState);

  const mutate = async (payload: ChangePasswordPayload): Promise<void> => {
    setState({ ...initialState, isLoading: true });

    try {
      const response = await changePassword(payload);

      if (response.success) {
        setState({
          ...initialState,
          isSuccess: true,
          successMessage: response.message ?? "Password changed successfully.",
        });
      } else {
        // Backend returned success: false (shouldn't normally happen with a 2xx,
        // but handle defensively)
        setState({
          ...initialState,
          error: response.message ?? "Failed to change password.",
        });
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const responseData = err?.response?.data;

      if (status === 422) {
        // Validation error - may include field-level errors
        setState({
          ...initialState,
          error: responseData?.message ?? "Validation failed.",
          fieldErrors: responseData?.errors ?? {},
        });
      } else if (status === 429) {
        setState({
          ...initialState,
          error:
            err?.message ??
            "Too many requests. Please wait a moment and try again.",
        });
      } else if (status === 401) {
        setState({
          ...initialState,
          error: "Session expired. Please log in again.",
        });
      } else {
        setState({
          ...initialState,
          error:
            responseData?.message ??
            err?.message ??
            "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  const reset = () => setState(initialState);

  return { ...state, mutate, reset };
};
