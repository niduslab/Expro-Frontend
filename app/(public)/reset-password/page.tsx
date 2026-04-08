"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  KeyRound,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  LogIn,
  Check,
  X,
} from "lucide-react";
import { useResetPassword } from "@/lib/hooks/public/useForgotpassword";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const strengthRules = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "Uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Number", test: (v: string) => /[0-9]/.test(v) },
];

// ─── Step Indicator ───────────────────────────────────────────────────────────

// ─── Password Strength ────────────────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const passed = strengthRules.filter((r) => r.test(password)).length;
  const colors = ["#ef4444", "#f59e0b", "#068847"];
  const level = Math.max(0, passed - 1);

  return (
    <div className="flex flex-col gap-1.5 mt-1">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i < passed ? colors[level] : "#E5E7EB" }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        {strengthRules.map((rule) => {
          const ok = rule.test(password);
          return (
            <div key={rule.label} className="flex items-center gap-1.5">
              {ok ? (
                <Check size={10} strokeWidth={2.5} color="#068847" />
              ) : (
                <X size={10} strokeWidth={2.5} color="#9CA3AF" />
              )}
              <span
                className="text-[11px]"
                style={{ color: ok ? "#068847" : "#9CA3AF" }}
              >
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Reset Password Content ───────────────────────────────────────────────────

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", password_confirmation: "" },
  });

  const passwordValue = watch("password");

  const { mutate: resetPassword, isPending } = useResetPassword({
    onSuccess: (res) => {
      toast.success("Password reset!", {
        description:
          res.message ?? "You can now sign in with your new password.",
        duration: 5000,
      });
      setIsSuccess(true);
    },
    onError: (err) => {
      toast.error("Reset failed", {
        description:
          err.response?.data?.message ??
          "Something went wrong. Please try again.",
        duration: 5000,
      });
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPassword({
      email,
      token,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };

  if (!email || !token) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center max-w-sm w-full">
          <AlertCircle
            size={28}
            strokeWidth={1.6}
            className="mx-auto mb-3 text-red-400"
          />
          <p className="text-gray-700 font-medium mb-1 text-sm">
            Invalid reset link
          </p>
          <p className="text-[12px] text-gray-400 mb-4">
            Please start the password reset flow from the beginning.
          </p>
          <button
            onClick={() => router.push("/forgotPassword")}
            className="text-[#068847] hover:text-[#057a3e] text-sm font-medium"
          >
            Go to Forgot Password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-[13px] text-gray-400 font-medium mb-5 tracking-wide uppercase">
        Password reset flow — 3 steps
      </p>

      <div className="w-full max-w-[360px] bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="h-[3px] w-full bg-gradient-to-r from-[#068847] via-[#34d399] to-[#059669]" />

        {!isSuccess ? (
          <div className="px-6 pt-6 pb-6 flex flex-col gap-5">
            {/* Back */}
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-[0.8rem] font-medium transition-colors w-fit bg-transparent border-none cursor-pointer p-0"
            >
              <ArrowLeft size={13} strokeWidth={2} />
              Back
            </button>

            {/* Header */}
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#A7F3D0] flex items-center justify-center flex-shrink-0">
                <KeyRound size={18} strokeWidth={1.8} color="#068847" />
              </div>
              <div>
                <h1 className="text-[1.05rem] font-bold text-gray-900 leading-snug m-0">
                  Set new password
                </h1>
                <p className="text-[12px] text-gray-400 mt-1 m-0 leading-relaxed">
                  Choose a strong password for your account.
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-4"
            >
              {/* New password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-[0.8rem] font-medium text-gray-700"
                >
                  New password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 flex items-center pointer-events-none text-gray-400">
                    <KeyRound size={14} strokeWidth={1.8} />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    disabled={isPending}
                    {...register("password")}
                    className={`w-full pl-9 pr-10 py-[0.6rem] rounded-lg text-[0.8rem] text-gray-800 placeholder-gray-300 bg-[#F9FAFB] outline-none transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.password
                        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-[#E5E7EB] focus:border-[#068847] focus:ring-2 focus:ring-[#F0FDF4] focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 flex items-center text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff size={14} strokeWidth={1.8} />
                    ) : (
                      <Eye size={14} strokeWidth={1.8} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p
                    role="alert"
                    className="flex items-center gap-1 text-xs text-red-500 m-0"
                  >
                    <AlertCircle size={11} strokeWidth={2} />
                    {errors.password.message}
                  </p>
                )}
                <PasswordStrength password={passwordValue} />
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password_confirmation"
                  className="text-[0.8rem] font-medium text-gray-700"
                >
                  Confirm password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 flex items-center pointer-events-none text-gray-400">
                    <KeyRound size={14} strokeWidth={1.8} />
                  </span>
                  <input
                    id="password_confirmation"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    disabled={isPending}
                    {...register("password_confirmation")}
                    className={`w-full pl-9 pr-10 py-[0.6rem] rounded-lg text-[0.8rem] text-gray-800 placeholder-gray-300 bg-[#F9FAFB] outline-none transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.password_confirmation
                        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-[#E5E7EB] focus:border-[#068847] focus:ring-2 focus:ring-[#F0FDF4] focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 flex items-center text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <EyeOff size={14} strokeWidth={1.8} />
                    ) : (
                      <Eye size={14} strokeWidth={1.8} />
                    )}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p
                    role="alert"
                    className="flex items-center gap-1 text-xs text-red-500 m-0"
                  >
                    <AlertCircle size={11} strokeWidth={2} />
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="mt-1 flex items-center justify-center gap-2 w-full py-[0.65rem] px-5 rounded-lg text-[0.825rem] font-semibold text-white border-none cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:opacity-90 active:enabled:scale-[0.99]"
                style={{
                  background:
                    "linear-gradient(135deg, #068847 0%, #059669 100%)",
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(6,136,71,0.25)",
                }}
              >
                {isPending ? (
                  <>
                    <Loader2
                      size={14}
                      strokeWidth={2}
                      className="animate-spin"
                    />
                    Resetting password…
                  </>
                ) : (
                  "Reset password"
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success state */
          <div className="flex flex-col items-center text-center gap-4 px-6 py-8">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] border border-[#A7F3D0] flex items-center justify-center">
              <CheckCircle2 size={24} strokeWidth={1.6} color="#068847" />
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-[1.05rem] font-bold text-gray-900 leading-snug m-0">
                Password reset!
              </h1>
              <p className="text-[12px] text-gray-400 m-0 leading-relaxed">
                Your password has been updated. All previous sessions have been
                signed out.
              </p>
            </div>

            <div className="w-full bg-[#F0FDF4] border border-[#A7F3D0] rounded-lg px-4 py-3 text-left">
              <p className="text-[11px] text-[#068847] font-medium m-0 mb-0.5">
                Security notice
              </p>
              <p className="text-[11px] text-[#059669] m-0 leading-relaxed">
                All your devices have been signed out. You'll need to log in
                again on each device.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="flex items-center justify-center gap-2 w-full py-[0.65rem] px-5 rounded-lg text-[0.825rem] font-semibold text-white border-none cursor-pointer transition-all hover:opacity-90 active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, #068847 0%, #059669 100%)",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(6,136,71,0.25)",
              }}
            >
              <LogIn size={13} strokeWidth={2} />
              Sign in with new password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
