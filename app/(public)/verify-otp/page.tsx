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

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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

  if (!email) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center max-w-sm w-full">
          <AlertCircle
            size={28}
            strokeWidth={1.6}
            className="mx-auto mb-3 text-red-400"
          />
          <p className="text-gray-700 font-medium mb-1 text-sm">
            Missing email
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
      <div className="w-full max-w-[360px] bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="h-[3px] w-full bg-gradient-to-r from-[#068847] via-[#34d399] to-[#059669]" />

        <div className="px-6 pt-6 pb-6 flex flex-col gap-5">
          {/* Back */}
          <button
            type="button"
            onClick={() => router.push("/forgetPassword")}
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-[0.8rem] font-medium transition-colors w-fit bg-transparent border-none cursor-pointer p-0"
          >
            <ArrowLeft size={13} strokeWidth={2} />
            Back
          </button>

          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#A7F3D0] flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={18} strokeWidth={1.8} color="#068847" />
            </div>
            <div>
              <h1 className="text-[1.05rem] font-bold text-gray-900 leading-snug m-0">
                Verify code
              </h1>
              <p className="text-[12px] text-gray-400 mt-1 m-0 leading-relaxed">
                6-digit OTP sent to your email. Expires in 5 min.
              </p>
            </div>
          </div>

          {/* OTP Inputs */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 justify-between" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    disabled={isPending}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-[46px] h-[52px] text-center text-[1.25rem] font-bold rounded-xl border-2 outline-none transition-all bg-[#F9FAFB] disabled:opacity-50
                      ${
                        error
                          ? "border-red-300 bg-red-50 text-red-600"
                          : digit
                            ? "border-[#068847] bg-[#F0FDF4] text-[#068847]"
                            : "border-[#E5E7EB] text-gray-800 focus:border-[#068847] focus:bg-white focus:ring-2 focus:ring-[#F0FDF4]"
                      }`}
                  />
                ))}
              </div>

              {error ? (
                <p
                  role="alert"
                  className="flex items-center justify-center gap-1 text-xs text-red-500 m-0"
                >
                  <AlertCircle size={11} strokeWidth={2} />
                  {error}
                </p>
              ) : (
                <p className="text-[11px] text-gray-400 text-center m-0">
                  Paste or type — auto-submits on last digit
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending || !isComplete}
              className="flex items-center justify-center gap-2 w-full py-[0.65rem] px-5 rounded-lg text-[0.825rem] font-semibold text-white border-none cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:opacity-90 active:enabled:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, #068847 0%, #059669 100%)",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(6,136,71,0.25)",
              }}
            >
              {isPending ? (
                <>
                  <Loader2 size={14} strokeWidth={2} className="animate-spin" />
                  Verifying…
                </>
              ) : (
                "Verify code"
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="flex items-center justify-center gap-1.5">
            <p className="text-[0.775rem] text-gray-400 m-0">Didn't get it?</p>
            {resendCooldown > 0 ? (
              <span className="text-[0.775rem] text-gray-400">
                Resend in{" "}
                <span className="font-semibold text-gray-600">
                  {resendCooldown}s
                </span>
              </span>
            ) : (
              <button
                type="button"
                disabled={isResending}
                onClick={() => resendOtp({ email })}
                className="inline-flex items-center gap-1 text-[0.775rem] font-medium text-[#068847] hover:text-[#057a3e] bg-transparent border-none cursor-pointer p-0 disabled:opacity-60"
              >
                {isResending ? (
                  <Loader2 size={11} strokeWidth={2} className="animate-spin" />
                ) : (
                  <RotateCcw size={11} strokeWidth={2} />
                )}
                Resend code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpContent />
    </Suspense>
  );
}
