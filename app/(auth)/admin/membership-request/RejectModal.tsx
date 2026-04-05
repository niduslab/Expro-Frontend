"use client";
import { X } from "lucide-react";
import { useState } from "react";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  applicantName: string;
  isLoading?: boolean;
}

export default function RejectModal({
  isOpen,
  onClose,
  onConfirm,
  applicantName,
  isLoading = false,
}: RejectModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <h3 className="text-[20px] font-semibold text-[#030712]">
            Reject Application
          </h3>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-[#6B7280] hover:text-[#030712] transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-[14px] text-[#4A5565] mb-4">
                You are about to reject the application from{" "}
                <span className="font-semibold text-[#030712]">
                  {applicantName}
                </span>
                . Please provide a reason for rejection.
              </p>

              <label
                htmlFor="reason"
                className="block text-[14px] font-medium text-[#030712] mb-2"
              >
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter the reason for rejecting this application..."
                rows={4}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-[#D1D5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <p className="text-[12px] text-[#6B7280] mt-2">
                This reason will be sent to the applicant.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB] bg-[#F9FAFB]">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 border border-[#D1D5DC] rounded-lg text-[14px] font-medium text-[#4A5565] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || isLoading}
              className="px-4 py-2 bg-[#DC2626] text-white rounded-lg text-[14px] font-medium hover:bg-[#B91C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Rejecting..." : "Reject Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
