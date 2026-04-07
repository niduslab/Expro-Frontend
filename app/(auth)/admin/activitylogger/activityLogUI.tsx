"use client";

import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type SortKey = "created_at" | "log_name" | "causer_id";
export type SortDir = "asc" | "desc";

// ─── Constants ────────────────────────────────────────────────────────────────
export const LOG_NAME_COLORS: Record<
  string,
  { bg: string; color: string; border: string; dot: string }
> = {
  auth: {
    bg: "#EEF2FF",
    color: "#4338CA",
    border: "#C7D2FE",
    dot: "bg-[#4338CA]",
  },
  admin: {
    bg: "#FFFBEB",
    color: "#92400E",
    border: "#FDE68A",
    dot: "bg-[#F59E0B]",
  },
  default: {
    bg: "#F9FAFB",
    color: "#374151",
    border: "#E5E7EB",
    dot: "bg-gray-400",
  },
  system: {
    bg: "#F0FDFA",
    color: "#0F766E",
    border: "#99F6E4",
    dot: "bg-[#0D9488]",
  },
  payment: {
    bg: "#F7FEE7",
    color: "#3A5C11",
    border: "#BEF264",
    dot: "bg-[#65A30D]",
  },
  error: {
    bg: "#FFF1F2",
    color: "#9F1239",
    border: "#FECDD3",
    dot: "bg-[#E11D48]",
  },
  event: {
    bg: "#F5F3FF",
    color: "#6D28D9",
    border: "#DDD6FE",
    dot: "bg-[#7C3AED]",
  },
  branch: {
    bg: "#EFF6FF",
    color: "#1D4ED8",
    border: "#BFDBFE",
    dot: "bg-[#2563EB]",
  },
  blog_post: {
    bg: "#FDF2F8",
    color: "#9D174D",
    border: "#FBCFE8",
    dot: "bg-[#DB2777]",
  },
  user: {
    bg: "#F0FDF4",
    color: "#065F46",
    border: "#A7F3D0",
    dot: "bg-[#059669]",
  },
  project: {
    bg: "#FFFBEB",
    color: "#92400E",
    border: "#FDE68A",
    dot: "bg-[#D97706]",
  },
};

export const AVATAR_COLORS = [
  { bg: "#EEF2FF", color: "#4338CA" },
  { bg: "#F0FDF4", color: "#15803D" },
  { bg: "#FFF7ED", color: "#C2410C" },
  { bg: "#EFF6FF", color: "#1D4ED8" },
  { bg: "#FFFBEB", color: "#B45309" },
  { bg: "#F7FEE7", color: "#4D7C0F" },
  { bg: "#FDF2F8", color: "#9D174D" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function parseCauser(causer: any): {
  name: string;
  type: string;
  id: number | null;
  photo: string | null; // ✅ add this
} {
  if (!causer) return { name: "System", type: "System", id: null, photo: null };
  if (typeof causer === "object" && !Array.isArray(causer)) {
    const name =
      causer.name ||
      causer.email ||
      (causer.id ? `User #${causer.id}` : "System");
    const type = causer.type
      ? (causer.type.split("\\").pop() ?? causer.type)
      : "System";
    return { name, type, id: causer.id ?? null, photo: causer.photo ?? null }; // ✅ add photo
  }
  return { name: "System", type: "System", id: null, photo: null };
}

export function parseSubject(subject: any): {
  type: string | null;
  id: number | string | null;
  label: string | null;
} {
  if (!subject || Array.isArray(subject))
    return { type: null, id: null, label: null };
  return {
    type: subject.type
      ? (subject.type.split("\\").pop() ?? subject.type)
      : null,
    id: subject.id ?? null,
    label: subject.label ?? null,
  };
}

export function parseProperties(
  properties: any,
  changes: any,
  event: string | null | undefined,
): {
  before: Record<string, any> | null;
  after: Record<string, any> | null;
  snapshot: Record<string, any> | null;
} {
  if (!properties || Array.isArray(properties)) {
    return { before: null, after: null, snapshot: null };
  }
  if ("before" in properties || "after" in properties) {
    const before = Array.isArray(properties.before)
      ? null
      : ((properties.before as Record<string, any>) ?? null);
    const after = Array.isArray(properties.after)
      ? null
      : ((properties.after as Record<string, any>) ?? null);
    if (before && ("new" in before || "old" in before)) {
      return {
        before: Array.isArray(before.old) ? null : (before.old ?? null),
        after: Array.isArray(before.new) ? null : (before.new ?? null),
        snapshot: null,
      };
    }
    return { before, after, snapshot: null };
  }
  if ("new" in properties || "old" in properties) {
    return {
      before: Array.isArray(properties.old) ? null : (properties.old ?? null),
      after: Array.isArray(properties.new) ? null : (properties.new ?? null),
      snapshot: null,
    };
  }
  return { before: null, after: null, snapshot: properties };
}

export function diffObjects(
  before: Record<string, any> | null,
  after: Record<string, any> | null,
): { key: string; before: any; after: any }[] {
  if (!before || !after) return [];
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const diffs: { key: string; before: any; after: any }[] = [];
  keys.forEach((k) => {
    if (JSON.stringify(before[k]) !== JSON.stringify(after[k])) {
      diffs.push({ key: k, before: before[k], after: after[k] });
    }
  });
  return diffs;
}

// ─── Primitives ───────────────────────────────────────────────────────────────
export function Avatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const c = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div
      style={{ background: c.bg, color: c.color }}
      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ring-2 ring-white"
    >
      {initials}
    </div>
  );
}

export function LogNameBadge({ name }: { name: string }) {
  const key = name?.toLowerCase() ?? "default";
  const cfg = LOG_NAME_COLORS[key] ?? LOG_NAME_COLORS.default;
  const label = name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span
      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border"
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {label}
    </span>
  );
}

export function EventBadge({ event }: { event: string }) {
  const map: Record<
    string,
    { bg: string; color: string; border: string; icon: string }
  > = {
    created: { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0", icon: "+" },
    updated: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", icon: "~" },
    deleted: { bg: "#FFF1F2", color: "#9F1239", border: "#FECDD3", icon: "×" },
    logged_in: {
      bg: "#F5F3FF",
      color: "#5B21B6",
      border: "#DDD6FE",
      icon: "→",
    },
    logged_out: {
      bg: "#F9FAFB",
      color: "#374151",
      border: "#E5E7EB",
      icon: "←",
    },
  };
  const style = map[event] ?? {
    bg: "#F9FAFB",
    color: "#6B7280",
    border: "#E5E7EB",
    icon: "·",
  };
  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        borderColor: style.border,
      }}
      className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide"
    >
      <span className="text-[9px]">{style.icon}</span>
      {event.replace(/_/g, " ")}
    </span>
  );
}

export function SortChevron({
  active,
  dir,
}: {
  active: boolean;
  dir: SortDir;
}) {
  return (
    <span
      className={`inline-flex flex-col ml-1.5 opacity-60 ${active ? "opacity-100 text-[#068847]" : "text-gray-400"}`}
    >
      <svg
        width="7"
        height="5"
        viewBox="0 0 7 5"
        fill="currentColor"
        className={active && dir === "asc" ? "text-[#068847]" : "text-gray-300"}
      >
        <path d="M3.5 0L7 5H0z" />
      </svg>
      <svg
        width="7"
        height="5"
        viewBox="0 0 7 5"
        fill="currentColor"
        className={
          active && dir === "desc" ? "text-[#068847]" : "text-gray-300"
        }
      >
        <path d="M3.5 5L0 0H7z" />
      </svg>
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({
  label,
  value,
  sub,
  valueColor,
  icon,
  trend,
}: {
  label: string;
  value: string;
  sub: string;
  valueColor?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex flex-col gap-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-gray-400">
            {icon}
          </div>
        )}
      </div>
      <p
        className={`text-[26px] font-bold leading-none tracking-tight ${valueColor ?? "text-gray-900"}`}
      >
        {value}
      </p>
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-gray-400">{sub}</p>
        {trend && (
          <span
            className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${trend.value >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%{" "}
            {trend.label}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Modal value renderer ─────────────────────────────────────────────────────
export function renderValue(val: any): React.ReactNode {
  if (val === null || val === undefined)
    return (
      <span className="text-gray-300 italic text-[12px] font-mono">null</span>
    );
  if (typeof val === "boolean")
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${val ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}
      >
        {val ? "✓ true" : "✗ false"}
      </span>
    );
  if (typeof val === "number")
    return (
      <span className="text-[12px] font-semibold text-indigo-600 font-mono">
        {val}
      </span>
    );
  if (Array.isArray(val)) {
    if (val.length === 0)
      return (
        <span className="text-gray-300 italic text-[12px] font-mono">[ ]</span>
      );
    return (
      <div className="flex flex-wrap gap-1">
        {val.map((v, i) => (
          <span
            key={i}
            className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono"
          >
            {String(v)}
          </span>
        ))}
      </div>
    );
  }
  if (typeof val === "object") {
    return (
      <pre className="text-[11px] text-gray-500 font-mono bg-gray-50 rounded p-2 overflow-x-auto max-w-full whitespace-pre-wrap">
        {JSON.stringify(val, null, 2)}
      </pre>
    );
  }
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(val)) {
      const d = new Date(val);
      return (
        <span className="text-[12px] text-amber-700 font-medium">
          {d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          <span className="text-gray-400 mx-1">·</span>
          {d.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      );
    }
    if (val.startsWith("http")) {
      return (
        <a
          href={val}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-blue-600 underline underline-offset-2 hover:text-blue-800 break-all"
        >
          {val}
        </a>
      );
    }
    return <span className="text-[12px] text-gray-800 break-all">{val}</span>;
  }
  return (
    <span className="text-[12px] text-gray-500 italic font-mono">
      {JSON.stringify(val)}
    </span>
  );
}

// ─── Diff row ─────────────────────────────────────────────────────────────────
function DiffRow({
  label,
  before,
  after,
}: {
  label: string;
  before: any;
  after: any;
}) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 px-4 py-3 hover:bg-[#FAFAFA] border-b border-[#F3F4F6] last:border-b-0">
      <span className="text-[11px] font-medium text-gray-400 pt-0.5 capitalize truncate">
        {label.replace(/_/g, " ")}
      </span>
      <div className="flex flex-col gap-1.5">
        {before !== undefined && (
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded flex-shrink-0 leading-none pt-[3px]">
              WAS
            </span>
            <span className="flex-1 line-through text-gray-400 text-[12px]">
              {renderValue(before)}
            </span>
          </div>
        )}
        {after !== undefined && (
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded flex-shrink-0 leading-none pt-[3px]">
              NOW
            </span>
            <span className="flex-1 text-[12px]">{renderValue(after)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Properties Modal ─────────────────────────────────────────────────────────
export interface ModalLogData {
  properties: Record<string, any>;
  changes?: any;
  description: string;
  logName?: string;
  event?: string | null;
  ipAddress?: string | null;
  createdAt?: string;
  subject?: any;
  causer?: any;
}

const META_KEYS = [
  "id",
  "created_at",
  "updated_at",
  "deleted_at",
  "author_id",
  "category_id",
  "created_by",
  "project_id",
  "sponsor_id",
];

type ModalTab = "overview" | "changes" | "properties" | "metadata";

export function PropertiesModal({
  properties,
  changes,
  description,
  logName,
  event,
  ipAddress,
  createdAt,
  subject,
  causer,
  onClose,
}: ModalLogData & { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<ModalTab>("overview");

  const parsedSubject = parseSubject(subject);
  const parsedCauser = parseCauser(causer);
  const { before, after, snapshot } = parseProperties(
    properties,
    changes,
    event,
  );
  const diffs = diffObjects(before, after);
  const hasDiff = diffs.length > 0;

  const mainObj = snapshot ?? after ?? before;
  const mainEntries = mainObj
    ? Object.entries(mainObj).filter(([k]) => !META_KEYS.includes(k))
    : [];
  const metaEntries = mainObj
    ? Object.entries(mainObj).filter(([k]) => META_KEYS.includes(k))
    : [];

  const tabs: { id: ModalTab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    ...(hasDiff
      ? [{ id: "changes" as ModalTab, label: "Changes", count: diffs.length }]
      : []),
    ...(mainEntries.length > 0
      ? [
          {
            id: "properties" as ModalTab,
            label: "Properties",
            count: mainEntries.length,
          },
        ]
      : []),
    ...(metaEntries.length > 0
      ? [
          {
            id: "metadata" as ModalTab,
            label: "Metadata",
            count: metaEntries.length,
          },
        ]
      : []),
  ];

  const eventColors: Record<string, string> = {
    created: "#15803D",
    updated: "#1D4ED8",
    deleted: "#9F1239",
    logged_in: "#5B21B6",
    logged_out: "#374151",
  };
  const eventColor = event ? (eventColors[event] ?? "#374151") : "#374151";

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#F3F4F6]">
          <div className="flex items-start gap-3 min-w-0">
            {event && (
              <div
                style={{ background: `${eventColor}15`, color: eventColor }}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[15px] font-bold flex-shrink-0 mt-0.5"
              >
                {event === "created"
                  ? "+"
                  : event === "deleted"
                    ? "×"
                    : event === "updated"
                      ? "~"
                      : "→"}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-gray-900 leading-snug truncate pr-4">
                {description}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {logName && <LogNameBadge name={logName} />}
                {event && <EventBadge event={event} />}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-colors cursor-pointer flex-shrink-0"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 px-6 pt-3 border-b border-[#F3F4F6]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-t-lg border-b-2 -mb-px transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#068847] text-[#068847] bg-[#F0FDF4]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-[#068847] text-white" : "bg-gray-100 text-gray-500"}`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1">
          {/* Overview tab */}
          {activeTab === "overview" && (
            <div className="p-6 space-y-4">
              {/* Causer & Subject cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#E5E7EB] p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Performed By
                  </p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#EEF2FF] text-[#4338CA] flex items-center justify-center text-[13px] font-bold">
                      {parsedCauser.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900">
                        {parsedCauser.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {parsedCauser.type}
                        {parsedCauser.id ? ` · #${parsedCauser.id}` : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {parsedSubject.type && (
                  <div className="rounded-xl border border-[#E5E7EB] p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Affected Record
                    </p>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#F5F3FF] text-[#6D28D9] flex items-center justify-center text-[13px] font-bold">
                        {parsedSubject.type.slice(0, 1)}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-900">
                          {parsedSubject.type}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {parsedSubject.label &&
                          parsedSubject.label !== String(parsedSubject.id)
                            ? parsedSubject.label
                            : parsedSubject.id
                              ? `ID: ${parsedSubject.id}`
                              : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Meta details grid */}
              <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
                <div className="px-4 py-2.5 bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Event Details
                  </p>
                </div>
                <div className="">
                  {[
                    {
                      label: "Timestamp",
                      value: createdAt
                        ? new Date(createdAt).toLocaleString("en-US", {
                            dateStyle: "long",
                            timeStyle: "medium",
                          })
                        : "—",
                    },
                    {
                      label: "IP Address",
                      value: ipAddress ?? "—",
                      mono: true,
                    },
                    {
                      label: "Channel",
                      value: logName,
                      badge: logName ? <LogNameBadge name={logName} /> : null,
                    },
                    {
                      label: "Event Type",
                      value: event,
                      badge: event ? <EventBadge event={event} /> : null,
                    },
                  ].map(({ label, value, mono, badge }) => (
                    <div
                      key={label}
                      className="flex items-center gap-4 px-4 py-2.5"
                    >
                      <span className="text-[12px] text-gray-400 w-[110px] flex-shrink-0">
                        {label}
                      </span>
                      {badge ?? (
                        <span
                          className={`text-[12px] text-gray-800 ${mono ? "font-mono" : ""}`}
                        >
                          {value ?? "—"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick summary if there are changes */}
              {hasDiff && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-[12px] font-semibold text-amber-800 mb-1">
                    {diffs.length} field{diffs.length !== 1 ? "s" : ""} changed
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {diffs.map(({ key }) => (
                      <span
                        key={key}
                        className="text-[11px] bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-medium"
                      >
                        {key.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab("changes")}
                    className="mt-2.5 text-[12px] text-amber-700 font-semibold underline underline-offset-2 cursor-pointer"
                  >
                    View all changes →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Changes tab */}
          {activeTab === "changes" && (
            <div className="p-4">
              {hasDiff ? (
                <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Field Changes
                    </p>
                    <span className="text-[11px] text-gray-400">
                      {diffs.length} field{diffs.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {diffs.map(({ key, before: b, after: a }) => (
                    <DiffRow key={key} label={key} before={b} after={a} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400 text-[13px]">
                  No changes recorded
                </div>
              )}
            </div>
          )}

          {/* Properties tab */}
          {activeTab === "properties" && (
            <div className="p-4">
              {mainEntries.length > 0 ? (
                <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {event === "deleted"
                        ? "Deleted Record"
                        : event === "created"
                          ? "Created Record"
                          : "Properties"}
                    </p>
                  </div>
                  <div className="">
                    {mainEntries.map(([key, val]) => (
                      <div
                        key={key}
                        className="flex items-center justify-center gap-4 px-4 py-2.5 hover:bg-[#FAFAFA]"
                      >
                        <span className="text-[11px] font-medium text-gray-400 w-[130px] flex-shrink-0 pt-0.5 capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="flex-1 min-w-0">
                          {renderValue(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400 text-[13px]">
                  No properties recorded
                </div>
              )}
            </div>
          )}

          {/* Metadata tab */}
          {activeTab === "metadata" && (
            <div className="p-4">
              {metaEntries.length > 0 ? (
                <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      System Metadata
                    </p>
                  </div>
                  <div className="">
                    {metaEntries.map(([key, val]) => (
                      <div
                        key={key}
                        className="flex items-center justify-center gap-4 px-4 py-2.5 hover:bg-[#FAFAFA]"
                      >
                        <span className="text-[11px] font-medium text-gray-400 w-[130px] flex-shrink-0 pt-0.5 capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="flex-1 min-w-0">
                          {renderValue(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400 text-[13px]">
                  No metadata recorded
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-3 border-t border-[#F3F4F6] flex items-center justify-between bg-[#F9FAFB]">
          <span className="text-[11px] text-gray-400">
            {createdAt &&
              new Date(createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-[12px] font-medium text-gray-600 bg-white border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
export function DownloadIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function RefreshIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

export function EyeIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
