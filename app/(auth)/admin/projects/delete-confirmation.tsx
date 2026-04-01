"use client";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  projectTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function DeleteConfirmDialog({
  projectTitle,
  onConfirm,
  onCancel,
  isPending,
}: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex flex-col w-full max-w-[420px] bg-white rounded-2xl border border-[#E5E7EB] shadow-lg p-6 gap-5">
        {/* Icon + heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-50 border border-red-100">
            <AlertTriangle className="h-6 w-6 text-[#FB2C36]" />
          </div>
          <div>
            <p className="font-semibold text-[18px] text-[#030712] leading-[130%]">
              Delete Project
            </p>
            <p className="text-[13px] text-[#4A5565] mt-1 leading-[160%]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#030712]">
                "{projectTitle}"
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="border border-[#E5E7EB]" />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 h-[44px] rounded-xl border border-[#E5E7EB] text-[#6A7282] font-normal text-[15px] hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 h-[44px] rounded-xl bg-[#FB2C36] text-white font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
