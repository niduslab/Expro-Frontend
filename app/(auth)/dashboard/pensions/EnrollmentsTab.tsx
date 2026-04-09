import { Package } from "lucide-react";
import { PensionEnrollment } from "./types";
import { enrollmentStatusConfig } from "./constants";
import { fmtMoney } from "./utils";
import StatPill from "./StatPill";
import EnrollmentCard from "./EnrollmentCard";

interface EnrollmentsTabProps {
  enrollments: PensionEnrollment[];
}

export default function EnrollmentsTab({ enrollments }: EnrollmentsTabProps) {
  const totalPaid = enrollments.reduce(
    (s, e) => s + parseFloat(e.total_amount_paid || "0"),
    0,
  );
  const totalMaturity = enrollments.reduce(
    (s, e) => s + parseFloat(e.maturity_amount || "0"),
    0,
  );
  const activeCount = enrollments.filter((e) => e.status === "active").length;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill label="Total enrollments" value={enrollments.length} />
        <StatPill label="Active plans" value={activeCount} />
        <StatPill
          label="Total paid"
          value={<span className="text-[22px]">{fmtMoney(totalPaid)}</span>}
        />
        <StatPill
          label="Expected maturity"
          value={<span className="text-[22px]">{fmtMoney(totalMaturity)}</span>}
        />
      </div>

      {/* Status breakdown */}
      {enrollments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(Object.keys(enrollmentStatusConfig) as string[]).map((s) => {
            const count = enrollments.filter((e) => e.status === s).length;
            if (count === 0) return null;
            const sc = enrollmentStatusConfig[s];
            return (
              <div key={s} className={`rounded-xl border px-3 py-2 ${sc.bg}`}>
                <p
                  className={`text-[10px] font-medium uppercase tracking-wide mb-0.5 ${sc.text}`}
                >
                  {sc.label}
                </p>
                <p className={`text-lg font-semibold ${sc.text}`}>{count}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Cards or empty state */}
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
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      )}
    </div>
  );
}
