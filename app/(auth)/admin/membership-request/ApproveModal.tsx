"use client";
import { CircleCheck } from "lucide-react";

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  applicantName: string;
  isLoading: boolean;
}

export default function ApproveModal({
  isOpen,
  onClose,
  onConfirm,
  applicantName,
  isLoading,
}: ApproveModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="bg-[#DFF1E9] p-3 rounded-full">
            <CircleCheck className="text-[#29A36A] h-8 w-8" />
          </div>
          <h3 className="font-semibold text-[18px] text-[#030712]">
            Approve Application
          </h3>
          <p className="text-[14px] text-[#4A5565]">
            Are you sure you want to approve the application from{" "}
            <span className="font-semibold text-[#030712]">
              {applicantName}
            </span>
            ?
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 border border-[#D1D5DC] rounded-xl text-sm font-medium text-[#4A5565] hover:bg-[#F3F4F6] disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-[#068847] rounded-xl text-sm font-semibold text-white hover:bg-[#057a3f] disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Approving..." : "Yes, Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}