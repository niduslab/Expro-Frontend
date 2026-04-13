"use client";

import { Package } from "lucide-react";
import { InfoItem } from "./shared";

interface PensionEnrollmentsTabProps {
  pensionEnrollments: any[];
}

export default function PensionEnrollmentsTab({ pensionEnrollments }: PensionEnrollmentsTabProps) {
  if (pensionEnrollments.length === 0) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-[#E5E7EB] mx-auto mb-4" />
          <p className="text-[#6B7280] text-lg">No pension enrollments found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
      <h3 className="text-xl font-semibold text-[#030712] mb-6">Pension Enrollments</h3>
      <div className="space-y-6">
        {pensionEnrollments.map((enrollment: any) => (
          <div key={enrollment.id} className="border border-[#E5E7EB] rounded-xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#068847] to-[#045a2e] p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-6 h-6" />
                    <h4 className="text-xl font-bold">
                      {enrollment.pension_package?.name || "Unknown Package"}
                    </h4>
                  </div>
                  <p className="text-sm text-white/80 mb-1">
                    {enrollment.pension_package?.name_bangla || ""}
                  </p>
                  <p className="text-xs text-white/70 font-mono">
                    Enrollment: {enrollment.enrollment_number}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  enrollment.status === "active"
                    ? "bg-white text-[#068847]"
                    : "bg-white/20 text-white"
                }`}>
                  {enrollment.status.toUpperCase()}
                </span>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-xs text-white/70 mb-1">Monthly Payment</p>
                  <p className="text-2xl font-bold">৳{parseFloat(enrollment.amount_per_installment).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-white/70 mb-1">Maturity Amount</p>
                  <p className="text-2xl font-bold">৳{parseFloat(enrollment.maturity_amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-white/70 mb-1">Progress</p>
                  <p className="text-2xl font-bold">{enrollment.installments_paid}/{enrollment.total_installments}</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 bg-[#F9FAFB]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#030712]">Payment Progress</span>
                <span className="text-sm font-semibold text-[#068847]">
                  {((enrollment.installments_paid / enrollment.total_installments) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-[#E5E7EB] rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#068847] to-[#045a2e] h-full rounded-full transition-all duration-300"
                  style={{ width: `${(enrollment.installments_paid / enrollment.total_installments) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-[#6B7280]">
                <span>Paid: ৳{parseFloat(enrollment.total_amount_paid).toLocaleString()}</span>
                <span>Remaining: {enrollment.installments_remaining} installments</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="p-6 bg-white">
              <h5 className="text-sm font-semibold text-[#030712] mb-4 uppercase tracking-wide">Enrollment Details</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <InfoItem label="Enrollment Date" value={new Date(enrollment.enrollment_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
                <InfoItem label="Start Date" value={new Date(enrollment.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
                <InfoItem label="Maturity Date" value={new Date(enrollment.maturity_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
                <InfoItem label="Next Due Date" value={enrollment.next_due_date ? new Date(enrollment.next_due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"} />
                <InfoItem label="Missed Installments" value={
                  <span className={enrollment.missed_installments > 0 ? "text-red-600 font-semibold" : ""}>
                    {enrollment.missed_installments}
                  </span>
                } />
                <InfoItem label="Profit Share" value={`${enrollment.profit_share_percentage}%`} />
                <InfoItem label="Sponsored By" value={enrollment.sponsored_by ? `Member #${enrollment.sponsored_by}` : "Self"} />
                <InfoItem label="Commission Paid" value={enrollment.joining_commission_paid ? "Yes" : "No"} />
              </div>

              {/* Package Description */}
              {enrollment.pension_package?.description && (
                <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                  <h5 className="text-sm font-semibold text-[#030712] mb-2">Package Description</h5>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{enrollment.pension_package.description}</p>
                </div>
              )}

              {/* Notes */}
              {enrollment.notes && (
                <div className="mt-4 p-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-lg">
                  <p className="text-sm text-[#92400E]">
                    <span className="font-semibold">Note:</span> {enrollment.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
