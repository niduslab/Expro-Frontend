"use client";

import { useRef } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface DocumentSearchBarProps {
  searchInput: string;
  onSearchInputChange: (v: string) => void;
  onCommitSearch: () => void;
  onClearSearch: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  hasActiveFilters: boolean;
}

export default function DocumentSearchBar({
  searchInput,
  onSearchInputChange,
  onCommitSearch,
  onClearSearch,
  showFilters,
  onToggleFilters,
  hasActiveFilters,
}: DocumentSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onCommitSearch();
    if (e.key === "Escape") {
      onClearSearch();
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search input + button */}
      <div className="flex items-center gap-2 flex-1 min-w-0 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8780] pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search documents..."
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-[#e8e6e0] rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#b8b5ae] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/10 focus:border-[#1a1a2e]"
          />
          {searchInput && (
            <button
              onClick={onClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8780] hover:text-[#1a1a2e] transition-colors rounded p-0.5"
              title="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={onCommitSearch}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#068847] text-white text-sm font-medium hover:bg-[#05713b] transition-colors whitespace-nowrap shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          Search
        </button>
      </div>

      {/* Filter toggle */}
      <button
        onClick={onToggleFilters}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ml-auto ${
          showFilters || hasActiveFilters
            ? "bg-[#068847] text-white border-[#068847]"
            : "bg-white text-[#4a4845] border-[#e8e6e0] hover:border-[#1a1a2e]"
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filter
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-white/70" />
        )}
      </button>
    </div>
  );
}
