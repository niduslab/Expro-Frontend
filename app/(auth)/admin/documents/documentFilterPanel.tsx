"use client";

import { DocumentType, DocumentStatus } from "@/lib/types/admin/documentType";

interface DocumentFilterPanelProps {
  filterType: string;
  filterStatus: string;
  filterFeatured: string;
  onTypeChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onFeaturedChange: (v: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

const TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: "All Types", value: "" },
  { label: "Profile", value: "profile" },
  { label: "Awards", value: "awards" },
  { label: "Annual Reports", value: "annual_reports" },
  { label: "Rules", value: "rules" },
  { label: "Organogram", value: "organogram" },
  { label: "Magazine", value: "magazine" },
  { label: "Calendar", value: "calendar" },
  { label: "Notice", value: "notice" },
  { label: "Other", value: "other" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived" },
];

const FEATURED_OPTIONS = [
  { label: "All", value: "" },
  { label: "Featured", value: "true" },
  { label: "Not Featured", value: "false" },
];

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-[#4a4845] shrink-0">{label}:</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            value === opt.value
              ? "bg-[#068847] text-white"
              : "bg-[#d7efdc] text-[#4a4845] hover:bg-[#ece9e0]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function DocumentFilterPanel({
  filterType,
  filterStatus,
  filterFeatured,
  onTypeChange,
  onStatusChange,
  onFeaturedChange,
  onClear,
  hasActiveFilters,
}: DocumentFilterPanelProps) {
  return (
    <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 flex flex-col gap-4">
      <FilterGroup
        label="Type"
        options={TYPE_OPTIONS}
        value={filterType}
        onChange={onTypeChange}
      />
      <div className="w-full border-t border-[#E5E7EB]" />
      <FilterGroup
        label="Status"
        options={STATUS_OPTIONS}
        value={filterStatus}
        onChange={onStatusChange}
      />
      <div className="w-full border-t border-[#E5E7EB]" />
      <div className="flex items-center justify-between">
        <FilterGroup
          label="Featured"
          options={FEATURED_OPTIONS}
          value={filterFeatured}
          onChange={onFeaturedChange}
        />
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-xs text-[#DC2626] hover:underline ml-auto"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
