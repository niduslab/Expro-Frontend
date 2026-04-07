"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const DESIGNATION_GROUPS: { label: string; options: string[] }[] = [
  {
    label: "Founders",
    options: ["Founder", "Co-Founder"],
  },
  {
    label: "Advisory",
    options: [
      "Chief Advisors",
      "Advisor on International Affairs",
      "Legal Advisor",
      "Advisor",
    ],
  },
  {
    label: "Governing",
    options: [
      "Founder & Chairman",
      "Vice-Chairman & Director General",
      "Secretary & Executive Director",
      "Treasurer & Director Finance",
      "Director Administration",
      "Director of Marketing",
      "Director of Inspection",
      "Director of Relationship Management",
      "Director of Training",
      "Director of HR (Human Resources)",
      "Director of Promotion & Publication",
    ],
  },
  {
    label: "Executive",
    options: ["Executive Member"],
  },
  {
    label: "Staff",
    options: [
      "Outreach Coordinator",
      "Case Manager",
      "Volunteer Manager",
      "Donation Coordinator",
    ],
  },
];

const OTHERS_LABEL = "Others";

// ── Component ─────────────────────────────────────────────────────────────────

interface DesignationDropdownProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export default function DesignationDropdown({
  value,
  onChange,
  error,
}: DesignationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [isOthers, setIsOthers] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine on mount / value change whether we're in "Others" mode
  useEffect(() => {
    const allPredefined = DESIGNATION_GROUPS.flatMap((g) => g.options);
    if (value && !allPredefined.includes(value)) {
      setIsOthers(true);
      setCustomValue(value);
    } else {
      setIsOthers(false);
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    setIsOthers(false);
    setCustomValue("");
    onChange(option);
    setOpen(false);
  };

  const handleSelectOthers = () => {
    setIsOthers(true);
    setOpen(false);
    onChange(customValue); // keep whatever was typed
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomValue(e.target.value);
    onChange(e.target.value);
  };

  const displayLabel = isOthers
    ? customValue || "Type designation…"
    : value || "Select designation";

  const triggerPlaceholder = !value && !isOthers;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Trigger ── */}
      {!isOthers ? (
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className={`
            w-full h-[48px] border rounded-[8px] px-[16px] bg-white flex items-center justify-between
            text-[14px] focus:outline-none focus:ring focus:ring-green-500 transition-colors
            ${error ? "border-red-400" : "border-[#D1D5DC]"}
            ${triggerPlaceholder ? "text-[#9CA3AF]" : "text-[#030712]"}
          `}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown
            className={`h-4 w-4 text-[#6A7282] flex-shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      ) : (
        /* ── Others: inline text input ── */
        <div className="flex gap-2">
          <input
            autoFocus
            className={`
              flex-1 h-[48px] border rounded-[8px] px-[16px] bg-white text-[14px] text-[#030712]
              focus:outline-none focus:ring focus:ring-green-500
              ${error ? "border-red-400" : "border-[#D1D5DC]"}
            `}
            placeholder="Type specific designation…"
            value={customValue}
            onChange={handleCustomChange}
          />
          {/* Switch back to dropdown */}
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            className="h-[48px] px-3 border border-[#D1D5DC] rounded-[8px] text-[#6A7282] hover:bg-[#F9FAFB] transition-colors"
            title="Switch to predefined"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}

      {/* ── Dropdown Panel ── */}
      {open && (
        <div
          className="
            absolute z-[9999] mt-1 w-full bg-white border border-[#E5E7EB] rounded-xl
            shadow-[0px_8px_32px_0px_#0000001A] overflow-hidden
          "
          style={{ maxHeight: 320, overflowY: "auto" }}
        >
          {DESIGNATION_GROUPS.map((group) => (
            <div key={group.label}>
              {/* Group header */}
              <div className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF] select-none">
                {group.label}
              </div>

              {group.options.map((option) => {
                const selected = value === option && !isOthers;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full text-left px-4 py-2.5 text-[14px] flex items-center justify-between gap-2
                      transition-colors duration-100
                      ${
                        selected
                          ? "bg-[#F0FDF4] text-[#068847] font-medium"
                          : "text-[#030712] hover:bg-[#F9FAFB]"
                      }
                    `}
                  >
                    <span>{option}</span>
                    {selected && (
                      <Check className="h-4 w-4 text-[#068847] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Others option */}
          <div className="border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={handleSelectOthers}
              className={`
                w-full text-left px-4 py-3 text-[14px] flex items-center justify-between gap-2
                transition-colors duration-100
                ${
                  isOthers
                    ? "bg-[#F0FDF4] text-[#068847] font-medium"
                    : "text-[#6A7282] hover:bg-[#F9FAFB]"
                }
              `}
            >
              <span>Others (type manually)</span>
              {isOthers && (
                <Check className="h-4 w-4 text-[#068847] flex-shrink-0" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
