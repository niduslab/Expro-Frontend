"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { LogOut, AlertTriangle } from "lucide-react";
import { useLogout } from "@/lib/hooks";

interface LogoutButtonProps {
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

interface LogoutModalProps {
  isOpen: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function LogoutModal({
  isOpen,
  isPending,
  onConfirm,
  onCancel,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4 items-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>

        {/* Text */}
        <div className="text-center">
          <h2
            id="logout-modal-title"
            className="text-base font-semibold text-gray-900"
          >
            Confirm Logout
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Are you sure you want to log out?
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full mt-1">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Logging out…" : "Logout"}
          </button>
        </div>
      </div>
    </div>,
    document.body, // ← renders outside the sidebar
  );
}

export function LogoutButton({
  className = "",
  showIcon = true,
  showText = true,
}: LogoutButtonProps) {
  const { mutate: logout, isPending } = useLogout();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => setIsModalOpen(true);
  const handleConfirm = () => {
    logout(undefined, { onSettled: () => setIsModalOpen(false) });
  };
  const handleCancel = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={handleLogout}
        disabled={isPending}
        className={`flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {showIcon && <LogOut className="w-5 h-5 text-gray-500" />}
        {showText && (isPending ? "Logging out…" : "Logout")}
      </button>

      <LogoutModal
        isOpen={isModalOpen}
        isPending={isPending}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
