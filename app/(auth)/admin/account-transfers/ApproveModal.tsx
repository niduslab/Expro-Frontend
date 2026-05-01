import { useState } from "react";
import { AccountTransfer } from "@/lib/hooks/admin/useAccountTransfers";
import { X, CheckCircle, AlertTriangle } from "lucide-react";

interface ApproveModalProps {
  transfer: AccountTransfer;
  onClose: () => void;
  onSubmit: (notes: string) => Promise<void>;
}

export default function ApproveModal({ transfer, onClose, onSubmit }: ApproveModalProps) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canApprove = transfer.outstanding_cleared && transfer.status === "under_review";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canApprove) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(notes);
    } catch (error) {
      console.error("Failed to approve transfer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Approve Transfer</h2>
              <p className="text-sm text-gray-600">{transfer.transfer_number}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {!canApprove && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold mb-1">Cannot Approve</p>
                  <ul className="list-disc list-inside space-y-1">
                    {transfer.status !== "under_review" && (
                      <li>Transfer must be in "Under Review" status</li>
                    )}
                    {!transfer.outstanding_cleared && (
                      <li>Outstanding balance must be cleared first</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {canApprove && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-900 mb-2">⚡ Auto-Complete Process</p>
                <p className="text-sm text-green-800 mb-2">
                  Approving this transfer will automatically:
                </p>
                <ul className="text-sm text-green-800 space-y-1 ml-4 list-disc">
                  <li>Create new user account with temporary password</li>
                  <li>Create member profile with all provided information</li>
                  <li>Create all nominee records</li>
                  <li>Create wallet and transfer balance</li>
                  <li>Transfer pension enrollment ownership</li>
                  <li>Complete the transfer immediately</li>
                  <li>Send credentials to new member via email</li>
                </ul>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approval Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Enter any notes about the approval..."
                disabled={!canApprove}
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Transfer Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium text-gray-900">{transfer.from_user?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New Member:</span>
                  <span className="font-medium text-gray-900">{transfer.new_member_data?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{transfer.new_member_data?.email || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Outstanding:</span>
                  <span className={`font-medium ${transfer.outstanding_cleared ? 'text-green-600' : 'text-red-600'}`}>
                    ৳{(transfer.outstanding_balance || 0).toLocaleString()}
                    {transfer.outstanding_cleared && " (Cleared)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transfer Fee:</span>
                  <span className="font-medium text-gray-900">৳{(transfer.transfer_fee || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !canApprove}
            >
              {isSubmitting ? "Approving & Completing..." : "Approve & Auto-Complete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
