"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type DropdownProps = {
  label?: string;
  required?: boolean;
  placeholder: string;
  options: string[];
  onChange?: (value: string) => void;
  value: string;
};

export default function Dropdown({
  label,
  required,
  placeholder,
  options,
  onChange,
  value, // new prop
}: DropdownProps & { value: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSelect = (val: string) => {
    setOpen(false);
    onChange?.(val);
  };

  return (
    <div ref={ref} className="relative w-full">
      {label && (
        <div className="pb-2">
          <span className="font-semibold text-[14px]">{label}</span>
          {required && <span className="text-red-500">*</span>}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center cursor-pointer justify-between h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-white"
      >
        <span className="text-[#6A7282] text-[14px]">
          {value || placeholder}
        </span>
        <ChevronDown size={14} className="text-[#6A7282]" />
      </button>

      {open && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-[#D1D5DC] rounded-[8px] shadow-md">
          {options.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 text-[#6A7282] text-sm hover:bg-gray-100 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
