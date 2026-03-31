"use client";

import { useState } from "react";
import { Check, X, Pencil } from "lucide-react";
import InfoItem from "./InfoItem";

const inputCls =
  "w-full text-sm border rounded-lg px-2.5 py-1.5 bg-white text-gray-800 outline-none focus:ring-1 mt-1";

type Field = {
  label: string;
  value: any;
  rawValue?: any;
  key: string;
};

const EditableSection = ({
  title,
  fields,
  onSave,
  validate, // ✅ add validation prop
}: {
  title: string;
  fields: Field[];
  onSave: (updated: Record<string, any>) => void;
  validate?: (data: Record<string, any>) => Record<string, string>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(
    Object.fromEntries(fields.map((f) => [f.key, f.rawValue ?? f.value])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({}); // ✅ errors state

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    // clear field error
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const handleSave = () => {
    if (validate) {
      const validationErrors = validate(formData);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    setErrors({});
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(
      Object.fromEntries(fields.map((f) => [f.key, f.rawValue ?? f.value])),
    );
    setErrors({});
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
        {fields.map((f) =>
          isEditing ? (
            <div key={f.key} className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
                {f.label}
              </span>

              <input
                type="text"
                value={formData[f.key] || ""}
                onChange={(e) => handleChange(f.key, e.target.value)}
                className={`${inputCls} ${
                  errors[f.key]
                    ? "border-red-500"
                    : "border-gray-200 focus:ring-blue-400"
                }`}
              />

              {/* ✅ inline error */}
              {errors[f.key] && (
                <p className="text-xs text-red-500 mt-1">{errors[f.key]}</p>
              )}
            </div>
          ) : (
            <InfoItem
              key={f.key}
              label={f.label}
              value={typeof f.value === "string" ? f.value : f.value || "—"}
            />
          ),
        )}
      </div>
    </div>
  );
};

export default EditableSection;
