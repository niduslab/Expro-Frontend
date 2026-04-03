import { Search, SlidersHorizontal, Plus } from "lucide-react";

export const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700",
  draft: "bg-amber-50  text-amber-700",
  archived: "bg-gray-100  text-gray-500",
};

export function Spinner() {
  return (
    <div className="py-20 flex flex-col items-center gap-3 text-[#8a8780]">
      <div className="w-8 h-8 border-2 border-[#1a1a2e]/20 border-t-[#1a1a2e] rounded-full animate-spin" />
      <span className="text-sm">Loading...</span>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  label,
  onAdd,
}: {
  icon: React.ElementType;
  label: string;
  onAdd: () => void;
}) {
  return (
    <div className="py-20 flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-[#f5f4f0] flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#b8b5ae]" />
      </div>
      <p className="text-sm text-[#8a8780]">No {label} found</p>
      <button
        onClick={onAdd}
        className="text-sm text-[#1a1a2e] underline underline-offset-2 font-medium"
      >
        Create {label}
      </button>
    </div>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8780]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e8e6e0] rounded-xl text-sm placeholder:text-[#b8b5ae] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/10 focus:border-[#1a1a2e]"
      />
    </div>
  );
}

export function FilterToggle({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4  cursor-pointer py-2.5 rounded-xl text-sm font-medium border transition-colors ${
        active
          ? "bg-[#068847] text-white border-[#068847]"
          : "bg-white text-[#4a4845] border-[#e8e6e0] hover:border-[#1a1a2e]"
      }`}
    >
      <SlidersHorizontal className="w-4 h-4" />
      Filter
      {active && <span className="w-2 h-2 rounded-full bg-white/70" />}
    </button>
  );
}

export function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#068847] text-white text-sm font-semibold whitespace-nowrap"
    >
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

export function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-[#068847] text-white"
          : "bg-[#d7efdc] text-[#4a4845] hover:bg-[#c3e8ca]"
      }`}
    >
      {label}
    </button>
  );
}
