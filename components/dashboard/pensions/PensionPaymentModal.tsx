"use client";

import { useState } from "react";
import { X, CreditCard, AlertCircle, Package } from "lucide-react";
import { PensionEnrollment, PensionInstallment } from "@/app/(auth)/dashboard/pensions/types";
import { fmtMoney } from "@/app/(auth)/dashboard/pensions/utils";

interface PensionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: PensionEnrollment;
  unpaidInstallments: PensionInstallment[];
  onPaymentInitiate: (enrollmentId: number, count: number) => void;
  isLoading?: boolean;
}

export default function PensionPaymentModal({
  isOpen,
  onClose,
  enrollment,
  unpaidInstallments,
  onPaymentInitiate,
  isLoading = false,
}: PensionPaymentModalProps) {
  const [selectedCount, setSelectedCount] = useState(1);

  if (!isOpen) return null;

  const maxInstallments = Math.min(
    unpaidInstallments.length,
    enrollment.installments_remaining
  );

  const calculateTotal = (count: number) => {
    return unpaidInstallments
      .slice(0, count)
      .reduce((sum, inst) => sum + parseFloat(inst.total_amount), 0);
  };

  const totalAmount = calculateTotal(selectedCount);

  const handlePayNow = () => {
    onPaymentInitiate(enrollment.id, selectedCount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#068847]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#030712]">
                Pay Pension Installments
              </h2>
              <p className="text-[14px] text-[#6B7280]">
                {enrollment.enrollment_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Enrollment Summary */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Package className="w-6 h-6 text-[#068847]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-[#030712] mb-2">
                  Enrollment Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-[14px]">
                  <div>
                    <p className="text-[#6B7280]">Monthly Payment</p>
                    <p className="font-semibold text-[#030712]">
                      {fmtMoney(enrollment.amount_per_installment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6B7280]">Remaining</p>
                    <p className="font-semibold text-[#030712]">
                      {enrollment.installments_remaining} installments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Installment Count Selector */}
          <div>
            <label className="block text-[14px] font-semibold text-[#030712] mb-3">
              How many installments do you want to pay?
            </label>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: Math.min(maxInstallments, 12) }, (_, i) => i + 1).map(
                (count) => (
                  <button
                    key={count}
                    onClick={() => setSelectedCount(count)}
                    disabled={isLoading}
                    className={`
                      px-4 py-3 rounded-xl text-[14px] font-semibold transition-all
                      ${
                        selectedCount === count
                          ? "bg-[#068847] text-white shadow-lg scale-105"
                          : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {count}
                  </button>
                )
              )}
            </div>
            {maxInstallments > 12 && (
              <div className="mt-3">
                <input
                  type="number"
                  min="1"
                  max={maxInstallments}
                  value={selectedCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= maxInstallments) {
                      setSelectedCount(val);
                    }
                  }}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#068847] disabled:opacity-50"
                  placeholder={`Enter 1-${maxInstallments}`}
                />
              </div>
            )}
          </div>

          {/* Installments Preview */}
          <div className="bg-[#F9FAFB] rounded-xl p-5 border border-[#E5E7EB]">
            <h3 className="text-[14px] font-semibold text-[#030712] mb-3">
              Installments to be Paid
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {unpaidInstallments.slice(0, selectedCount).map((inst) => (
                <div
                  key={inst.id}
                  className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-[#E5E7EB]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-mono text-[#6B7280]">
                      #{inst.installment_number}
                    </span>
                    <span className="text-[14px] text-[#030712]">
                      Due: {new Date(inst.due_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-semibold text-[#030712]">
                      {fmtMoney(inst.total_amount)}
                    </p>
                    {parseFloat(inst.late_fee) > 0 && (
                      <p className="text-[12px] text-red-600">
                        +{fmtMoney(inst.late_fee)} late fee
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-medium text-[#6B7280]">
                Installments Selected
              </span>
              <span className="text-[14px] font-semibold text-[#030712]">
                {selectedCount}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-blue-200">
              <span className="text-[14px] font-semibold text-[#030712]">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-[#068847]">
                {fmtMoney(totalAmount)}
              </span>
            </div>
          </div>

          {/* Info Alert */}
          <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-[14px] text-amber-800">
              <p className="font-medium mb-1">Payment Information</p>
              <ul className="list-disc list-inside space-y-1 text-[13px]">
                <li>You will be redirected to bKash payment gateway</li>
                <li>Installments will be paid in sequential order</li>
                <li>Payment confirmation may take a few moments</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl text-[14px] font-medium text-[#6B7280] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayNow}
            disabled={isLoading || selectedCount < 1}
            className="px-8 py-3 rounded-xl text-[14px] font-semibold bg-[#068847] hover:bg-[#057a3d] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Pay {fmtMoney(totalAmount)} with bKash
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
