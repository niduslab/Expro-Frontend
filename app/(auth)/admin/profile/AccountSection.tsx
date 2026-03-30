"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";

type AccountSectionProps = {
  email?: string;
  status?: string;
  lastLogin?: string;
  onStatusSave: (updatedStatus: string) => void;
};

const STATUS_OPTIONS = ["Active", "Inactive", "Suspended"] as const;
type Status = (typeof STATUS_OPTIONS)[number];

const statusStyles: Record<Status, { badge: string; dot: string }> = {
  Active: {
    badge: "bg-green-50 text-green-800",
    dot: "bg-green-600",
  },
  Inactive: {
    badge: "bg-gray-100 text-gray-500",
    dot: "bg-gray-400",
  },
  Suspended: {
    badge: "bg-red-50 text-red-800",
    dot: "bg-red-600",
  },
};

const AccountSection = ({
  email,
  status,
  lastLogin,
  onStatusSave,
}: AccountSectionProps) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusValue, setStatusValue] = useState<Status>(
    (status as Status) || "Active",
  );

  const styles = statusStyles[statusValue] ?? statusStyles["Active"];

  const handleSave = () => {
    onStatusSave(statusValue);
    setIsEditingStatus(false);
  };

  const handleCancel = () => {
    setStatusValue((status as Status) || "Active");
    setIsEditingStatus(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-4">
        Account information
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        {/* Email */}
        <div className="py-3 sm:py-0 sm:pr-6">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">
            Email
          </p>
          <p className="text-sm font-medium text-gray-900">{email || "—"}</p>
          <p className="text-xs text-gray-400 mt-0.5">Primary address</p>
        </div>

        {/* Status */}
        <div className="py-3 sm:py-0 sm:px-6">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">
            Status
          </p>
          {isEditingStatus ? (
            <div className="flex items-center gap-2 mt-1">
              <select
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value as Status)}
                className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-800 outline-none focus:ring-1 focus:ring-blue-400"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSave}
                className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-green-600"
              >
                <Check size={13} />
              </button>
              <button
                onClick={handleCancel}
                className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-red-500"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${styles.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                {statusValue}
              </span>
              <button
                onClick={() => setIsEditingStatus(true)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Pencil size={11} />
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Last Login */}
        <div className="py-3 sm:py-0 sm:pl-6">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">
            Last login
          </p>
          <p className="text-sm font-medium text-gray-900">
            {lastLogin || "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSection;
