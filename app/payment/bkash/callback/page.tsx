"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { bkashService } from "@/lib/services/bkash.service";

function BkashCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "failed">(
    "processing",
  );
  const [message, setMessage] = useState("Processing your payment...");

  useEffect(() => {
    handleCallback();
  }, [searchParams]);

  const handleCallback = async () => {
    try {
      const callbackStatus = searchParams.get("status");
      const paymentId = localStorage.getItem("payment_id");

      if (!paymentId) {
        setStatus("failed");
        setMessage("Payment information not found");
        return;
      }

      if (callbackStatus === "success") {
        const response = await bkashService.confirmPaymentSuccess({
          payment_id: parseInt(paymentId),
          gateway_transaction_id:
            searchParams.get("transactionId") || undefined,
        });

        if (response.success) {
          setStatus("success");
          setMessage("Payment completed successfully!");

          localStorage.removeItem("payment_id");
          localStorage.removeItem("application_id");
          localStorage.removeItem("pending_payment_id");
          localStorage.setItem("payment_completed", "true");

          setTimeout(() => {
            router.push("/membership/success?payment=success");
          }, 2000);
        } else {
          setStatus("failed");
          setMessage(response.message || "Payment verification failed");
        }
      } else {
        await bkashService.reportPaymentFailure({
          payment_id: parseInt(paymentId),
          failure_reason:
            searchParams.get("reason") || "Payment cancelled by user",
        });

        setStatus("failed");
        setMessage("Payment was cancelled or failed");

        setTimeout(() => {
          const applicationId = localStorage.getItem("application_id");
          if (applicationId) {
            router.push(
              `/membership/payment-retry?application_id=${applicationId}`,
            );
          } else {
            router.push("/membership?payment=failed");
          }
        }, 3000);
      }
    } catch (error: any) {
      console.error("Callback error:", error);
      setStatus("failed");
      setMessage(
        error.response?.data?.message ||
          "An error occurred while processing payment",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {status === "processing" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-green-600 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500 mt-4">
              Redirecting to success page...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-red-600 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => {
                const applicationId = localStorage.getItem("application_id");
                if (applicationId) {
                  router.push(
                    `/membership/payment-retry?application_id=${applicationId}`,
                  );
                } else {
                  router.push("/membership");
                }
              }}
              className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function BkashCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      }
    >
      <BkashCallbackContent />
    </Suspense>
  );
}
