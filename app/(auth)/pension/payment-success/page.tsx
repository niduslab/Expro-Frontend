"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Package, Receipt, ArrowRight } from "lucide-react";
import { usePensionPayment } from "@/lib/hooks/user/usePensionPayment";
import { useMyPensionEnrollments } from "@/lib/hooks/user/usePensionEnrollment";
import { fmtMoney } from "@/app/(auth)/dashboard/pensions/utils";

export default function PensionPaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const enrollmentId = searchParams.get("enrollment_id");
  const paymentId = searchParams.get("payment_id");

  const { completePayment } = usePensionPayment({
    onSuccess: (data) => {
      setPaymentDetails(data);
      setStatus("success");
    },
    onError: () => {
      setStatus("error");
    },
  });

  const { data: enrollmentsRes, refetch: refetchEnrollments } =
    useMyPensionEnrollments();

  useEffect(() => {
    const processPayment = async () => {
      // Get stored payment ID from localStorage (if available)
      const storedPaymentId =
        paymentId || localStorage.getItem("pending_pension_payment_id");

      if (!storedPaymentId) {
        console.error("No payment ID found");
        setStatus("error");
        return;
      }

      try {
        // Get transaction ID from URL if available
        const transactionId = searchParams.get("paymentID") || searchParams.get("trxID");

        // Confirm payment with backend
        await completePayment(parseInt(storedPaymentId), transactionId || undefined);

        // Refetch enrollments to get updated data
        await refetchEnrollments();

        // Clear localStorage
        localStorage.removeItem("pending_pension_payment_id");
        localStorage.removeItem("pending_pension_enrollment_id");
      } catch (error) {
        console.error("Payment confirmation error:", error);
        setStatus("error");
      }
    };

    processPayment();
  }, [searchParams, paymentId, completePayment, refetchEnrollments]);

  const enrollment = enrollmentsRes?.data?.find(
    (e) => e.id === parseInt(enrollmentId || "0")
  );

  const handleContinue = () => {
    router.push("/dashboard/pensions");
  };

  const handleViewDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {status === "processing" && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-[#030712] mb-3">
              Processing Payment
            </h1>
            <p className="text-[14px] text-[#6B7280] mb-6">
              Please wait while we confirm your pension payment...
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
          </div>
        )}

        {status === "success" && (
          <>
            {/* Success Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Payment Successful!
              </h1>
              <p className="text-emerald-50 text-[14px]">
                Your pension installment payment has been completed
              </p>
            </div>

            {/* Payment Details */}
            <div className="p-8 space-y-6">
              {/* Enrollment Info */}
              {enrollment && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Package className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[14px] font-semibold text-[#030712] mb-3">
                        Enrollment Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[14px] text-[#6B7280] mb-1">
                            Enrollment Number
                          </p>
                          <p className="text-[14px] font-semibold text-[#030712] font-mono">
                            {enrollment.enrollment_number}
                          </p>
                        </div>
                        <div>
                          <p className="text-[14px] text-[#6B7280] mb-1">
                            Status
                          </p>
                          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            {enrollment.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-[14px] text-[#6B7280] mb-1">
                            Installments Paid
                          </p>
                          <p className="text-[14px] font-semibold text-[#030712]">
                            {enrollment.installments_paid} /{" "}
                            {enrollment.total_installments}
                          </p>
                        </div>
                        <div>
                          <p className="text-[14px] text-[#6B7280] mb-1">
                            Total Paid
                          </p>
                          <p className="text-[14px] font-semibold text-emerald-600">
                            {fmtMoney(enrollment.total_amount_paid)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div className="bg-[#F9FAFB] rounded-xl p-6 border border-[#E5E7EB]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Receipt className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[14px] font-semibold text-[#030712] mb-3">
                      Payment Information
                    </h3>
                    <div className="space-y-2">
                      {paymentId && (
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] text-[#6B7280]">
                            Payment ID
                          </span>
                          <span className="text-[14px] font-mono font-semibold text-[#030712]">
                            #{paymentId}
                          </span>
                        </div>
                      )}
                      {enrollmentId && (
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] text-[#6B7280]">
                            Enrollment ID
                          </span>
                          <span className="text-[14px] font-mono font-semibold text-[#030712]">
                            #{enrollmentId}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#6B7280]">
                          Payment Method
                        </span>
                        <span className="text-[14px] font-semibold text-[#030712]">
                          bKash
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#6B7280]">
                          Payment Date
                        </span>
                        <span className="text-[14px] font-semibold text-[#030712]">
                          {new Date().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="text-[14px] text-emerald-800">
                    <p className="font-medium mb-2">What happens next?</p>
                    <ul className="list-disc list-inside space-y-1 text-[13px]">
                      <li>Your installments have been marked as paid</li>
                      <li>Commission processing has been initiated (30 TK per installment)</li>
                      <li>Your enrollment progress has been updated</li>
                      <li>Payment receipt is available in your transaction history</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleContinue}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold bg-[#068847] hover:bg-[#057a3d] text-white transition-colors shadow-lg"
                >
                  View Pension Details
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleViewDashboard}
                  className="flex-1 px-6 py-3 rounded-xl text-[14px] font-medium text-[#6B7280] hover:bg-[#F3F4F6] transition-colors border border-[#E5E7EB]"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </>
        )}

        {status === "error" && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#030712] mb-3">
              Payment Confirmation Issue
            </h1>
            <p className="text-[14px] text-[#6B7280] mb-6 max-w-md mx-auto">
              We're having trouble confirming your payment. Your payment may
              have been processed successfully. Please check your pension
              details or contact support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleContinue}
                className="px-6 py-3 rounded-xl text-[14px] font-semibold bg-[#068847] hover:bg-[#057a3d] text-white transition-colors"
              >
                Check Pension Status
              </button>
              <button
                onClick={handleViewDashboard}
                className="px-6 py-3 rounded-xl text-[14px] font-medium text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
