"use client";

import {
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Package,
  BadgeDollarSign,
  Layers,
  Receipt,
  Ban,
  Hourglass,
} from "lucide-react";
import { useState } from "react";
import {
  PensionEnrollment,
  PensionInstallment,
} from "@/lib/types/admin/pensionsType";

// ── Types ──────────────────────────────────────────────────────────────────

interface PensionPageProps {
  enrollments: PensionEnrollment[];
  installments: PensionInstallment[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const fmtMoney = (v: string | number | null | undefined) =>
  v !== null && v !== undefined
    ? `৳${parseFloat(String(v)).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : "—";

const enrollmentStatusConfig: Record<
  string,
  {
    label: string;
    bg: string;
    text: string;
    dot: string;
    icon: React.ElementType;
  }
> = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    icon: Clock,
  },
  active: {
    label: "Active",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  overdue: {
    label: "Overdue",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    icon: AlertCircle,
  },
  suspended: {
    label: "Suspended",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
    icon: Ban,
  },
  completed: {
    label: "Completed",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    icon: CheckCircle2,
  },
  matured: {
    label: "Matured",
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
    icon: TrendingUp,
  },
  closed: {
    label: "Closed",
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
    icon: XCircle,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    icon: XCircle,
  },
};

const installmentStatusConfig: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  upcoming: {
    label: "Upcoming",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
  },
  due: {
    label: "Due",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  overdue: {
    label: "Overdue",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  paid: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  partial: {
    label: "Partial",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  waived: {
    label: "Waived",
    bg: "bg-gray-100",
    text: "text-gray-500",
    border: "border-gray-200",
  },
};

// ── Sub-components ─────────────────────────────────────────────────────────

function StatPill({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3">
      <p className="text-[11px] text-[#9CA3AF] mb-1">{label}</p>
      <p className="text-2xl font-semibold text-[#030712] leading-none">
        {value}
      </p>
      {sub && <p className="text-[11px] text-[#9CA3AF] mt-1">{sub}</p>}
    </div>
  );
}

function InfoCell({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-[13px] font-medium text-[#030712]">
        {value ?? <span className="text-[#D1D5DB] font-normal">—</span>}
      </p>
    </div>
  );
}

function EnrollmentCard({
  enrollment,
  relatedInstallments,
}: {
  enrollment: PensionEnrollment;
  relatedInstallments: PensionInstallment[];
}) {
  const [expanded, setExpanded] = useState(false);

  const sc =
    enrollmentStatusConfig[enrollment.status] ?? enrollmentStatusConfig.pending;
  const StatusIcon = sc.icon;

  const pct =
    enrollment.total_installments > 0
      ? (enrollment.installments_paid / enrollment.total_installments) * 100
      : 0;

  const sortedInstallments = [...relatedInstallments].sort(
    (a, b) => a.installment_number - b.installment_number,
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-[#F3F4F6]">
        <div className="flex items-start gap-4">
          {/* Icon block */}
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-[#068847]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-semibold text-[#030712] font-mono">
                {enrollment.enrollment_number}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${sc.bg} ${sc.text}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`}
                />
                {sc.label}
              </span>
            </div>

            <div className="flex items-center gap-4 flex-wrap text-xs text-[#6B7280]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Enrolled {fmtDate(enrollment.enrollment_date)}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Matures {fmtDate(enrollment.maturity_date)}
              </span>
            </div>
          </div>

          {/* Maturity amount */}
          <div className="flex-shrink-0 text-right">
            <p className="text-[11px] text-[#9CA3AF] mb-0.5">Maturity amount</p>
            <p className="text-xl font-semibold text-[#030712]">
              {fmtMoney(enrollment.maturity_amount)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Progress ── */}
      <div className="px-5 py-4 border-b border-[#F3F4F6] bg-[#FAFAFA]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span className="text-xs font-medium text-[#030712]">
              Payment Progress
            </span>
          </div>
          <span className="text-xs font-semibold text-[#068847]">
            {enrollment.installments_paid}/{enrollment.total_installments}{" "}
            installments
            <span className="text-[#9CA3AF] font-normal ml-1">
              ({pct.toFixed(1)}%)
            </span>
          </span>
        </div>

        {/* Track */}
        <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#068847] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-[11px] text-[#9CA3AF]">
          <span>Paid {fmtMoney(enrollment.total_amount_paid)}</span>
          <span>
            {enrollment.missed_installments > 0 && (
              <span className="text-red-600 font-medium">
                {enrollment.missed_installments} missed ·{" "}
              </span>
            )}
            {enrollment.installments_remaining} remaining
          </span>
        </div>
      </div>

      {/* ── Key details grid ── */}
      <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-[#F3F4F6]">
        <InfoCell
          label="Monthly payment"
          value={fmtMoney(enrollment.amount_per_installment)}
        />
        <InfoCell
          label="Total due"
          value={fmtMoney(enrollment.total_amount_due)}
        />
        <InfoCell
          label="Next due date"
          value={fmtDate(enrollment.next_due_date)}
        />
        <InfoCell
          label="Last payment"
          value={fmtDate(enrollment.last_payment_date)}
        />
        <InfoCell label="Start date" value={fmtDate(enrollment.start_date)} />
        <InfoCell
          label="Profit share"
          value={`${enrollment.profit_share_percentage ?? "—"}%`}
        />
        <InfoCell
          label="Sponsored by"
          value={
            enrollment.sponsored_by
              ? `Member #${enrollment.sponsored_by}`
              : "Self"
          }
        />
        <InfoCell
          label="Commission paid"
          value={
            enrollment.joining_commission_paid ? (
              <span className="text-emerald-600">Yes</span>
            ) : (
              <span className="text-[#9CA3AF]">No</span>
            )
          }
        />
      </div>

      {/* ── Notes ── */}
      {enrollment.notes && (
        <div className="px-5 py-3 border-b border-[#F3F4F6] bg-amber-50">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">Note: </span>
            {enrollment.notes}
          </p>
        </div>
      )}

      {/* ── Installments toggle ── */}
      {sortedInstallments.length > 0 && (
        <>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5" />
              {sortedInstallments.length} installment records
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {expanded && <InstallmentsTable installments={sortedInstallments} />}
        </>
      )}
    </div>
  );
}

function InstallmentsTable({
  installments,
}: {
  installments: PensionInstallment[];
}) {
  return (
    <div className="border-t border-[#F3F4F6] overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#F9FAFB]">
          <tr>
            {[
              "#",
              "Due Date",
              "Amount",
              "Late Fee",
              "Total",
              "Paid Date",
              "Paid Amount",
              "Status",
            ].map((col) => (
              <th
                key={col}
                className="px-4 py-2.5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F9FAFB]">
          {installments.map((inst) => {
            const sc =
              installmentStatusConfig[inst.status] ??
              installmentStatusConfig.upcoming;
            return (
              <tr
                key={inst.id}
                className="hover:bg-[#FAFAFA] transition-colors"
              >
                <td className="px-4 py-3 text-[12px] font-mono text-[#6B7280]">
                  {inst.installment_number}
                </td>
                <td className="px-4 py-3 text-[12px] text-[#030712] whitespace-nowrap">
                  {fmtDate(inst.due_date)}
                </td>
                <td className="px-4 py-3 text-[12px] font-medium text-[#030712] whitespace-nowrap">
                  {fmtMoney(inst.amount)}
                </td>
                <td className="px-4 py-3 text-[12px] text-[#030712] whitespace-nowrap">
                  {parseFloat(inst.late_fee) > 0 ? (
                    <span className="text-red-600">
                      {fmtMoney(inst.late_fee)}
                    </span>
                  ) : (
                    <span className="text-[#D1D5DB]">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-[12px] font-semibold text-[#030712] whitespace-nowrap">
                  {fmtMoney(inst.total_amount)}
                </td>
                <td className="px-4 py-3 text-[12px] text-[#030712] whitespace-nowrap">
                  {fmtDate(inst.paid_date)}
                </td>
                <td className="px-4 py-3 text-[12px] text-[#030712] whitespace-nowrap">
                  {parseFloat(inst.amount_paid) > 0 ? (
                    <span className="text-emerald-700 font-medium">
                      {fmtMoney(inst.amount_paid)}
                    </span>
                  ) : (
                    <span className="text-[#D1D5DB]">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}
                  >
                    {sc.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function PensionPage({
  enrollments = [],
  installments = [],
}: PensionPageProps) {
  const totalPaid = enrollments.reduce(
    (s, e) => s + parseFloat(e.total_amount_paid || "0"),
    0,
  );
  const totalMaturity = enrollments.reduce(
    (s, e) => s + parseFloat(e.maturity_amount || "0"),
    0,
  );
  const activeCount = enrollments.filter((e) => e.status === "active").length;

  // Map installments to their enrollment
  const installmentsByEnrollment = installments.reduce<
    Record<number, PensionInstallment[]>
  >((acc, inst) => {
    const key = inst.pension_enrollment_id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(inst);
    return acc;
  }, {});

  return (
    <div className="container mx-auto mb-4">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* ── Title ── */}
        <div>
          <h1 className="text-lg font-semibold text-[#030712]">
            Pension Plans
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Your enrolled pension packages and payment history
          </p>
        </div>

        {/* ── Summary bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatPill label="Total enrollments" value={enrollments.length} />
          <StatPill label="Active plans" value={activeCount} />
          <StatPill
            label="Total paid"
            value={<span className="text-[22px]">{fmtMoney(totalPaid)}</span>}
          />
          <StatPill
            label="Expected maturity"
            value={
              <span className="text-[22px]">{fmtMoney(totalMaturity)}</span>
            }
          />
        </div>

        {/* ── Installment status summary ── */}
        {installments.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(
              [
                "paid",
                "upcoming",
                "due",
                "overdue",
                "partial",
                "waived",
              ] as const
            ).map((s) => {
              const count = installments.filter((i) => i.status === s).length;
              const sc = installmentStatusConfig[s];
              return (
                <div
                  key={s}
                  className={`rounded-xl border px-3 py-2.5 ${sc.bg} ${sc.border}`}
                >
                  <p
                    className={`text-[10px] font-medium uppercase tracking-wide mb-0.5 ${sc.text}`}
                  >
                    {sc.label}
                  </p>
                  <p className={`text-xl font-semibold ${sc.text}`}>{count}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Content ── */}
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] px-6 py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7 text-[#D1D5DB]" />
            </div>
            <h3 className="text-sm font-semibold text-[#030712] mb-1">
              No pension plans found
            </h3>
            <p className="text-xs text-[#6B7280] max-w-xs mx-auto">
              You haven't enrolled in any pension packages yet. Contact your
              branch or admin to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <EnrollmentCard
                key={enrollment.id}
                enrollment={enrollment}
                relatedInstallments={
                  installmentsByEnrollment[enrollment.id] ?? []
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
