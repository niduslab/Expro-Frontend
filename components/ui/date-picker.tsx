"use client";

import { Calendar } from "lucide-react";
import { useRef } from "react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!raw) return;
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

      <div
        className="relative cursor-pointer"
        onClick={() => inputRef.current?.showPicker()}
      >
        <input
          ref={inputRef}
          type="date"
          value={value || ""}
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
            cursor-pointer
            pointer-events-none
            [&::-webkit-calendar-picker-indicator]:hidden
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
