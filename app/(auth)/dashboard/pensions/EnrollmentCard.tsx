import { Calendar, TrendingUp, Package, Layers } from "lucide-react";
import { PensionEnrollment } from "./types";
import { enrollmentStatusConfig } from "./constants";
import { fmtDate, fmtMoney } from "./utils";
import InfoCell from "./InfoCell";

interface EnrollmentCardProps {
  enrollment: PensionEnrollment;
}

export default function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const sc =
    enrollmentStatusConfig[enrollment.status] ?? enrollmentStatusConfig.pending;

  const pct =
    enrollment.total_installments > 0
      ? (enrollment.installments_paid / enrollment.total_installments) * 100
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#F3F4F6]">
        <div className="flex items-start gap-4">
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
          <div className="flex-shrink-0 text-right">
            <p className="text-[11px] text-[#9CA3AF] mb-0.5">Maturity amount</p>
            <p className="text-xl font-semibold text-[#030712]">
              {fmtMoney(enrollment.maturity_amount)}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
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

      {/* Details grid */}
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

      {/* Notes */}
      {enrollment.notes && (
        <div className="px-5 py-3 bg-amber-50">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">Note: </span>
            {enrollment.notes}
          </p>
        </div>
      )}
    </div>
  );
}
