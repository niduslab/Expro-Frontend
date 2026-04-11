"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useChangePassword } from "@/lib/hooks/admin/useChangePassword";
import { useAuth } from "@/lib";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getStrength(password: string): {
  score: number;
  label: string;
  color: string;
  bg: string;
} {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  if (score === 0) return { score, label: "", color: "#E5E7EB", bg: "#E5E7EB" };
  if (score === 1)
    return { score, label: "Weak", color: "#EF4444", bg: "#FEF2F2" };
  if (score === 2)
    return { score, label: "Fair", color: "#F59E0B", bg: "#FFFBEB" };
  if (score === 3)
    return { score, label: "Good", color: "#3B82F6", bg: "#EFF6FF" };
  return { score, label: "Strong", color: "#068847", bg: "#F0FDF4" };
}

// ─────────────────────────────────────────────
// PasswordInput
// ─────────────────────────────────────────────
function PasswordInput({
  id,
  placeholder,
  value,
  onChange,
  error,
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <div className="relative flex items-center">
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-[44px] border border-slate-300 rounded-lg px-4 pr-10 text-[14px] text-[#111827] bg-white outline-none transition-all
            focus:ring-[3px] focus:ring-[#068847]/40 focus:border-[#068847]
            ${error ? "border-red-400" : "border-[#D1D5DB]"}`}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className={`absolute right-3 transition-colors ${show ? "text-[#068847]" : "text-[#9CA3AF]"}`}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// RequirementItem
// ─────────────────────────────────────────────
function RequirementItem({ label, met }: { label: string; met: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 text-[12px] ${met ? "text-[#374151]" : "text-[#6B7280]"}`}
    >
      {met ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-[#068847] flex-shrink-0" />
      ) : (
        <Circle className="h-3.5 w-3.5 text-[#D1D5DB] flex-shrink-0" />
      )}
      {label}
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function ChangePasswordPage() {
  const router = useRouter();

  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(
    null,
  );

  const {
    mutate,
    isLoading,
    isSuccess,
    successMessage,
    error: apiError,
    fieldErrors,
  } = useChangePassword();

  const strength = getStrength(newPass);

  const requirements = [
    { label: "At least 8 characters", met: newPass.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(newPass) },
    { label: "One number", met: /[0-9]/.test(newPass) },
    {
      label: "One special character (!@#$...)",
      met: /[^A-Za-z0-9]/.test(newPass),
    },
  ];

  const allReqsMet = requirements.every((r) => r.met);
  const passwordsMatch = newPass === confirm && confirm.length > 0;
  const canSave = current.length > 0 && allReqsMet && passwordsMatch;

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!current) e.current = "Current password is required";
    if (!newPass) e.newPass = "New password is required";
    else if (!allReqsMet) e.newPass = "Password does not meet requirements";
    if (!confirm) e.confirm = "Please confirm your new password";
    else if (newPass !== confirm) e.confirm = "Passwords do not match";
    setLocalErrors(e);
    return Object.keys(e).length === 0;
  }
  const { logout } = useAuth();
  // Start a 3-second countdown then redirect to /login
  function startRedirect() {
    logout();
    let count = 3;
    setRedirectCountdown(count);
    const interval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(interval);
        router.push("/login");
      } else {
        setRedirectCountdown(count);
      }
    }, 1000);
  }

  async function handleSubmit() {
    if (!validate()) return;

    await mutate({
      current_password: current,
      password: newPass,
      password_confirmation: confirm,
    });

    // If hook reports success, clear fields and start redirect
    // We check via the returned isSuccess in the render — but since mutate
    // is async and state updates are async, we handle redirect in a useEffect-like
    // pattern by checking success after the call via the hook's own state.
    // Instead, we trigger the redirect here using a post-mutate check trick:
  }

  // Watch for isSuccess to trigger redirect countdown
  // We do this declaratively so it also works if success state is set
  const [hasStartedRedirect, setHasStartedRedirect] = useState(false);
  if (isSuccess && !hasStartedRedirect) {
    setHasStartedRedirect(true);
    setCurrent("");
    setNewPass("");
    setConfirm("");
    setLocalErrors({});
    startRedirect();
  }

  // Merge API field errors into local display
  const currentError =
    localErrors.current ||
    fieldErrors.current_password?.[0] ||
    (apiError && apiError.toLowerCase().includes("current")
      ? apiError
      : undefined);

  const newPassError = localErrors.newPass || fieldErrors.password?.[0];

  const confirmError =
    localErrors.confirm || fieldErrors.password_confirmation?.[0];

  return (
    <div className="min-h-screen font-['DM_Sans',sans-serif]">
      <div className="bg-white border-b border-[#e8e6e0] max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 py-2 text-[12px] text-[#9CA3AF]">
          <Link
            href="/settings"
            className="hover:text-[#068847] transition-colors"
          >
            Settings
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#374151]">Change password</span>
        </div>

        {/* Back button */}
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 mb-3 text-[13px] text-[#6B7280] hover:text-[#068847] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to settings
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
              <Lock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-gray-900 leading-snug">
                Change password
              </h1>
              <p className="text-[13px] text-gray-400 mt-0.5">
                Secure your password carefully.
              </p>
            </div>
          </div>
        </div>

        {/* Success banner */}
        {isSuccess && (
          <div className="flex items-start gap-3 px-4 py-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-[13px] text-[#15803D]">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">
                {successMessage ?? "Password updated successfully!"}
              </p>
              <p className="text-[12px] mt-0.5 text-[#16A34A]">
                Redirecting you to login in{" "}
                <span className="font-bold">{redirectCountdown}</span> second
                {redirectCountdown !== 1 ? "s" : ""}…
              </p>
            </div>
          </div>
        )}

        {/* Generic API error banner (non-field-level) */}
        {apiError && !isSuccess && (
          <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-600">
            <Lock className="h-4 w-4 flex-shrink-0" />
            {apiError}
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <p className="text-[16px] font-semibold text-[#111827] mb-1">
            Update your password
          </p>
          <p className="text-[12px] text-[#6B7280] mb-5">
            Choose a strong password with at least 8 characters.
          </p>

          {/* Current password */}
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-[13px] font-semibold text-[#111827]">
              Current password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              id="current"
              placeholder="Enter current password"
              value={current}
              onChange={(v) => {
                setCurrent(v);
                if (localErrors.current)
                  setLocalErrors((e) => ({ ...e, current: "" }));
              }}
              error={currentError}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-[#F3F4F6] my-5" />

          {/* New password */}
          <div className="flex flex-col gap-1 mb-2">
            <label className="text-[13px] font-semibold text-[#111827]">
              New password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              id="new-pass"
              placeholder="Enter new password"
              value={newPass}
              onChange={(v) => {
                setNewPass(v);
                if (localErrors.newPass)
                  setLocalErrors((e) => ({ ...e, newPass: "" }));
              }}
              error={newPassError}
            />
          </div>

          {/* Strength bar */}
          {newPass.length > 0 && (
            <div className="mb-4">
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-[3px] flex-1 rounded-full transition-all duration-300"
                    style={{
                      background:
                        i <= strength.score ? strength.color : "#E5E7EB",
                    }}
                  />
                ))}
              </div>
              {strength.label && (
                <p
                  className="text-[11px] mt-1 font-medium"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </p>
              )}
            </div>
          )}

          {/* Confirm password */}
          <div className="flex flex-col gap-1 mb-5">
            <label className="text-[13px] font-semibold text-[#111827]">
              Confirm new password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              id="confirm"
              placeholder="Re-enter new password"
              value={confirm}
              onChange={(v) => {
                setConfirm(v);
                if (localErrors.confirm)
                  setLocalErrors((e) => ({ ...e, confirm: "" }));
              }}
              error={confirmError}
            />
            {confirm.length > 0 && !confirmError && (
              <p
                className={`text-[12px] ${
                  passwordsMatch ? "text-[#068847]" : "text-red-500"
                }`}
              >
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
          </div>

          {/* Requirements */}
          <div className="bg-[#F9FAFB] rounded-[10px] p-4 flex flex-col gap-2 mb-6">
            {requirements.map((r) => (
              <RequirementItem key={r.label} label={r.label} met={r.met} />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F3F4F6]">
            <Link
              href="/settings"
              className="h-[40px] px-4 py-3 rounded-lg border border-[#E5E7EB] text-[13px] text-[#6B7280] bg-white hover:bg-[#F9FAFB] transition-colors flex items-center"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={!canSave || isLoading || isSuccess}
              className="h-[40px] px-5 py-3 rounded-lg bg-[#068847] text-white text-[13px] font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#057a3e] transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  Update password
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
