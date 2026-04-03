"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Home, FileText } from "lucide-react";

function MembershipSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentStatus = searchParams.get("payment");

  useEffect(() => {
    localStorage.removeItem("membership_form_data");
    localStorage.removeItem("membership_max_step");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 py-32">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircle className="w-20 h-20 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {paymentStatus === "success"
              ? "Payment Successful!"
              : "Application Submitted!"}
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            {paymentStatus === "success"
              ? "Thank you for completing your payment. Your membership application has been submitted successfully."
              : "Your membership application has been submitted. Please complete the payment to activate your membership."}
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Our team will review your application within 2-3 business days
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You will receive a confirmation email once approved</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Your membership ID will be sent to your registered email
                </span>
              </li>
              {paymentStatus !== "success" && (
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span className="font-semibold">
                    Please complete your payment to activate your membership
                  </span>
                </li>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#008543] text-white rounded-lg font-medium hover:bg-[#006C36] transition-colors"
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
            <p className="text-sm text-gray-500">
              Need help? Contact us at{" "}
              <a
                href="mailto:support@exprowelfare.org"
                className="text-[#008543] hover:underline"
              >
                support@exprowelfare.org
              </a>{" "}
              or call{" "}
              <a
                href="tel:+8801234567890"
                className="text-[#008543] hover:underline"
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

export default function MembershipSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008543]" />
        </div>
      }
    >
      <MembershipSuccessContent />
    </Suspense>
  );
}
