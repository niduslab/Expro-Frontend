import { useState } from "react";
import {
  Receipt,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Hourglass,
} from "lucide-react";
import { PensionInstallment } from "./types";
import { installmentStatusConfig } from "./constants";
import { fmtDate, fmtMoney } from "./utils";
import { PensionInstallmentStatus } from "@/lib/types/admin/pensionsType";

interface EnrollmentGroupProps {
  enrollmentId: number;
  enrollmentNumber: string;
  installments: PensionInstallment[];
}

const TABLE_COLUMNS = [
  "#",
  "Due Date",
  "Amount",
  "Late Fee",
  "Total",
  "Paid Date",
  "Paid Amount",
  "Reference",
  "Commission",
  "Status",
];

export default function EnrollmentGroup({
  enrollmentId,
  enrollmentNumber,
  installments,
}: EnrollmentGroupProps) {
  const [expanded, setExpanded] = useState(true);

  const sorted = [...installments].sort(
    (a, b) => a.installment_number - b.installment_number,
  );

  const paidCount = installments.filter((i) => i.status === "paid").length;
  const overdueCount = installments.filter(
    (i) => i.status === "overdue",
  ).length;
  const totalPaid = installments.reduce(
    (s, i) => s + parseFloat(i.amount_paid || "0"),
    0,
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      {/* Accordion header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F9FAFB] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
            <Receipt className="w-4 h-4 text-[#068847]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-[#030712] font-mono">
              {enrollmentNumber}
            </p>
            <p className="text-xs text-[#6B7280]">
              {installments.length} installments · {paidCount} paid
              {overdueCount > 0 && (
                <span className="text-red-600 font-medium ml-1">
                  · {overdueCount} overdue
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] text-[#9CA3AF]">Total paid</p>
            <p className="text-sm font-semibold text-emerald-700">
              {fmtMoney(totalPaid)}
            </p>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-[#9CA3AF]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
          )}
        </div>
      </button>

      {/* Table */}
      {expanded && (
        <div className="border-t border-[#F3F4F6] overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB]">
              <tr>
                {TABLE_COLUMNS.map((col) => (
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
              {sorted.map((inst) => {
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
                    <td className="px-4 py-3 text-[12px] whitespace-nowrap">
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
                    <td className="px-4 py-3 text-[12px] whitespace-nowrap">
                      {parseFloat(inst.amount_paid) > 0 ? (
                        <span className="text-emerald-700 font-medium">
                          {fmtMoney(inst.amount_paid)}
                        </span>
                      ) : (
                        <span className="text-[#D1D5DB]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#6B7280] whitespace-nowrap max-w-[120px] truncate">
                      {inst.payment_reference ?? (
                        <span className="text-[#D1D5DB]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] whitespace-nowrap">
                      {inst.commission_processed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#9CA3AF] text-[11px]">
                          <Hourglass className="w-3 h-3" />
                          Pending
                        </span>
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
      )}
    </div>
  );
}
