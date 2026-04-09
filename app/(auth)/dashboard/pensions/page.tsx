"use client";

import { useState, useMemo } from "react";
import { Package, Receipt, AlertCircle, RefreshCw } from "lucide-react";
import { Tab } from "./types";
import { useMyPensionEnrollments } from "@/lib/hooks/user/usePensionEnrollment";
import { useMyPensionInstallments } from "@/lib/hooks/user/usePensionInstallment";
import EnrollmentsTab from "./EnrollmentsTab";
import InstallmentsTab from "./InstallmentsTab";

// ── Loading skeleton ────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden animate-pulse">
      <div className="px-5 py-4 border-b border-[#F3F4F6]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#F3F4F6]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#F3F4F6] rounded w-40" />
            <div className="h-3 bg-[#F3F4F6] rounded w-56" />
          </div>
          <div className="space-y-1 text-right">
            <div className="h-3 bg-[#F3F4F6] rounded w-20 ml-auto" />
            <div className="h-6 bg-[#F3F4F6] rounded w-28 ml-auto" />
          </div>
        </div>
      </div>
      <div className="px-5 py-4 bg-[#FAFAFA] border-b border-[#F3F4F6] space-y-2">
        <div className="h-3 bg-[#F3F4F6] rounded w-full" />
        <div className="h-2 bg-[#F3F4F6] rounded-full w-full" />
      </div>
      <div className="px-5 py-4 grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-2.5 bg-[#F3F4F6] rounded w-20" />
            <div className="h-4 bg-[#F3F4F6] rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3 animate-pulse space-y-2"
          >
            <div className="h-2.5 bg-[#F3F4F6] rounded w-24" />
            <div className="h-7 bg-[#F3F4F6] rounded w-16" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

// ── Error state ─────────────────────────────────────────────────────────────

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-red-100 px-6 py-14 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-7 h-7 text-red-400" />
      </div>
      <h3 className="text-sm font-semibold text-[#030712] mb-1">
        Failed to load data
      </h3>
      <p className="text-xs text-[#6B7280] max-w-xs mx-auto mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#068847] hover:underline"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Try again
      </button>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function PensionPage() {
  const [activeTab, setActiveTab] = useState<Tab>("enrollments");

  const {
    data: enrollmentsRes,
    isLoading: enrollmentsLoading,
    isError: enrollmentsError,
    error: enrollmentsErr,
    refetch: refetchEnrollments,
  } = useMyPensionEnrollments();

  const {
    data: installmentsRes,
    isLoading: installmentsLoading,
    isError: installmentsError,
    error: installmentsErr,
    refetch: refetchInstallments,
  } = useMyPensionInstallments();

  const enrollments = enrollmentsRes?.data ?? [];
  const installments = installmentsRes?.data ?? [];

  /** Build enrollment_id → enrollment_number map for the installments tab */
  const enrollmentNumbers = useMemo(
    () =>
      Object.fromEntries(
        enrollments.map((e) => [e.id, e.enrollment_number]),
      ) as Record<number, string>,
    [enrollments],
  );

  const tabs: {
    key: Tab;
    label: string;
    icon: React.ElementType;
    count: number;
  }[] = [
    {
      key: "enrollments",
      label: "Enrollments",
      icon: Package,
      count: enrollments.length,
    },
    {
      key: "installments",
      label: "Installments",
      icon: Receipt,
      count: installments.length,
    },
  ];

  const isLoading =
    activeTab === "enrollments" ? enrollmentsLoading : installmentsLoading;
  const isError =
    activeTab === "enrollments" ? enrollmentsError : installmentsError;
  const errorMessage =
    activeTab === "enrollments"
      ? (enrollmentsErr?.message ?? "Could not fetch pension enrollments.")
      : (installmentsErr?.message ?? "Could not fetch pension installments.");
  const onRetry =
    activeTab === "enrollments" ? refetchEnrollments : refetchInstallments;

  return (
    <div className="container mx-auto mb-4">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Title */}
        <div>
          <h1 className="text-lg font-semibold text-[#030712]">
            Pension Plans
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Your enrolled pension packages and payment history
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-xl w-fit">
          {tabs.map(({ key, label, icon: Icon, count }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive ? "bg-white text-[#030712] shadow-sm" : "text-[#6B7280] hover:text-[#030712]"}
                `}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-[#068847]" : ""}`}
                />
                {label}
                <span
                  className={`
                    text-[11px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                    ${isActive ? "bg-[#F0FDF4] text-[#068847]" : "bg-[#E5E7EB] text-[#9CA3AF]"}
                  `}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={onRetry} />
        ) : activeTab === "enrollments" ? (
          <EnrollmentsTab enrollments={enrollments} />
        ) : (
          <InstallmentsTab
            installments={installments}
            enrollmentNumbers={enrollmentNumbers}
          />
        )}
      </div>
    </div>
  );
}
