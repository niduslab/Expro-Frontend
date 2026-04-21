"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import type { PaymentGatewayConfig } from "@/lib/types/admin/Paymentgatewayconfig";

interface DeleteConfirmProps {
  open: boolean;
  config: PaymentGatewayConfig | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirm({
  open,
  config,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteConfirmProps) {
  if (!open || !config) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="px-6 py-6 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="font-medium text-slate-800">Delete configuration?</p>
            <p className="text-sm text-slate-500 mt-1">
              The{" "}
              <span className="font-medium capitalize text-slate-700">
                {config.gateway_type}
              </span>{" "}
              gateway configuration will be permanently deleted. This action
              cannot be undone.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 transition flex items-center gap-2"
          >
            {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}