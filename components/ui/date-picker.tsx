"use client";

import { Calendar } from "lucide-react";

type DatePickerProps = {
  label?: string;
  required?: boolean;
  value?: string; // should be in 'yyyy-mm-dd' format
  onChange?: (value: string) => void;
};

export default function DatePicker({
  label,
  required,
  value,
  onChange,
}: DatePickerProps) {
  // Handles changes in the date input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value; // 'yyyy-mm-dd' format
    if (!raw) return;

    // Pass the raw value up to parent; parent can format for display elsewhere
    onChange?.(raw);
  };

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1">
          <span className="font-semibold text-[14px] text-[#111827]">
            {label}
          </span>
          {required && (
            <span className="text-[#FB2C36] font-medium text-[16px]">*</span>
          )}
        </div>
      )}

      <div className="relative">
        <input
          type="date"
          value={value || ""} // important: always pass a valid value
          onChange={handleChange}
          className="
            w-full h-[42px]
            border border-[#D1D5DC]
            rounded-[8px]
            px-[12px]
            pr-[36px]
            text-[14px]
            text-[#6A7282]
            bg-white
            appearance-none
            cursor-pointer
          "
        />

        <Calendar
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A7282] pointer-events-none"
        />
      </div>
    </div>
  );
}
