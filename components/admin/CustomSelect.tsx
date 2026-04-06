import { useEffect, useRef, useState } from "react";

export default function CustomSelect({
  value,
  onChange,
  options,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full h-[48px] border rounded-[8px] px-[16px] bg-white flex items-center justify-between text-[#6A7282] text-[14px] focus:outline-none focus:ring focus:ring-green-500 ${
          error ? "border-red-400" : "border-[#D1D5DC]"
        } ${open ? "ring ring-green-500 border-transparent" : ""}`}
      >
        <span>{selected?.label ?? "Select..."}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-[#D1D5DC] rounded-[8px] shadow-lg overflow-hidden">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-[16px] py-[12px] text-[14px] cursor-pointer hover:bg-green-50 hover:text-green-700 ${
                opt.value === value
                  ? "bg-green-100 text-green-800 font-semibold"
                  : "text-[#030712]"
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
