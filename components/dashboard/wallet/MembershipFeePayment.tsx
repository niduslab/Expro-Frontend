"use client";

import { useState } from "react";
import { CreditCard, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useUpcomingMembershipFees, usePayMembershipFee } from "@/lib/hooks/user/useMembershipFee";
import { MembershipFee } from "@/lib/api/functions/membershipFee";

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const fmtAmount = (v: string | number) =>
  parseFloat(String(v)).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function MembershipFeePayment() {
  const { data: upcomingFees, isLoading } = useUpcomingMembershipFees();
  const { mutate: payFee, isPending } = usePayMembershipFee();
  const [selectedFee, setSelectedFee] = useState<MembershipFee | null>(null);

  const handlePayNow = (fee: MembershipFee) => {
    payFee(
      {
        fee_id: fee.id,
        fee_type: fee.fee_type,
        payment_method: "bkash",
      },
      {
        onSuccess: (response) => {
          if (response.data.bkashURL) {
            // Redirect to bKash payment page
            window.location.href = response.data.bkashURL;
          }
        },
        onError: (error: any) => {
          alert(error?.response?.data?.message || "Payment initiation failed");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#068847]" />
        </div>
      </div>
    );
  }

  if (!upcomingFees || upcomingFees.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#030712]">
              Membership Fees
            </h3>
            <p className="text-xs text-[#6B7280]">
              All fees are up to date
            </p>
          </div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-emerald-900">
            No pending membership fees
          </p>
          <p className="text-xs text-emerald-700 mt-1">
            You're all caught up!
          </p>
        </div>
      </div>
    );
  }

  const dueFees = upcomingFees.filter((f) => f.status === "due" || f.status === "overdue");
  const totalDue = dueFees.reduce((sum, f) => sum + parseFloat(f.amount) + parseFloat(f.late_fee || "0"), 0);

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 border-b-2 border-amber-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#030712]">
              Monthly Membership Fee
            </h3>
            <p className="text-xs text-[#6B7280]">
              {dueFees.length} fee{dueFees.length !== 1 ? "s" : ""} pending
            </p>
          </div>
        </div>
        {totalDue > 0 && (
          <div className="flex items-center justify-between mt-4 bg-white rounded-lg px-4 py-3 border border-amber-200">
            <span className="text-sm font-medium text-[#6B7280]">Total Due</span>
            <span className="text-2xl font-bold text-amber-600">
              ৳{fmtAmount(totalDue)}
            </span>
          </div>
        )}
      </div>

      {/* Fee List */}
      <div className="divide-y divide-gray-100">
        {upcomingFees.map((fee) => {
          const isOverdue = fee.status === "overdue";
          const isPaid = fee.status === "paid";
          const totalAmount = parseFloat(fee.amount) + parseFloat(fee.late_fee || "0");
          const daysUntilDue = Math.ceil(
            (new Date(fee.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={fee.id}
              className={`p-5 hover:bg-gray-50 transition-colors ${
                isOverdue ? "bg-red-50/50" : isPaid ? "bg-gray-50" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-[#030712] capitalize">
                      {fee.fee_type.replace(/_/g, " ")}
                    </h4>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        isPaid
                          ? "bg-emerald-100 text-emerald-700"
                          : isOverdue
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {fee.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#6B7280] mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Due: {fmtDate(fee.due_date)}
                    </span>
                    {!isPaid && daysUntilDue > 0 && (
                      <span className={`font-medium ${isOverdue ? "text-red-600" : "text-amber-600"}`}>
                        {daysUntilDue} day{daysUntilDue !== 1 ? "s" : ""} {isOverdue ? "overdue" : "left"}
                      </span>
                    )}
                    {!isPaid && daysUntilDue <= 0 && !isOverdue && (
                      <span className="font-medium text-red-600">Due today</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">Fee Amount</span>
                      <span className="font-semibold text-[#030712]">৳{fmtAmount(fee.amount)}</span>
                    </div>
                    {parseFloat(fee.late_fee || "0") > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-red-600">Late Fee</span>
                        <span className="font-semibold text-red-600">৳{fmtAmount(fee.late_fee)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-[#030712] mb-3">
                    ৳{fmtAmount(totalAmount)}
                  </p>
                  {!isPaid && (
                    <button
                      onClick={() => handlePayNow(fee)}
                      disabled={isPending}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                        isOverdue
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-[#068847] hover:bg-[#057a3d] text-white"
                      } disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg`}
                    >
                      {isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Pay Now
                        </>
                      )}
                    </button>
                  )}
                  {isPaid && fee.paid_date && (
                    <div className="text-xs text-emerald-600 font-medium">
                      Paid on {fmtDate(fee.paid_date)}
                    </div>
                  )}
                </div>
              </div>

              {fee.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-[#6B7280]">{fee.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Footer */}
      <div className="bg-blue-50 px-6 py-4 border-t border-blue-100">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Payment Information</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>You will be redirected to bKash payment gateway</li>
              <li>Payment confirmation may take a few moments</li>
              <li>Late fees apply for overdue payments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
