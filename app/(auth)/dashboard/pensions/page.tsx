"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Package,
  AlertCircle,
  RefreshCw,
  Calendar,
  TrendingUp,
  Layers,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMyPensionEnrollments } from "@/lib/hooks/user/usePensionEnrollment";
import { usePensionPayment } from "@/lib/hooks/user/usePensionPayment";
import { PensionEnrollment as BasePensionEnrollment, PensionInstallment } from "./types";

// Extended type to include installments from API
interface PensionEnrollment extends BasePensionEnrollment {
  pension_installments?: PensionInstallment[];
}
import { enrollmentStatusConfig, installmentStatusConfig } from "./constants";
import { fmtDate, fmtMoney } from "./utils";
import PensionPaymentModal from "@/components/dashboard/pensions/PensionPaymentModal";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

// ── Helper Functions ────────────────────────────────────────────────────────

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getInstallmentMonth(dueDate: string) {
  const date = new Date(dueDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

// ── Loading Skeleton ────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-[#E5E7EB] p-5 animate-pulse"
          >
            <div className="h-3 bg-[#F3F4F6] rounded w-24 mb-3" />
            <div className="h-8 bg-[#F3F4F6] rounded w-32" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 animate-pulse">
        <div className="h-5 bg-[#F3F4F6] rounded w-48 mb-6" />
        <div className="space-y-4">
          <div className="h-24 bg-[#F3F4F6] rounded" />
          <div className="h-24 bg-[#F3F4F6] rounded" />
        </div>
      </div>
    </div>
  );
}

// ── Error State ─────────────────────────────────────────────────────────────

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-red-100 p-8 text-center">
      <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-7 h-7 text-red-400" />
      </div>
      <h3 className="text-[14px] font-semibold text-[#030712] mb-2">
        Failed to load data
      </h3>
      <p className="text-[14px] text-[#6B7280] max-w-md mx-auto mb-4">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 text-[14px] font-medium text-[#068847] hover:underline"
      >
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}

// ── Payment Alert Banner ────────────────────────────────────────────────────

interface PaymentAlertProps {
  currentMonthUnpaid: PensionInstallment[];
  previousUnpaid: PensionInstallment[];
  enrollmentMap: Map<number, PensionEnrollment>;
  onPayNow: (installment: PensionInstallment) => void;
}

function PaymentAlert({
  currentMonthUnpaid,
  previousUnpaid,
  enrollmentMap,
  onPayNow,
}: PaymentAlertProps) {
  if (currentMonthUnpaid.length === 0 && previousUnpaid.length === 0) {
    return null;
  }

  const totalDue = [...currentMonthUnpaid, ...previousUnpaid].reduce(
    (sum, inst) => sum + parseFloat(inst.total_amount),
    0
  );

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-[14px] font-semibold text-amber-900 mb-1">
            Payment Required
          </h3>
          <p className="text-[14px] text-amber-800 mb-4">
            You have {currentMonthUnpaid.length + previousUnpaid.length} unpaid
            installment{currentMonthUnpaid.length + previousUnpaid.length > 1 ? "s" : ""}{" "}
            totaling {fmtMoney(totalDue)}
          </p>

          <div className="space-y-3">
            {previousUnpaid.length > 0 && (
              <div>
                <p className="text-[14px] font-medium text-red-700 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Overdue Payments ({previousUnpaid.length})
                </p>
                <div className="space-y-2">
                  {previousUnpaid.map((inst) => {
                    const enrollment = enrollmentMap.get(
                      inst.pension_enrollment_id
                    );
                    return (
                      <div
                        key={inst.id}
                        className="bg-white rounded-lg p-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-[14px] font-medium text-[#030712]">
                            {enrollment?.enrollment_number} - Installment #
                            {inst.installment_number}
                          </p>
                          <p className="text-[14px] text-red-600">
                            Due: {fmtDate(inst.due_date)} • {fmtMoney(inst.total_amount)}
                          </p>
                        </div>
                        <button
                          onClick={() => onPayNow(inst)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[14px] font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                          Pay Now
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentMonthUnpaid.length > 0 && (
              <div>
                <p className="text-[14px] font-medium text-amber-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Current Month Due ({currentMonthUnpaid.length})
                </p>
                <div className="space-y-2">
                  {currentMonthUnpaid.map((inst) => {
                    const enrollment = enrollmentMap.get(
                      inst.pension_enrollment_id
                    );
                    return (
                      <div
                        key={inst.id}
                        className="bg-white rounded-lg p-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-[14px] font-medium text-[#030712]">
                            {enrollment?.enrollment_number} - Installment #
                            {inst.installment_number}
                          </p>
                          <p className="text-[14px] text-amber-600">
                            Due: {fmtDate(inst.due_date)} • {fmtMoney(inst.total_amount)}
                          </p>
                        </div>
                        <button
                          onClick={() => onPayNow(inst)}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[14px] font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                          Pay Now
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Summary Stats ───────────────────────────────────────────────────────────

interface SummaryStatsProps {
  enrollments: PensionEnrollment[];
  installments: PensionInstallment[];
}

function SummaryStats({ enrollments, installments }: SummaryStatsProps) {
  const activeEnrollments = enrollments.filter((e) => e.status === "active").length;
  const totalPaid = installments.reduce(
    (sum, inst) => sum + parseFloat(inst.amount_paid || "0"),
    0
  );
  const totalMaturity = enrollments.reduce(
    (sum, e) => sum + parseFloat(e.maturity_amount || "0"),
    0
  );

  const stats = [
    {
      label: "Active Plans",
      value: activeEnrollments,
      icon: Package,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Paid",
      value: fmtMoney(totalPaid),
      icon: CheckCircle2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Expected Maturity",
      value: fmtMoney(totalMaturity),
      icon: TrendingUp,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[14px] font-medium text-[#6B7280]">{stat.label}</p>
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Enrollment Card ─────────────────────────────────────────────────────────

interface EnrollmentCardProps {
  enrollment: PensionEnrollment;
  installments: PensionInstallment[];
  onPayNow: (installment: PensionInstallment) => void;
}

function EnrollmentCard({
  enrollment,
  installments,
  onPayNow,
}: EnrollmentCardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sc =
    enrollmentStatusConfig[enrollment.status] ?? enrollmentStatusConfig.pending;

  const pct =
    enrollment.total_installments > 0
      ? (enrollment.installments_paid / enrollment.total_installments) * 100
      : 0;

  const sortedInstallments = [...installments].sort(
    (a, b) => a.installment_number - b.installment_number
  );

  // Pagination calculations
  const totalPages = Math.ceil(sortedInstallments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInstallments = sortedInstallments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-5 border-b border-[#F3F4F6]">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-[#068847]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[14px] font-bold text-[#030712] font-mono">
                  {enrollment.enrollment_number}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}
                >
                  <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                  {sc.label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[14px] text-[#6B7280]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Enrolled {fmtDate(enrollment.enrollment_date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  Matures {fmtDate(enrollment.maturity_date)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[14px] text-[#9CA3AF] mb-1">Maturity Amount</p>
            <p className="text-2xl font-bold text-[#030712]">
              {fmtMoney(enrollment.maturity_amount)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#F9FAFB] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#9CA3AF]" />
              <span className="text-[14px] font-medium text-[#030712]">
                Payment Progress
              </span>
            </div>
            <span className="text-[14px] font-semibold text-[#068847]">
              {enrollment.installments_paid}/{enrollment.total_installments}
              <span className="text-[#9CA3AF] font-normal ml-1">
                ({pct.toFixed(1)}%)
              </span>
            </span>
          </div>
          <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-[#068847] to-[#059669] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-[#6B7280]">
              Paid {fmtMoney(enrollment.total_amount_paid)}
            </span>
            <span className="text-[#6B7280]">
              {enrollment.missed_installments > 0 && (
                <span className="text-red-600 font-medium">
                  {enrollment.missed_installments} missed ·{" "}
                </span>
              )}
              {enrollment.installments_remaining} remaining
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#FAFAFA]">
        <div>
          <p className="text-[14px] text-[#9CA3AF] mb-1">Monthly Payment</p>
          <p className="text-[14px] font-semibold text-[#030712]">
            {fmtMoney(enrollment.amount_per_installment)}
          </p>
        </div>
        <div>
          <p className="text-[14px] text-[#9CA3AF] mb-1">Total Due</p>
          <p className="text-[14px] font-semibold text-[#030712]">
            {fmtMoney(enrollment.total_amount_due)}
          </p>
        </div>
        <div>
          <p className="text-[14px] text-[#9CA3AF] mb-1">Next Due Date</p>
          <p className="text-[14px] font-semibold text-[#030712]">
            {fmtDate(enrollment.next_due_date)}
          </p>
        </div>
        <div>
          <p className="text-[14px] text-[#9CA3AF] mb-1">Profit Share</p>
          <p className="text-[14px] font-semibold text-[#030712]">
            {enrollment.profit_share_percentage}%
          </p>
        </div>
      </div>

      {/* Installments Table */}
      {sortedInstallments.length > 0 && (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB] border-y border-[#F3F4F6]">
                <tr>
                  <th className="px-5 py-3 text-left text-[14px] font-semibold text-[#6B7280]">
                    #
                  </th>
                  <th className="px-5 py-3 text-left text-[14px] font-semibold text-[#6B7280]">
                    Due Date
                  </th>
                  <th className="px-5 py-3 text-left text-[14px] font-semibold text-[#6B7280]">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-left text-[14px] font-semibold text-[#6B7280]">
                    Late Fee
                  </th>
                  <th className="px-5 py-3 text-left text-[14px] font-semibold text-[#6B7280]">
                    Total
                  </th>
                  <th className="px-5 py-3 text-left text-[14px] font-semibold text-[#6B7280]">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-[14px] font-semibold text-[#6B7280]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {paginatedInstallments.map((inst) => {
                  const sc =
                    installmentStatusConfig[inst.status] ??
                    installmentStatusConfig.upcoming;
                  const canPay =
                    inst.status !== "paid" && inst.status !== "waived";

                  return (
                    <tr
                      key={inst.id}
                      className="hover:bg-[#FAFAFA] transition-colors"
                    >
                      <td className="px-5 py-3 text-[14px] font-mono text-[#6B7280]">
                        {inst.installment_number}
                      </td>
                      <td className="px-5 py-3 text-[14px] text-[#030712]">
                        {fmtDate(inst.due_date)}
                      </td>
                      <td className="px-5 py-3 text-[14px] font-medium text-[#030712]">
                        {fmtMoney(inst.amount)}
                      </td>
                      <td className="px-5 py-3 text-[14px]">
                        {parseFloat(inst.late_fee) > 0 ? (
                          <span className="text-red-600 font-medium">
                            {fmtMoney(inst.late_fee)}
                          </span>
                        ) : (
                          <span className="text-[#D1D5DB]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-[14px] font-semibold text-[#030712]">
                        {fmtMoney(inst.total_amount)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center text-[12px] font-medium px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} border ${sc.border}`}
                        >
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {canPay ? (
                          <button
                            onClick={() => onPayNow(inst)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#068847] hover:bg-[#057a3d] text-white text-[14px] font-medium rounded-lg transition-colors"
                          >
                            <CreditCard className="w-4 h-4" />
                            Pay Now
                          </button>
                        ) : inst.status === "paid" ? (
                          <span className="inline-flex items-center gap-1.5 text-[14px] text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                            Paid on {fmtDate(inst.paid_date)}
                          </span>
                        ) : (
                          <span className="text-[14px] text-[#9CA3AF]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-[#F3F4F6] bg-[#FAFAFA]">
              <div className="text-[14px] text-[#6B7280]">
                Showing {startIndex + 1} to {Math.min(endIndex, sortedInstallments.length)} of{" "}
                {sortedInstallments.length} installments
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-2 text-[14px] font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-[14px] font-medium rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-[#068847] text-white"
                          : "text-[#6B7280] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-2 text-[14px] font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {enrollment.notes && (
        <div className="px-5 py-3 bg-amber-50 border-t border-amber-100">
          <p className="text-[14px] text-amber-800">
            <span className="font-semibold">Note: </span>
            {enrollment.notes}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function PensionPage() {
  const searchParams = useSearchParams();
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<PensionEnrollment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    data: enrollmentsRes,
    isLoading: enrollmentsLoading,
    isError: enrollmentsError,
    error: enrollmentsErr,
    refetch: refetchEnrollments,
  } = useMyPensionEnrollments();

  const { initiatePayment, loading: paymentLoading } = usePensionPayment({
    onSuccess: () => {
      setShowPaymentModal(false);
      refetchEnrollments();
    },
    onError: (error) => {
      console.error("Payment error:", error);
    },
  });

  // Check for payment success from callback (only once)
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const hasShownSuccess = sessionStorage.getItem("pension_payment_success_shown");
    
    if (paymentStatus === "success" && !hasShownSuccess) {
      toast.success("Payment completed successfully!");
      localStorage.removeItem("pension_payment_completed");
      sessionStorage.setItem("pension_payment_success_shown", "true");
      refetchEnrollments();
      
      // Clean up URL without triggering navigation
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      window.history.replaceState({}, "", url.toString());
    }
    
    // Cleanup on unmount
    return () => {
      if (paymentStatus === "success") {
        sessionStorage.removeItem("pension_payment_success_shown");
      }
    };
  }, [searchParams, refetchEnrollments]);

  const enrollments = enrollmentsRes?.data ?? [];

  // Extract all installments from enrollments
  const installments = useMemo(() => {
    const allInstallments: PensionInstallment[] = [];
    enrollments.forEach((enrollment) => {
      if (enrollment.pension_installments) {
        allInstallments.push(...enrollment.pension_installments);
      }
    });
    return allInstallments;
  }, [enrollments]);

  // Build enrollment map
  const enrollmentMap = useMemo(
    () => new Map(enrollments.map((e) => [e.id, e])),
    [enrollments]
  );

  // Group installments by enrollment
  const installmentsByEnrollment = useMemo(() => {
    const grouped = new Map<number, PensionInstallment[]>();
    enrollments.forEach((enrollment) => {
      if (enrollment.pension_installments) {
        grouped.set(enrollment.id, enrollment.pension_installments);
      }
    });
    return grouped;
  }, [enrollments]);

  // Find unpaid installments
  const currentMonth = getCurrentMonth();
  const unpaidInstallments = installments.filter(
    (inst) => inst.status !== "paid" && inst.status !== "waived"
  );

  const currentMonthUnpaid = unpaidInstallments.filter(
    (inst) => getInstallmentMonth(inst.due_date) === currentMonth
  );

  const previousUnpaid = unpaidInstallments.filter(
    (inst) => getInstallmentMonth(inst.due_date) < currentMonth
  );

  const handlePayNow = (installment: PensionInstallment) => {
    const enrollment = enrollmentMap.get(installment.pension_enrollment_id);
    if (enrollment) {
      setSelectedEnrollment(enrollment);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentInitiate = async (enrollmentId: number, count: number) => {
    try {
      await initiatePayment(enrollmentId, count);
    } catch (error) {
      console.error("Failed to initiate payment:", error);
    }
  };

  const isLoading = enrollmentsLoading;
  const isError = enrollmentsError;
  const errorMessage = enrollmentsErr?.message || "Could not fetch pension data.";

  const onRetry = () => {
    refetchEnrollments();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <ErrorState message={errorMessage} onRetry={onRetry} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#030712] mb-1">
            Pension Plans
          </h1>
          <p className="text-[14px] text-[#6B7280]">
            Manage your pension enrollments and track payment schedules
          </p>
        </div>

        {/* Payment Alert */}
        <PaymentAlert
          currentMonthUnpaid={currentMonthUnpaid}
          previousUnpaid={previousUnpaid}
          enrollmentMap={enrollmentMap}
          onPayNow={handlePayNow}
        />

        {/* Summary Stats */}
        <SummaryStats enrollments={enrollments} installments={installments} />

        {/* Enrollments */}
        <div>
          <h2 className="text-lg font-semibold text-[#030712] mb-4">
            Your Pension Enrollments
          </h2>
          {enrollments.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
              <div className="w-16 h-16 rounded-xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-[#D1D5DB]" />
              </div>
              <h3 className="text-[14px] font-semibold text-[#030712] mb-2">
                No pension plans found
              </h3>
              <p className="text-[14px] text-[#6B7280] max-w-md mx-auto">
                You haven't enrolled in any pension packages yet. Contact your
                branch or admin to get started with a pension plan.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {enrollments.map((enrollment) => (
                <EnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  installments={
                    installmentsByEnrollment.get(enrollment.id) ?? []
                  }
                  onPayNow={handlePayNow}
                />
              ))}
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {selectedEnrollment && (
          <PensionPaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedEnrollment(null);
            }}
            enrollment={selectedEnrollment}
            unpaidInstallments={
              installmentsByEnrollment
                .get(selectedEnrollment.id)
                ?.filter(
                  (inst) => inst.status !== "paid" && inst.status !== "waived"
                )
                .sort((a, b) => a.installment_number - b.installment_number) ??
              []
            }
            onPaymentInitiate={handlePaymentInitiate}
            isLoading={paymentLoading}
          />
        )}
      </div>
    </div>
  );
}
