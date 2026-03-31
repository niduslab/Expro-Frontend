"use client";

import { ReactNode, useState } from "react";
import { Check, X, Pencil } from "lucide-react";
import { DateTimePicker } from "@/components/DateTimePicker";

type Field = {
  label: string;
  value: ReactNode;
  rawValue: any;
  key: string;
  type?: "text" | "date" | "select" | "boolean";
  options?: { label: string; value: any }[];
};

interface Props {
  fields: Field[];
  onSave: (updated: Record<string, any>) => void;
  title?: string;
}

const inputCls =
  "w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-800 outline-none focus:ring-1 focus:ring-blue-400 mt-1";

const MembershipSection = ({ fields, onSave, title = "Membership" }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(
    Object.fromEntries(fields.map((f) => [f.key, f.rawValue])),
  );

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(Object.fromEntries(fields.map((f) => [f.key, f.rawValue])));
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-6 py-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
          {title}
        </p>

        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg transition-colors"
            >
              <Check size={12} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-2.5 py-1 rounded-lg transition-colors"
            >
              <X size={12} />
              Cancel
            </button>
          </div>
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

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
        {fields.map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
              {f.label}
            </span>

            {isEditing ? (
              f.type === "date" ? (
                <DateTimePicker
                  value={formData[f.key] || null}
                  onChange={(newDate) => handleChange(f.key, newDate)}
                />
              ) : f.type === "select" ? (
                <select
                  value={formData[f.key] || ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className={inputCls}
                >
                  {f.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : f.type === "boolean" ? (
                <select
                  value={formData[f.key] ? "true" : "false"}
                  onChange={(e) =>
                    handleChange(f.key, e.target.value === "true")
                  }
                  className={inputCls}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={formData[f.key] || ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className={inputCls}
                />
              )
            ) : (
              <span className="text-sm font-medium text-gray-900">
                {f.value ?? "—"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipSection;
