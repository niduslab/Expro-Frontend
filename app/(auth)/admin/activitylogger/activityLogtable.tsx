"use client";

import {
  ActivityLogPagination,
  ActivityLog,
} from "@/lib/types/admin/ActivityLoggerType";
import Pagination from "@/components/pagination/page";
import {
  Avatar,
  LogNameBadge,
  EventBadge,
  SortChevron,
  EyeIcon,
  SortKey,
  SortDir,
  ModalLogData,
  parseCauser,
  parseSubject,
} from "./activityLogUI";
import { Search, X, Filter, Calendar, Layers } from "lucide-react";
import CustomSelect from "@/components/admin/CustomSelect";
import DatePicker from "@/components/ui/date-picker";
import Image from "next/image";

// ─── Toolbar ──────────────────────────────────────────────────────────────────
interface ActivityLogToolbarProps {
  search: string;
  logNameFilter: string;
  dateFilter: string;
  total: number;
  showing: number;
  onSearchSubmit: () => void;
  onSearchChange: (v: string) => void;
  onLogNameChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onClear: () => void;
  perPage: number;
  onPerPageChange: (v: number) => void;
}

const CHANNEL_OPTIONS = [
  { label: "All Channels", value: "" },
  { label: "Event", value: "event" },
  { label: "Branch", value: "branch" },
  { label: "Blog Post", value: "blog_post" },
  { label: "User", value: "user" },
  { label: "Project", value: "project" },
  { label: "Auth", value: "auth" },
  { label: "Admin", value: "admin" },
  { label: "System", value: "system" },
  { label: "Payment", value: "payment" },
  { label: "Error", value: "error" },
];

export function ActivityLogToolbar({
  search,
  logNameFilter,
  dateFilter,
  total,
  showing,
  onSearchChange,
  onSearchSubmit,
  onLogNameChange,
  onDateChange,
  onClear,
  perPage,
  onPerPageChange,
}: ActivityLogToolbarProps) {
  const hasActiveFilters = search || logNameFilter || dateFilter;

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* ── Search ── */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative flex items-center flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearchSubmit();
              }}
              placeholder="Search logs, descriptions, channels…"
              className="pl-9 pr-8 h-9 w-full cursor-pointer rounded-lg border border-[#E5E7EB] bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] transition-all"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={onSearchSubmit}
            className="flex items-center cursor-pointer gap-1.5 px-4 h-9 rounded-lg bg-[#068847] hover:bg-[#057a3e] text-white text-sm font-medium transition-colors whitespace-nowrap shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            Search
          </button>
        </div>

        {/* ── Filters ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
            <Filter className="w-3 h-3" />
            Filters
          </div>

          <div className="w-[155px]">
            <CustomSelect
              value={logNameFilter}
              onChange={onLogNameChange}
              options={CHANNEL_OPTIONS}
            />
          </div>

          <div className="w-[148px]">
            <DatePicker value={dateFilter} onChange={(v) => onDateChange(v)} />
          </div>
          <div className="w-[130px]">
            <CustomSelect
              value={String(perPage)}
              onChange={(v) => onPerPageChange(Number(v))}
              options={[
                { label: "25 / page", value: "25" },
                { label: "50 / page", value: "50" },
                { label: "100 / page", value: "100" },
                { label: "200 / page", value: "200" },
              ]}
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 text-[12px] text-gray-500 hover:text-red-600 border border-[#E5E7EB] hover:border-red-200 hover:bg-red-50 px-2.5 h-9 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {/* ── Count ── */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 h-9 whitespace-nowrap">
          <Layers className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[12px] text-gray-500 font-medium">
            <span className="text-gray-800">{showing.toLocaleString()}</span>
            <span className="text-gray-400"> / </span>
            <span className="text-gray-800">{total.toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Column Header Cell ───────────────────────────────────────────────────────
function TH({
  label,
  sub,
  icon,
  sortKey: sk,
  currentSortKey,
  sortDir,
  onSort,
  width,
  center,
}: {
  label: string;
  sub?: string;
  icon?: React.ReactNode;
  sortKey?: SortKey;
  currentSortKey: SortKey;
  sortDir: SortDir;
  onSort: (k: SortKey) => void;
  width?: string;
  center?: boolean;
}) {
  const active = sk ? currentSortKey === sk : false;
  return (
    <th
      onClick={sk ? () => onSort(sk) : undefined}
      className={[
        "px-4 py-3 border-b border-[#E5E7EB] align-bottom",
        center ? "text-center" : "text-left",
        sk ? "cursor-pointer select-none group" : "",
        active ? "bg-[#F0FDF4]" : "bg-[#F9FAFB]",
        width ?? "",
      ].join(" ")}
    >
      <div
        className={`flex items-start gap-1.5 ${center ? "justify-center" : ""}`}
      >
        {/* {icon && (
          <span className="text-gray-400 group-hover:text-gray-600 transition-colors mb-0.5">
            {icon}
          </span>
        )} */}
        <div>
          <div className="flex items-center gap-1">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${active ? "text-[#068847]" : "text-gray-500 group-hover:text-gray-700"}`}
            >
              {label}
            </span>
            {sk && <SortChevron active={active} dir={sortDir} />}
          </div>
          {sub && (
            <p className="text-[10px] text-gray-400 font-normal normal-case tracking-normal mt-0.5">
              {sub}
            </p>
          )}
        </div>
      </div>
    </th>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
interface ActivityLogTableProps {
  logs: ActivityLog[];
  isLoading: boolean;
  sortKey: SortKey;
  sortDir: SortDir;
  pagination: ActivityLogPagination | null;
  page: number;
  perPage: number;
  onSort: (key: SortKey) => void;
  onViewDetail: (data: ModalLogData) => void;
  onPageChange: (p: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onPerPageChange: (v: number) => void;
}

export function ActivityLogTable({
  logs,
  isLoading,
  sortKey,
  sortDir,
  pagination,
  page,
  perPage,
  onSort,
  onViewDetail,
  onPageChange,
  onNext,
  onPrev,
  onPerPageChange,
}: ActivityLogTableProps) {
  const thProps = { currentSortKey: sortKey, sortDir, onSort };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table
          className="w-full text-[13px]"
          style={{ borderCollapse: "separate", borderSpacing: 0 }}
        >
          {/* ── Header ── */}
          <thead>
            <tr className="">
              <TH
                label="Actor"
                sub="Who triggered"
                icon={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                }
                width="min-w-[170px]"
                {...thProps}
                sortKey="causer_id"
              />
              <TH
                label="Channel & Event"
                sub="Log name · action"
                icon={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                }
                width="min-w-[150px]"
                {...thProps}
                sortKey="log_name"
              />
              <TH
                label="Description"
                sub="Activity summary"
                icon={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                }
                width="min-w-[220px]"
                {...thProps}
              />
              <TH
                label="Affected Record"
                sub="Type · identifier"
                icon={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 9h6M9 12h6M9 15h4" />
                  </svg>
                }
                width="min-w-[140px]"
                {...thProps}
              />
              <TH
                label="Network"
                sub="IP · user agent"
                icon={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                }
                width="min-w-[130px]"
                {...thProps}
              />
              <TH
                label="Timestamp"
                sub="Date · time"
                icon={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                }
                width="min-w-[140px]"
                {...thProps}
                sortKey="created_at"
              />
              <TH label="View" width="w-[60px]" center {...thProps} />
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F3F4F6]">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div
                          className="h-3.5 bg-[#F3F4F6] rounded-full animate-pulse"
                          style={{ width: `${50 + Math.random() * 30}%` }}
                        />
                        {j < 3 && (
                          <div
                            className="h-2.5 bg-[#F9FAFB] rounded-full animate-pulse mt-1.5"
                            style={{ width: `${30 + Math.random() * 25}%` }}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              : logs.map((log, index) => {
                  const causer = parseCauser((log as any).causer ?? log);
                  const subject = parseSubject((log as any).subject);

                  const dt = new Date(log.created_at);
                  const datePart = dt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const timePart = dt.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  // Determine row accent based on event
                  const rowAccents: Record<string, string> = {
                    deleted: "hover:bg-red-50/40 border-l-2 border-l-red-200",
                    created:
                      "hover:bg-green-50/40 border-l-2 border-l-green-200",
                    updated: "hover:bg-blue-50/40",
                  };
                  const rowClass = log.event
                    ? (rowAccents[log.event] ?? "hover:bg-[#FAFAFA]")
                    : "hover:bg-[#FAFAFA]";

                  return (
                    <tr
                      key={log.id}
                      className={`border-b border-[#F3F4F6] last:border-b-0 transition-colors ${rowClass}`}
                    >
                      {/* Actor / Causer */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Image
                            src={(() => {
                              const rawPhoto = causer.photo;
                              const fallback =
                                "/images/dashboard/memberApproval/1.jpg";

                              // 1. Check if photo exists and is a valid string
                              if (
                                !rawPhoto ||
                                typeof rawPhoto !== "string" ||
                                rawPhoto.trim() === ""
                              ) {
                                return fallback;
                              }

                              // 2. If it's already an absolute URL, return as is
                              if (
                                rawPhoto.startsWith("http://") ||
                                rawPhoto.startsWith("https://")
                              ) {
                                return rawPhoto;
                              }

                              // 3. If it's a relative path, ensure it starts with '/'
                              //    This fixes "membershipapplication/..." -> "/membershipapplication/..."
                              return rawPhoto.startsWith("/")
                                ? rawPhoto
                                : `/${rawPhoto}`;
                            })()}
                            alt={causer.name || "User"}
                            width={32}
                            height={32}
                            className="rounded-full object-cover w-8 h-8 flex-shrink-0"
                            unoptimized={!!causer.photo?.startsWith("http")}
                          />
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-gray-900 truncate max-w-[110px] leading-snug">
                              {causer.name}
                            </p>
                            <p className="text-[11px] text-gray-400 leading-snug">
                              {causer.type}
                              {causer.id ? ` · #${causer.id}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Channel + Event */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <LogNameBadge name={log.log_name} />
                          {log.event && <EventBadge event={log.event} />}
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3 max-w-[240px]">
                        <p className="text-[12px] text-gray-700 line-clamp-2 leading-relaxed">
                          {log.description}
                        </p>
                      </td>

                      {/* Subject / Affected Record */}
                      <td className="px-4 py-3">
                        {subject.type ? (
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-md bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-center text-[10px] font-bold text-[#6D28D9] flex-shrink-0 mt-0.5">
                              {subject.type.slice(0, 1)}
                            </div>
                            <div>
                              <p className="text-[12px] font-semibold text-gray-800 leading-snug">
                                {subject.type}
                              </p>
                              <p className="text-[11px] text-gray-400 leading-snug">
                                {subject.label &&
                                subject.label !== String(subject.id)
                                  ? subject.label
                                  : subject.id
                                    ? `ID: ${subject.id}`
                                    : "—"}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[12px] text-gray-300">
                            No record
                          </span>
                        )}
                      </td>

                      {/* Network */}
                      <td className="px-4 py-3">
                        <p className="text-[12px] font-mono font-medium text-gray-800 leading-snug">
                          {log.ip_address ?? (
                            <span className="text-gray-300 font-sans font-normal">
                              Unknown
                            </span>
                          )}
                        </p>
                        <p
                          className="text-[11px] text-gray-400 truncate max-w-[110px] leading-snug mt-0.5"
                          title={log.user_agent ?? ""}
                        >
                          {log.user_agent
                            ? log.user_agent.slice(0, 22) +
                              (log.user_agent.length > 22 ? "…" : "")
                            : "—"}
                        </p>
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-[12px] font-medium text-gray-800 leading-snug">
                          {datePart}
                        </p>
                        <p className="text-[11px] text-gray-400 font-mono leading-snug">
                          {timePart}
                        </p>
                      </td>

                      {/* Details button */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            onViewDetail({
                              properties: (log as any).properties ?? {},
                              changes: (log as any).changes,
                              description: log.description,
                              logName: log.log_name,
                              event: log.event,
                              ipAddress: log.ip_address,
                              createdAt: log.created_at,
                              subject: (log as any).subject,
                              causer: (log as any).causer,
                            })
                          }
                          title="View details"
                          className="w-7 h-7 rounded-lg border border-[#E5E7EB] bg-transparent inline-flex items-center justify-center text-gray-400 hover:bg-[#F0FDF4] hover:text-[#068847] hover:border-[#068847] transition-all cursor-pointer hover:shadow-sm"
                        >
                          <EyeIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="px-4 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Pagination
            page={page}
            perPage={perPage}
            total={pagination?.total}
            dataLength={logs.length}
            onNext={onNext}
            onPrev={onPrev}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
}
