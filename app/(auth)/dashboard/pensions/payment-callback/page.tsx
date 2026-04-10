"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { usePensionPayment } from "@/lib/hooks/user/usePensionPayment";

export default function PensionPaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "failed">(
    "processing"
  );

  const { completePayment, reportPaymentFailure } = usePensionPayment({
    onSuccess: () => {
      setStatus("success");
      setTimeout(() => {
        router.push("/dashboard/pensions?payment=success");
      }, 3000);
    },
    onError: () => {
      setStatus("failed");
    },
  });

  useEffect(() => {
    const processCallback = async () => {
      // Get payment details from URL params
      const paymentID = searchParams.get("paymentID");
      const bkashStatus = searchParams.get("status");

      // Get stored payment ID
      const storedPaymentId = localStorage.getItem(
        "pending_pension_payment_id"
      );

      if (!storedPaymentId) {
        console.error("No pending payment ID found");
        setStatus("failed");
        return;
      }

      const paymentId = parseInt(storedPaymentId);

      // Check if payment was successful
      if (bkashStatus === "success" && paymentID) {
        try {
          await completePayment(paymentId, paymentID);
        } catch (error) {
          console.error("Payment completion error:", error);
          setStatus("failed");
        }
      } else {
        // Payment failed or cancelled
        try {
          await reportPaymentFailure(paymentId);
        } catch (error) {
          console.error("Payment failure report error:", error);
        }
        setStatus("failed");
      }
    };

    processCallback();
  }, [searchParams, completePayment, reportPaymentFailure]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {status === "processing" && (
          <>
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-[#030712] mb-3">
              Processing Payment
            </h1>
            <p className="text-[14px] text-[#6B7280] mb-6">
              Please wait while we confirm your payment...
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
              <div
                className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#030712] mb-3">
              Payment Successful!
            </h1>
            <p className="text-[14px] text-[#6B7280] mb-6">
              Your pension installment payment has been completed successfully.
              You will be redirected shortly...
            </p>
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <p className="text-[14px] text-emerald-800">
                Your installments have been updated and commission processing
                has been initiated.
              </p>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#030712] mb-3">
              Payment Failed
            </h1>
            <p className="text-[14px] text-[#6B7280] mb-6">
              Your payment could not be completed. Please try again or contact
              support if the issue persists.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/dashboard/pensions")}
                className="w-full px-6 py-3 rounded-xl text-[14px] font-semibold bg-[#068847] hover:bg-[#057a3d] text-white transition-colors"
              >
                Return to Pensions
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full px-6 py-3 rounded-xl text-[14px] font-medium text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
