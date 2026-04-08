"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ShieldCheck,
  Loader2,
  AlertCircle,
  RotateCcw,
  Mail,
} from "lucide-react";
import {
  useVerifyOtp,
  useForgotPassword,
} from "@/lib/hooks/public/useForgotpassword";

const OTP_LENGTH = 6;

// ─── OTP Content ──────────────────────────────────────────────────────────────
function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const { mutate: verifyOtp, isPending } = useVerifyOtp({
    onSuccess: (res) => {
      if (res.data?.verified) {
        toast.success("OTP verified", {
          description: "You can now reset your password.",
          duration: 3000,
        });
        router.push(
          `/reset-password?email=${encodeURIComponent(email)}&token=${otp.join("")}`,
        );
      } else {
        setError("Verification failed. Please try again.");
      }
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message ?? "Invalid or expired OTP. Try again.";
      setError(msg);
      toast.error("Verification failed", { description: msg, duration: 5000 });
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    },
  });

  const { mutate: resendOtp, isPending: isResending } = useForgotPassword({
    onSuccess: (res) => {
      toast.success("OTP resent", {
        description: res.message ?? "Check your inbox.",
        duration: 5000,
      });
      setOtp(Array(OTP_LENGTH).fill(""));
      setError(null);
      setResendCooldown(60);
      inputRefs.current[0]?.focus();
    },
    onError: (err) => {
      toast.error("Failed to resend OTP", {
        description: err.response?.data?.message ?? "Please try again.",
        duration: 5000,
      });
    },
  });

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setError(null);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    if (digit && index === OTP_LENGTH - 1) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === OTP_LENGTH) verifyOtp({ email, token: fullOtp });
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    setError(null);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
    if (pasted.length === OTP_LENGTH) verifyOtp({ email, token: pasted });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("");
    if (token.length < OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }
    verifyOtp({ email, token });
  };

  const isComplete = otp.every(Boolean);

  // ─── Missing email fallback ──────────────────────────────────────────────
  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F5F0] to-white flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 text-center max-w-sm w-full">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} strokeWidth={1.6} className="text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Missing email
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Please start the password reset flow from the beginning.
          </p>
          <button
            onClick={() => router.push("/forgetPassword")}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#068847] to-[#059669] hover:opacity-95 transition-opacity shadow-sm"
          >
            Go to Forgot Password
          </button>
        </div>
      </div>
    );
  }

  // ─── Main UI ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F0] to-white flex flex-col items-center justify-center px-4 py-6 sm:py-10 pt-32">
      <div className="w-full max-w-[400px] bg-white rounded-2xl border border-[#E5E7EB] shadow-lg overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#068847] via-[#34d399] to-[#059669]" />

        <div className="px-5 sm:px-7 pt-6 pb-7 flex flex-col gap-5">
          {/* Back button */}
          <button
            type="button"
            onClick={() => router.push("/forgotPassword")}
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors w-fit bg-transparent border-none cursor-pointer p-0 -ml-1"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            <span>Back</span>
          </button>

          {/* Header */}
          <div className="flex flex-col gap-3 text-center sm:text-left sm:items-start">
            <div className="py-3 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#F0FDF4] border border-[#A7F3D0] flex items-center justify-center mx-auto sm:mx-0 flex-shrink-0">
                <ShieldCheck size={20} strokeWidth={1.8} color="#068847" />
              </div>
              <h1 className="text-lg sm:text-[1.1rem] font-bold text-gray-900 leading-tight m-0">
                Verify your code
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 m-0 leading-relaxed">
                Enter the 6-digit code sent to
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                <Mail size={13} className="text-[#068847]" />
                <span className="text-xs sm:text-sm font-medium text-[#068847] truncate max-w-[200px] sm:max-w-none">
                  Email: {email}
                </span>
              </div>
            </div>
          </div>

          {/* OTP Inputs - Redesigned */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2.5">
              <div
                className="flex justify-between gap-2 sm:gap-3"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    disabled={isPending}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    aria-label={`Digit ${index + 1}`}
                    className={`
                      w-full h-12 sm:h-14 
                      text-center text-2xl sm:text-3xl font-semibold 
                      rounded-2xl border-2 outline-none 
                      transition-all duration-200 
                      bg-white
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        error
                          ? "border-red-300 bg-red-50 text-red-600 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                          : digit
                            ? "border-[#068847] bg-[#F0FDF4] text-[#068847] shadow-sm"
                            : "border-[#E5E7EB] text-gray-800 focus:border-[#068847] focus:ring-4 focus:ring-[#F0FDF4] hover:border-[#D1D5DB]"
                      }
                    `}
                  />
                ))}
              </div>

              {/* Helper / Error message */}
              {error ? (
                <p
                  role="alert"
                  className="flex items-center justify-center gap-1.5 text-xs text-red-500 font-medium animate-pulse"
                >
                  <AlertCircle size={12} strokeWidth={2} />
                  {error}
                </p>
              ) : (
                <p className="text-[11px] sm:text-xs text-gray-400 text-center">
                  Paste or type — auto-submits on last digit
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isPending || !isComplete}
              className="
                flex items-center justify-center gap-2 
                w-full py-3 sm:py-3.5 px-5 
                rounded-xl text-sm sm:text-[0.875rem] font-semibold 
                text-white border-none cursor-pointer 
                transition-all duration-150
                disabled:opacity-60 disabled:cursor-not-allowed 
                hover:enabled:opacity-95 active:enabled:scale-[0.99]
                shadow-md hover:shadow-lg
              "
              style={{
                background: "linear-gradient(135deg, #068847 0%, #059669 100%)",
                boxShadow:
                  "0 2px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(6,136,71,0.2)",
              }}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} strokeWidth={2} className="animate-spin" />
                  <span>Verifying…</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} strokeWidth={2} />
                  <span>Verify code</span>
                </>
              )}
            </button>
          </form>

          {/* Resend Section */}
          <div className="flex flex-col items-center gap-3 pt-4 pb-12 border-t border-[#F3F4F6]">
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <span className="text-xs text-gray-500">
                Didn't receive the code?
              </span>
              {resendCooldown > 0 ? (
                <span className="text-xs font-medium text-gray-400">
                  Resend in{" "}
                  <span className="text-[#068847] font-semibold">
                    {resendCooldown}s
                  </span>
                </span>
              ) : (
                <button
                  type="button"
                  disabled={isResending}
                  onClick={() => {
                    resendOtp({ email });
                  }}
                  className="
                    inline-flex items-center gap-1 
                    text-xs font-medium 
                    text-[#068847] hover:text-[#057a3e] 
                    bg-transparent border-none cursor-pointer p-0 
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-colors
                  "
                >
                  {isResending ? (
                    <Loader2
                      size={12}
                      strokeWidth={2}
                      className="animate-spin"
                    />
                  ) : (
                    <RotateCcw size={12} strokeWidth={2} />
                  )}
                  <span>Resend code</span>
                </button>
              )}
            </div>

            {/* Security note */}
            <p className="text-[10px] text-gray-400 text-center max-w-[280px]">
              Code expires in{" "}
              <strong className="text-gray-500">5 minutes</strong>. Check
              spam/junk folder if needed.
            </p>
            <p className="mt-6 text-xs text-gray-400 text-center sm:hidden">
              Having trouble?{" "}
              <button
                onClick={() => router.push("/support")}
                className="text-[#068847] hover:underline font-medium"
              >
                Get help
              </button>
            </p>
          </div>
          {/* Optional: Footer hint for very small screens */}
        </div>
      </div>
    </div>
  );
}

// ─── Page Wrapper with Suspense ─────────────────────────────────────────────
export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
