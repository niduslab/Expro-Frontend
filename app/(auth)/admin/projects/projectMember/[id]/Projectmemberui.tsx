"use client";

// components/projectMember/ProjectMemberUI.tsx
// Shared presentational primitives used across the project member feature.

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react";
import { X } from "lucide-react";

import { useUsers } from "@/lib/hooks/admin/useUsers";
import { ROLE_CONFIG, STATUS_CONFIG } from "./constent";
import type {
  ProjectMemberRole,
  ProjectMemberStatus,
} from "@/lib/types/admin/projectMemberType";

// ─── RoleBadge ────────────────────────────────────────────────────────────────

export function RoleBadge({ role }: { role: ProjectMemberRole }) {
  const cfg = ROLE_CONFIG[role];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: ProjectMemberStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── CustomSelect ─────────────────────────────────────────────────────────────

export function CustomSelect({
  value,
  onChange,
  options,
  error,
  placeholder = "Select...",
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  error?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
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
        className={`w-full h-[42px] border rounded-lg px-4 bg-white flex items-center justify-between text-sm focus:outline-none transition ${
          error
            ? "border-red-400 focus:ring-1 focus:ring-red-400"
            : open
              ? "border-emerald-500 ring-1 ring-emerald-500"
              : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className={selected ? "text-slate-800" : "text-slate-400"}>
          {selected?.label ?? placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
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
        <ul className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-auto max-h-52">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition ${
                opt.value === value
                  ? "bg-emerald-50 text-emerald-800 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
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

// ─── UserCombobox ─────────────────────────────────────────────────────────────

export function UserCombobox({
  value,
  onChange,
  error,
}: {
  value: number | null;
  onChange: (id: number) => void;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const ref = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useUsers({ page, per_page: 10 });
  const users = data?.data ?? [];
  const selectedUser = users.find((u: any) => u.id === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = users.filter(
    (u: any) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full h-[42px] border rounded-lg px-4 bg-white flex items-center justify-between text-sm focus:outline-none transition ${
          error
            ? "border-red-400"
            : open
              ? "border-emerald-500 ring-1 ring-emerald-500"
              : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>
          {selectedUser
            ? `${selectedUser?.member?.name_english} (${selectedUser.email})`
            : "Select user..."}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
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
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-md">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="text-sm bg-transparent outline-none flex-1 text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-6 flex justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            </div>
          ) : (
            <ul className="max-h-48 overflow-auto">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate-400 text-center">
                  No users found
                </li>
              ) : (
                filtered.map((u: any) => (
                  <li
                    key={u.id}
                    onClick={() => {
                      onChange(u.id);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`px-4 py-2.5 text-sm cursor-pointer transition ${
                      u.id === value
                        ? "bg-emerald-50 text-emerald-800 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-slate-400">{u.email}</div>
                  </li>
                ))
              )}
            </ul>
          )}

          {data?.pagination && data.pagination.last_page > 1 && (
            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40"
              >
                ‹ Prev
              </button>
              <span>
                {page} / {data.pagination.last_page}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(data.pagination.last_page, p + 1))
                }
                disabled={page === data.pagination.last_page}
                className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40"
              >
                Next ›
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export function Pagination({
  page,
  perPage,
  total,
  dataLength,
  onNext,
  onPrev,
  onPageChange,
}: {
  page: number;
  perPage: number;
  total?: number;
  dataLength: number;
  onNext: () => void;
  onPrev: () => void;
  onPageChange?: (page: number) => void;
}) {
  const totalPages = total ? Math.ceil(total / perPage) : undefined;
  const hasNext = total ? page < totalPages! : dataLength === perPage;

  const getPages = () => {
    if (!totalPages) return [];
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
      {total && (
        <p className="text-sm text-slate-500">
          Page <span className="font-medium text-slate-700">{page}</span> of{" "}
          <span className="font-medium text-slate-700">{totalPages}</span> —{" "}
          <span className="font-medium text-slate-700">{total}</span> total
        </p>
      )}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </button>

        {getPages().map((p, idx) =>
          p === "..." ? (
            <span key={`e-${idx}`} className="px-1.5 text-slate-400 text-sm">
              …
            </span>
          ) : (
            <button
              key={`p-${p}`}
              onClick={() => onPageChange?.(p as number)}
              className={`w-8 h-8 text-sm font-medium rounded-lg border transition ${
                p === page
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 transition"
        >
          Next <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

export function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
