"use client";

import { useState } from "react";
import { X, ArrowLeftRight, AlertTriangle } from "lucide-react";
import { useDirectTransfer, DirectTransferPayload } from "@/lib/hooks/admin/useAccountTransfers";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const TRANSFER_REASONS = [
  { value: "unable_to_continue", label: "Unable to Continue" },
  { value: "financial_hardship", label: "Financial Hardship" },
  { value: "relocation", label: "Relocation" },
  { value: "health_issues", label: "Health Issues" },
  { value: "death", label: "Death of Member" },
  { value: "other", label: "Other" },
] as const;

export default function DirectTransferModal({ onClose, onSuccess }: Props) {
  const [enrollmentId, setEnrollmentId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [reason, setReason] = useState<DirectTransferPayload["transfer_reason"]>("other");
  const [reasonDetails, setReasonDetails] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const directTransfer = useDirectTransfer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!enrollmentId || !toUserId) {
      setError("Pension Enrollment ID and Target Member ID are required.");
      return;
    }

    try {
      await directTransfer.mutateAsync({
        pension_enrollment_id: Number(enrollmentId),
        to_user_id: Number(toUserId),
        transfer_reason: reason,
        reason_details: reasonDetails || undefined,
        review_notes: reviewNotes || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Transfer failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ArrowLeftRight className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Direct Transfer</h2>
              <p className="text-xs text-gray-500">Transfer enrollment + wallet + commissions to an existing member</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Warning */}
        <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            This action is immediate and irreversible. It transfers the pension enrollment, full wallet balance, commission balance, and pending commissions to the target member.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pension Enrollment ID <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={enrollmentId}
              onChange={(e) => setEnrollmentId(e.target.value)}
              placeholder="e.g. 42"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">The ID of the pension enrollment to transfer (from the enrollments list).</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Member (User ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              placeholder="e.g. 15"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">The existing member who will receive the account. Must be a registered user.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transfer Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as DirectTransferPayload["transfer_reason"])}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              {TRANSFER_REASONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason Details</label>
            <textarea
              value={reasonDetails}
              onChange={(e) => setReasonDetails(e.target.value)}
              rows={2}
              placeholder="Additional context about the transfer reason..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={2}
              placeholder="Internal notes for audit trail..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={directTransfer.isPending}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {directTransfer.isPending ? "Processing..." : "Execute Transfer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
