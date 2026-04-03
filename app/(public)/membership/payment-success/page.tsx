"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Home, FileText, Copy, Check } from "lucide-react";
import { useState } from "react";

function MembershipPaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const applicationNumber = searchParams.get("application_number");
  const paymentId = searchParams.get("payment_id");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.removeItem("membership_form_data");
    localStorage.removeItem("membership_max_step");
    localStorage.removeItem("payment_id");
    localStorage.removeItem("application_id");
    localStorage.removeItem("pending_payment_id");
    localStorage.removeItem("payment_completed");
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 py-32">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 rounded-full p-6 animate-bounce">
              <CheckCircle className="w-20 h-20 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Thank you for completing your payment. Your membership application
            has been submitted successfully.
          </p>

          {applicationNumber && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-lg">
                  Application Number
                </h3>
                <button
                  onClick={() => copyToClipboard(applicationNumber)}
                  className="text-[#008543] hover:text-[#006C36] transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              <p className="text-2xl font-bold text-[#008543] font-mono">
                {applicationNumber}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Please save this number for future reference
              </p>
            </div>
          )}

          {paymentId && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment ID:</span>
                <span className="text-sm font-mono font-semibold text-gray-900">
                  #{paymentId}
                </span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <FileText size={20} />
              What's Next?
            </h3>
            <ul className="space-y-3 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2 mt-1">✓</span>
                <span>Your payment has been confirmed and recorded</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">✓</span>
                <span>Your application is now under review by our team</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">📧</span>
                <span>
                  You will receive a confirmation email within 24 hours
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">⏱️</span>
                <span>
                  Application review typically takes 2-3 business days
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">🎫</span>
                <span>Your membership ID will be sent once approved</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Please check your email (including
              spam folder) for payment receipt and application confirmation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#008543] text-white rounded-lg font-medium hover:bg-[#006C36] transition-colors shadow-md"
            >
              <Home size={20} />
              Back to Home
            </button>

            <button
              onClick={() => router.push("/contact")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <FileText size={20} />
              Contact Support
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              Need help or have questions?
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

export default function MembershipPaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008543]" />
        </div>
      }
    >
      <MembershipPaymentSuccessContent />
    </Suspense>
  );
}
