"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  LogIn,
  Send,
} from "lucide-react";
import { useForgotPassword } from "@/lib/hooks/public/useForgotpassword";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const emailValue = watch("email");

  const { mutate: forgotPassword, isPending } = useForgotPassword({
    onSuccess: (res) => {
      toast.success("OTP sent", {
        description: res.message ?? `Check your inbox at ${emailValue}`,
        duration: 5000,
      });
      setSubmittedEmail(emailValue);
      setIsSubmitted(true);
    },
    onError: (err) => {
      toast.error("Failed to send OTP", {
        description:
          err.response?.data?.message ??
          "Something went wrong. Please try again.",
        duration: 5000,
      });
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPassword({ email: data.email });
  };

  const handleContinue = () => {
    router.push(`/verify-otp?email=${encodeURIComponent(submittedEmail)}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center p-4 px-6 md:px-12 lg:px-20 xl:px-40 2xl:px-">
      <div className="w-full max-w-[400px] bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        {/* Top Gradient Bar */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#068847] via-[#34d399] to-[#059669]" />

        {!isSubmitted ? (
          <div className="px-6 pt-6 pb-6 flex flex-col gap-5">
            {/* Icon + Title */}
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#A7F3D0] flex items-center justify-center flex-shrink-0">
                <Mail size={18} strokeWidth={1.8} color="#068847" />
              </div>
              <div>
                <h1 className="text-[1.05rem] font-bold text-gray-900 leading-snug m-0">
                  Forgot password?
                </h1>
                <p className="text-[12px] text-gray-400 mt-1 m-0 leading-relaxed">
                  Enter your registered email to get an OTP.
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-[0.8rem] font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="relative flex items-center">
                  <span
                    className={`absolute left-3 flex items-center pointer-events-none transition-colors ${
                      errors.email ? "text-red-400" : "text-gray-400"
                    }`}
                  >
                    <Mail size={14} strokeWidth={1.8} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@yourcompany.com"
                    disabled={isPending}
                    {...register("email")}
                    className={`w-full pl-9 pr-4 py-[10px] rounded-lg text-[0.8rem] text-gray-800 placeholder-gray-300 bg-[#F9FAFB] outline-none transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.email
                        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-[#E5E7EB] focus:border-[#068847] focus:ring-2 focus:ring-[#F0FDF4] focus:bg-white"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p
                    role="alert"
                    className="flex items-center gap-1 text-xs text-red-500 m-0"
                  >
                    <AlertCircle size={11} strokeWidth={2} />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex items-center justify-center gap-2 w-full py-[0.65rem] px-5 rounded-lg text-[0.825rem] font-semibold text-white border-none cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:opacity-90 active:enabled:scale-[0.99]"
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
                    <span className="py-4">Sending OTP…</span>
                  </>
                ) : (
                  <>
                    <Send size={13} strokeWidth={2} />
                    <span className="py-4">Send OTP</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-4 px-6 py-8">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] border border-[#A7F3D0] flex items-center justify-center">
              <CheckCircle2 size={24} strokeWidth={1.6} color="#068847" />
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-[1.05rem] font-bold text-gray-900 leading-snug m-0">
                OTP sent!
              </h1>
              <p className="text-[12px] text-gray-400 m-0">
                We've sent a 6-digit code to
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#A7F3D0] rounded-lg px-4 py-5 w-full justify-center">
              <Mail size={15} strokeWidth={2} color="#068847" />
              <p className="text-[0.825rem] font-semibold text-[#068847] m-0 break-all">
                {submittedEmail}
              </p>
            </div>

            <p className="text-[11px] text-gray-400 m-0 leading-relaxed">
              Expires in{" "}
              <strong className="text-gray-600 font-semibold">5 minutes</strong>
              . Check spam if needed.
            </p>

            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                onClick={handleContinue}
                className="flex items-center justify-center gap-2 w-full py-4 px-5 rounded-lg text-[0.825rem] font-semibold text-white border-none cursor-pointer transition-all hover:opacity-90 active:scale-[0.99]"
                style={{
                  background:
                    "linear-gradient(135deg, #068847 0%, #059669 100%)",
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(6,136,71,0.25)",
                }}
              >
                Enter OTP
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setSubmittedEmail("");
                }}
                className="flex items-center justify-center gap-2 w-full py-[4px] px-5 rounded-lg text-[0.8rem] font-medium text-gray-600 hover:text-gray-800 border border-[#E5E7EB] hover:border-gray-300 cursor-pointer transition-all bg-[#F9FAFB] hover:bg-gray-50"
              >
                <RotateCcw size={13} strokeWidth={2} />
                Use a different email
              </button>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="flex items-center justify-center gap-2 w-full py-[4px] px-5 rounded-lg text-[0.8rem] font-medium text-gray-500 hover:text-gray-700 border-none bg-transparent cursor-pointer transition-all"
              >
                <LogIn size={13} strokeWidth={2} />
                Back to sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
