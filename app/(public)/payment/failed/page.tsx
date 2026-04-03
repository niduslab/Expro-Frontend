"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, RefreshCw, Home, AlertTriangle } from "lucide-react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reason = searchParams.get("reason");
  const paymentId = searchParams.get("payment_id");
  const applicationNumber = searchParams.get("application_number");

  const getErrorMessage = (reason: string | null) => {
    switch (reason) {
      case "execution_failed":
        return "Payment execution failed. The transaction could not be completed.";
      case "payment_not_found":
        return "Payment record not found. Please contact support.";
      case "invalid_callback":
        return "Invalid payment callback received.";
      case "payment_failed":
        return "Payment failed. Please try again.";
      default:
        return "Payment could not be completed. Please try again.";
    }
  };

  const handleRetry = () => {
    if (applicationNumber) {
      router.push(
        `/membership/payment-retry?application_number=${applicationNumber}`,
      );
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4 py-32">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-red-100 rounded-full p-6">
              <XCircle className="w-20 h-20 text-red-600" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            {getErrorMessage(reason)}
          </p>

          {(paymentId || applicationNumber) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">
                Payment Details
              </h3>
              <div className="space-y-2 text-sm">
                {paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono font-semibold text-gray-900">
                      #{paymentId}
                    </span>
                  </div>
                )}
                {applicationNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application Number:</span>
                    <span className="font-mono font-semibold text-gray-900">
                      {applicationNumber}
                    </span>
                  </div>
                )}
                {reason && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reason:</span>
                    <span className="font-semibold text-red-600">
                      {reason.replace(/_/g, " ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <AlertTriangle size={20} />
              What You Can Do
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Check your internet connection and try again</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Ensure you have sufficient balance in your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Try using a different payment method</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Contact your bank if the issue persists</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {applicationNumber && (
              <button
                onClick={handleRetry}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#008543] text-white rounded-lg font-medium hover:bg-[#006C36] transition-colors shadow-md"
              >
                <RefreshCw size={20} />
                Retry Payment
              </button>
            )}
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Home size={20} />
              Back to Home
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              Need help? Our support team is here to assist you.
            </p>
            <p className="text-sm text-gray-600">
              Email:{" "}
              <a
                href="mailto:support@exprowelfare.org"
                className="text-[#008543] hover:underline font-medium"
              >
                support@exprowelfare.org
              </a>
            </p>
            <p className="text-sm text-gray-600">
              Phone:{" "}
              <a
                href="tel:+8801234567890"
                className="text-[#008543] hover:underline font-medium"
              >
                +880 1234-567890
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}
