"use client";

import { useState, useMemo, useRef } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MailOpen,
  MailCheck,
  Archive,
  AlertCircle,
  Inbox,
} from "lucide-react";
import type {
  ContactMessage,
  ContactMessageStatus,
  ContactMessagePriority,
  ContactMessageUpdatePayload,
} from "@/lib/types/admin/ContactMessageType";
import CustomSelect from "@/components/admin/CustomSelect";

// ─────────────────────────────────────────────
// Types (re-exported for consumers)
// ─────────────────────────────────────────────
export type SortKey = "created_at" | "name" | "status" | "priority";
export type SortDir = "asc" | "desc";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
export const STATUS_CONFIG: Record<
  ContactMessageStatus,
  {
    label: string;
    bg: string;
    text: string;
    dot: string;
    border: string;
    icon: React.ReactNode;
    rowBg: string;
    rowBorder: string;
  }
> = {
  new: {
    label: "New",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    border: "border-blue-200",
    icon: <Inbox size={11} />,
    rowBg: "bg-blue-50/30",
    rowBorder: "border-l-[3px] border-l-blue-500",
  },
  read: {
    label: "Read",
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
    border: "border-gray-200",
    icon: <MailOpen size={11} />,
    rowBg: "",
    rowBorder: "border-l-[3px] border-l-transparent",
  },
  replied: {
    label: "Replied",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
    border: "border-green-200",
    icon: <MailCheck size={11} />,
    rowBg: "bg-green-50/20",
    rowBorder: "border-l-[3px] border-l-green-500",
  },
  archived: {
    label: "Archived",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    border: "border-amber-200",
    icon: <Archive size={11} />,
    rowBg: "bg-amber-50/20",
    rowBorder: "border-l-[3px] border-l-amber-400",
  },
};

export const PRIORITY_CONFIG: Record<
  ContactMessagePriority,
  { label: string; bg: string; text: string; border: string }
> = {
  low: {
    label: "Low",
    bg: "bg-gray-100",
    text: "text-gray-500",
    border: "border-gray-200",
  },
  normal: {
    label: "Normal",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
  },
  high: {
    label: "High",
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
  },
  urgent: {
    label: "Urgent",
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100",
  },
};

// ─────────────────────────────────────────────
// Re-export Lucide icons as named exports (for consumers)
// ─────────────────────────────────────────────
export const RefreshIcon = () => <RefreshCw size={13} />;
export const SearchIcon = () => <Search size={14} />;
export const XIcon = () => <X size={16} strokeWidth={2.5} />;
export const EditIcon = () => <Pencil size={13} />;
export const TrashIcon = () => <Trash2 size={13} />;
export const EyeIcon = () => <Eye size={13} />;
export const MailIcon = ({ size = 14 }: { size?: number }) => (
  <Mail size={size} />
);
export const PhoneIcon = ({ size = 14 }: { size?: number }) => (
  <Phone size={size} />
);
export const ChevronIcon = ({
  dir = "down",
}: {
  dir?: "up" | "down" | "left" | "right";
}) => {
  if (dir === "up") return <ChevronUp size={14} />;
  if (dir === "left") return <ChevronLeft size={14} />;
  if (dir === "right") return <ChevronRight size={14} />;
  return <ChevronDown size={14} />;
};

// ─────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────
export function StatCard({
  label,
  value,
  sub,
  valueColor,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  valueColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] border border-[#A7F3D0] flex items-center justify-center text-[#068847]">
          {icon}
        </div>
      </div>
      <p className={`text-2xl font-bold ${valueColor} leading-none mb-1`}>
        {value}
      </p>
      <p className="text-[11px] text-gray-400">{sub}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// StatusBadge & PriorityBadge
// ─────────────────────────────────────────────
export function StatusBadge({ status }: { status: ContactMessageStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({
  priority,
}: {
  priority: ContactMessagePriority;
}) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      {priority === "urgent" && (
        <AlertCircle size={10} className="mr-1 flex-shrink-0" />
      )}
      {cfg.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// Detail / Edit Modal
// ─────────────────────────────────────────────
export function MessageModal({
  message,
  mode,
  onClose,
  onSave,
  isSaving,
}: {
  message: ContactMessage;
  mode: "view" | "edit";
  onClose: () => void;
  onSave: (id: number, payload: ContactMessageUpdatePayload) => Promise<void>;
  isSaving: boolean;
}) {
  const [status, setStatus] = useState<ContactMessageStatus>(message.status);
  const [priority, setPriority] = useState<ContactMessagePriority>(
    message.priority,
  );
  const [notes, setNotes] = useState(message.admin_notes ?? "");

  async function handleSave() {
    await onSave(message.id, {
      // Preserve original required fields
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      // Update admin-editable fields
      status,
      priority,
      admin_notes: notes,
    });
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#E5E7EB]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] border border-[#A7F3D0] flex items-center justify-center text-[#068847]">
              <Mail size={16} />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">
                {mode === "view" ? "Message Details" : "Edit Message"}
              </h2>
              <p className="text-[11px] text-gray-400">#{message.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Sender */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#E8FAF0] to-[#D1FAE5] flex items-center justify-center border border-[#A7F3D0] flex-shrink-0">
              <span className="text-[13px] font-bold text-[#068847]">
                {message.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-gray-900 leading-tight">
                {message.name}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                <a
                  href={`mailto:${message.email}`}
                  className="text-[12px] text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Mail size={11} /> {message.email}
                </a>
                {message.phone && (
                  <a
                    href={`tel:${message.phone}`}
                    className="text-[12px] text-gray-500 flex items-center gap-1"
                  >
                    <Phone size={11} /> {message.phone}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Subject & Message */}
          <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E5E7EB]">
            <p className="text-[13px] font-semibold text-gray-800 mb-2">
              {message.subject}
            </p>
            <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap">
              {message.message}
            </p>
          </div>

          {/* Status / Priority */}
          {mode === "view" ? (
            <div className="flex items-center gap-3">
              <StatusBadge status={message.status} />
              <PriorityBadge priority={message.priority} />
              <span className="ml-auto text-[11px] text-gray-400">
                {new Date(message.created_at).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as ContactMessageStatus)
                  }
                  className="w-full text-[13px] border border-[#E5E7EB] rounded-lg px-3 py-2 outline-none focus:border-[#068847] bg-white text-gray-700 cursor-pointer"
                >
                  {(Object.keys(STATUS_CONFIG) as ContactMessageStatus[]).map(
                    (s) => (
                      <option key={s} value={s}>
                        {STATUS_CONFIG[s].label}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as ContactMessagePriority)
                  }
                  className="w-full text-[13px] border border-[#E5E7EB] rounded-lg px-3 py-2 outline-none focus:border-[#068847] bg-white text-gray-700 cursor-pointer"
                >
                  {(
                    Object.keys(PRIORITY_CONFIG) as ContactMessagePriority[]
                  ).map((p) => (
                    <option key={p} value={p}>
                      {PRIORITY_CONFIG[p].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {mode === "edit" && (
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Admin Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Internal notes..."
                className="w-full text-[13px] border border-[#E5E7EB] rounded-lg px-3 py-2 outline-none focus:border-[#068847] bg-white text-gray-700 resize-none"
              />
            </div>
          )}

          {/* Admin notes display in view mode */}
          {mode === "view" && message.admin_notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide mb-1">
                Admin Notes
              </p>
              <p className="text-[13px] text-amber-800 leading-relaxed">
                {message.admin_notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between gap-3 sticky bottom-0 bg-white">
          <a
            href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject ?? "")}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-[13px] font-medium rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Mail size={13} /> Reply via Email
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-gray-600 border border-[#E5E7EB] rounded-lg hover:bg-[#F8F9FA] transition-colors cursor-pointer"
            >
              {mode === "view" ? "Close" : "Cancel"}
            </button>
            {mode === "edit" && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2 bg-[#068847] hover:bg-[#057a3e] text-white text-[13px] font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving…" : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DeleteModal
// ─────────────────────────────────────────────
export function DeleteModal({
  message,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  message: ContactMessage;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-[#E5E7EB] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-500 flex-shrink-0">
            <Trash2 size={18} />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">
              Delete Message
            </h2>
            <p className="text-[12px] text-gray-400">This cannot be undone</p>
          </div>
        </div>
        <p className="text-[13px] text-gray-600 mb-6">
          Are you sure you want to delete the message from{" "}
          <strong className="text-gray-900">{message.name}</strong>? This action
          is permanent.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[13px] font-medium text-gray-600 border border-[#E5E7EB] rounded-lg hover:bg-[#F8F9FA] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Toolbar
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// Toolbar
// ─────────────────────────────────────────────
export function Toolbar({
  search,
  onSearchChange, // Updates input value only
  onCommitSearch, // ← ONLY this triggers actual search/filter
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  onClear,
  total,
  showing,
  perPage,
  onPerPageChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  onCommitSearch: () => void; // Required: triggers search/filter
  statusFilter: ContactMessageStatus | "";
  onStatusChange: (v: string) => void;
  priorityFilter: ContactMessagePriority | "";
  onPriorityChange: (v: string) => void;
  onClear: () => void;
  total: number;
  showing: number;
  perPage: number;
  onPerPageChange: (v: number) => void;
}) {
  const hasFilters = !!(search || statusFilter || priorityFilter);
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onCommitSearch(); // Trigger search on Enter
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      onSearchChange(""); // Just clear input, no search trigger
      inputRef.current?.focus();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* 🔍 Search Section - Button-Triggered Only */}
          <div className="flex items-center gap-2 flex-1 min-w-0 max-w-md">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)} // ← Just updates state, NO filtering
                onKeyDown={handleKeyDown}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search by name, email…"
                className={`w-full pl-9 pr-9 py-2 text-[13px] border border-[#E5E7EB] rounded-lg outline-none bg-[#F8F9FA] text-gray-700 placeholder:text-gray-400 transition-all focus:border-[#068847] focus:ring-2 focus:ring-[#068847]/10 ${
                  searchFocused ? "w-[260px]" : "w-[220px]"
                }`}
              />

              {/* Clear button - just clears input, no search */}
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")} // ← Just clear, no trigger
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors rounded p-0.5"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 🔘 Search Button - ONLY trigger for filtering */}
            <button
              type="button"
              onClick={onCommitSearch} // ← This is the ONLY search trigger
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#068847] text-white text-[13px] font-medium hover:bg-[#057a3e] transition-colors whitespace-nowrap shrink-0"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-0.5">
            <button
              onClick={() => onStatusChange("")}
              className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                statusFilter === ""
                  ? "bg-white shadow-sm text-gray-800 border border-[#E5E7EB]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All
            </button>
            {(Object.keys(STATUS_CONFIG) as ContactMessageStatus[]).map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                    statusFilter === s
                      ? `${cfg.bg} ${cfg.text} border ${cfg.border} shadow-sm`
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {cfg.icon}
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Priority filter */}
          <div>
            {" "}
            <CustomSelect
              value={priorityFilter}
              onChange={onPriorityChange}
              options={[
                { label: "All Priorities", value: "" },
                ...(
                  Object.keys(PRIORITY_CONFIG) as ContactMessagePriority[]
                ).map((p) => ({
                  label: PRIORITY_CONFIG[p].label,
                  value: p,
                })),
              ]}
            />
          </div>

          {hasFilters && (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 text-[12px] px-3 py-2 border border-red-200 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer font-medium"
            >
              <X size={12} /> Clear All
            </button>
          )}
        </div>

        {/* Results count + per page */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[12px] text-gray-400">
            Showing <strong className="text-gray-600">{showing}</strong> of{" "}
            <strong className="text-gray-600">{total}</strong>
          </span>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="text-[12px] border border-[#E5E7EB] rounded-lg px-2 py-1.5 outline-none focus:border-[#068847] bg-[#F8F9FA] text-gray-600 cursor-pointer"
          >
            {[15, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Table helpers: SortTh, TableRow, LoadingSkeleton
// ─────────────────────────────────────────────
export function SortTh({
  col,
  label,
  sortKey,
  sortDir,
  onSort,
}: {
  col: SortKey;
  label: string;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  const active = sortKey === col;
  return (
    <th
      onClick={() => onSort(col)}
      className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 cursor-pointer select-none hover:text-gray-800 transition-colors whitespace-nowrap"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className={active ? "text-[#068847]" : "text-gray-300"}>
          {active && sortDir === "asc" ? (
            <ChevronUp size={13} />
          ) : (
            <ChevronDown size={13} />
          )}
        </span>
      </span>
    </th>
  );
}

export function TableRow({
  msg,
  onView,
  onEdit,
  onDelete,
}: {
  msg: ContactMessage;
  onView: (m: ContactMessage) => void;
  onEdit: (m: ContactMessage) => void;
  onDelete: (m: ContactMessage) => void;
}) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const statusCfg = STATUS_CONFIG[msg.status];
  const isUnread = msg.status === "new";

  return (
    <tr
      className={`border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors group ${statusCfg.rowBg} ${statusCfg.rowBorder}`}
    >
      {/* Sender */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                isUnread
                  ? "bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200"
                  : "bg-gradient-to-br from-[#E8FAF0] to-[#D1FAE5] border-[#A7F3D0]"
              }`}
            >
              <span
                className={`text-[11px] font-bold ${isUnread ? "text-blue-700" : "text-[#068847]"}`}
              >
                {msg.name.charAt(0).toUpperCase()}
              </span>
            </div>
            {isUnread && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <p
              className={`text-[13px] leading-tight ${isUnread ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}
            >
              {msg.name}
            </p>
            <p className="text-[11px] text-gray-400">{msg.email}</p>
          </div>
        </div>
      </td>

      {/* Phone */}
      <td className="px-4 py-3.5">
        {msg.phone ? (
          <a
            href={`tel:${msg.phone}`}
            className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Phone size={11} /> {msg.phone}
          </a>
        ) : (
          <span className="text-[12px] text-gray-300">—</span>
        )}
      </td>

      {/* Subject / Message */}
      <td className="px-4 py-3.5 max-w-[200px]">
        <p
          className={`text-[13px] truncate ${isUnread ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
        >
          {msg.subject}
        </p>
        <p className="text-[11px] text-gray-400 truncate">{msg.message}</p>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <StatusBadge status={msg.status} />
      </td>

      {/* Priority */}
      <td className="px-4 py-3.5">
        <PriorityBadge priority={msg.priority} />
      </td>

      {/* Date */}
      <td className="px-4 py-3.5 text-[12px] text-gray-500 whitespace-nowrap">
        {fmt(msg.created_at)}
      </td>

      {/* Actions — always visible */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1">
          {/* Email action */}
          <a
            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject ?? "")}`}
            title={`Email ${msg.email}`}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center"
          >
            <Mail size={14} />
          </a>
          <button
            onClick={() => onView(msg)}
            title="View"
            className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => onEdit(msg)}
            title="Edit"
            className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-[#068847] transition-colors cursor-pointer"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(msg)}
            title="Delete"
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-[#F3F4F6]">
          {Array.from({ length: 7 }).map((_, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className="h-4 bg-gray-100 rounded animate-pulse"
                style={{ width: `${60 + Math.random() * 30}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
