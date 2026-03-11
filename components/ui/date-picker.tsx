"use client";

import { Calendar } from "lucide-react";

type DatePickerProps = {
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

export default function DatePicker({
  label,
  required,
  value,
  onChange,
}: DatePickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (!raw) return;

    const [year, month, day] = raw.split("-");
    const formatted = `${day}/${month}/${year.slice(2)}`;

    onChange?.(formatted);
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
