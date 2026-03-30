"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";

type EditableFieldProps = {
  label: string;
  value: string;
  type?: "text" | "select";
  options?: string[];
  onSave: (updatedValue: string) => void;
  badgeMap?: Record<string, { badge: string; dot: string }>;
};

const EditableField = ({
  label,
  value,
  type = "text",
  options = [],
  onSave,
  badgeMap,
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);

  const handleSave = () => {
    onSave(fieldValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFieldValue(value);
    setIsEditing(false);
  };

  const badge = badgeMap?.[value];

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center justify-between gap-4">
      {/* Left: label + value */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-1">
          {label}
        </p>

        {isEditing ? (
          type === "select" ? (
            <select
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-800 outline-none focus:ring-1 focus:ring-blue-400"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-800 outline-none focus:ring-1 focus:ring-blue-400"
              autoFocus
            />
          )
        ) : badge ? (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mt-1 ${badge.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {value}
          </span>
        ) : (
          <p className="text-sm font-medium text-gray-900">{value || "—"}</p>
        )}
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              title="Save"
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-green-600 transition-colors"
            >
              <Check size={13} />
            </button>
            <button
              onClick={handleCancel}
              title="Cancel"
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-red-500 transition-colors"
            >
              <X size={13} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
          >
            <Pencil size={11} />
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default EditableField;
