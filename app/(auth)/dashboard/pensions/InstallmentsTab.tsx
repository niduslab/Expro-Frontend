import { Receipt } from "lucide-react";
import { PensionInstallment } from "./types";
import { installmentStatusConfig } from "./constants";
import { fmtMoney } from "./utils";
import { PensionInstallmentStatus } from "@/lib/types/admin/pensionsType";
import StatPill from "./StatPill";
import EnrollmentGroup from "./EnrollmentGroup";

interface InstallmentsTabProps {
  installments: PensionInstallment[];
  enrollmentNumbers?: Record<number, string>;
}

const STATUS_ORDER: PensionInstallmentStatus[] = [
  "paid",
  "upcoming",
  "due",
  "overdue",
  "partial",
  "waived",
];

export default function InstallmentsTab({
  installments,
  enrollmentNumbers = {},
}: InstallmentsTabProps) {
  const totalPaid = installments.reduce(
    (s, i) => s + parseFloat(i.amount_paid || "0"),
    0,
  );
  const totalLateFees = installments.reduce(
    (s, i) => s + parseFloat(i.late_fee || "0"),
    0,
  );

  const grouped = installments.reduce<Record<number, PensionInstallment[]>>(
    (acc, inst) => {
      const key = inst.pension_enrollment_id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(inst);
      return acc;
    },
    {},
  );

  const enrollmentIds = Object.keys(grouped).map(Number);

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill label="Total installments" value={installments.length} />
        <StatPill
          label="Total paid"
          value={<span className="text-[22px]">{fmtMoney(totalPaid)}</span>}
        />
        <StatPill
          label="Late fees accrued"
          value={
            <span
              className={`text-[22px] ${totalLateFees > 0 ? "text-red-600" : ""}`}
            >
              {fmtMoney(totalLateFees)}
            </span>
          }
        />
        <StatPill
          label="Enrollments"
          value={enrollmentIds.length}
          sub="with installments"
        />
      </div>

      {/* Status breakdown */}
      {installments.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {STATUS_ORDER.map((s) => {
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

      {/* Grouped tables or empty state */}
      {installments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] px-6 py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-7 h-7 text-[#D1D5DB]" />
          </div>
          <h3 className="text-sm font-semibold text-[#030712] mb-1">
            No installments found
          </h3>
          <p className="text-xs text-[#6B7280] max-w-xs mx-auto">
            Installment records will appear here once your pension plans are
            active and payments are scheduled.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollmentIds.map((enrollmentId) => (
            <EnrollmentGroup
              key={enrollmentId}
              enrollmentId={enrollmentId}
              enrollmentNumber={
                enrollmentNumbers[enrollmentId] ?? `Enrollment #${enrollmentId}`
              }
              installments={grouped[enrollmentId]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
