"use client";

import {
  ActivityLogPagination,
  ActivityLog,
} from "@/lib/types/admin/ActivityLoggerType";
import Pagination from "@/components/pagination/page";
import {
  Avatar,
  LogNameBadge,
  SortChevron,
  EyeIcon,
  SortKey,
  SortDir,
  ModalLogData,
} from "./activityLogUI";

// ─── Toolbar ──────────────────────────────────────────────────────────────────
interface ActivityLogToolbarProps {
  search: string;
  logNameFilter: string;
  dateFilter: string;
  total: number;
  showing: number;
  onSearchChange: (v: string) => void;
  onLogNameChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onClear: () => void;
}

export function ActivityLogToolbar({
  search,
  logNameFilter,
  dateFilter,
  total,
  showing,
  onSearchChange,
  onLogNameChange,
  onDateChange,
  onClear,
}: ActivityLogToolbarProps) {
  const hasFilters = !!(search || logNameFilter || dateFilter);

  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB]">
      <div className="p-4 flex flex-col sm:flex-row gap-3 items-center">
        {/* Search — no button, just icon inside input */}
        <div className="relative flex-1 w-full">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search description, log name…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-[7px] text-[13px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] transition-colors placeholder:text-gray-400"
          />
          {/* Clear ×  inside input when there's text */}
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={logNameFilter}
            onChange={(e) => onLogNameChange(e.target.value)}
            className="text-[12px] px-2 py-[6px] border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] cursor-pointer text-gray-700"
          >
            <option value="">All Channels</option>
            <option value="default">Default</option>
            <option value="auth">Auth</option>
            <option value="admin">Admin</option>
            <option value="system">System</option>
            <option value="payment">Payment</option>
            <option value="error">Error</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className="text-[12px] px-2 py-[6px] border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] cursor-pointer text-gray-700"
          />

          {hasFilters && (
            <button
              onClick={onClear}
              className="text-[12px] px-2.5 py-[6px] border border-[#FBBF24] text-[#92400E] bg-[#FEF3C7] rounded-lg hover:bg-[#FDE68A] transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}

          <span className="text-[12px] text-gray-500 ml-1 hidden sm:inline whitespace-nowrap">
            {showing} of {total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
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
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table
          className="w-full text-[13px]"
          style={{ borderCollapse: "separate", borderSpacing: 0 }}
        >
          {/* Head */}
          <thead className="bg-[#F9FAFB]">
            <tr>
              {/* border only on bottom of header, no double lines */}
              {[
                { label: "IP / AGENT", key: null, width: "min-w-[130px]" },
                { label: "CHANNEL", key: "log_name", width: "min-w-[120px]" },
                { label: "DESCRIPTION", key: null, width: "min-w-[260px]" },
                { label: "SUBJECT", key: null, width: "min-w-[130px]" },
                { label: "CAUSER", key: "causer_id", width: "min-w-[150px]" },
                { label: "TIME", key: "created_at", width: "min-w-[180px]" },
                {
                  label: "DETAILS",
                  key: null,
                  width: "w-[70px]",
                  center: true,
                },
              ].map(({ label, key, width, center }) => (
                <th
                  key={label}
                  onClick={key ? () => onSort(key as SortKey) : undefined}
                  className={[
                    "px-4 py-3 text-[11px] font-medium text-gray-500 uppercase tracking-wider border-b border-[#E5E7EB]",
                    center ? "text-center" : "text-left",
                    key
                      ? "cursor-pointer select-none hover:text-gray-800 transition-colors"
                      : "",
                    width,
                  ].join(" ")}
                >
                  {label}
                  {key && (
                    <SortChevron active={sortKey === key} dir={sortDir} />
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body — use border-b only (no border-t on next row) to avoid thick lines */}
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F3F4F6]">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3.5 bg-[#F3F4F6] rounded animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              : logs.map((log, index) => {
                  const causerName =
                    (log.causer as any)?.name ||
                    (log.causer as any)?.email ||
                    (log.causer_id ? `User #${log.causer_id}` : "System");
                  const causerType = log.causer_type
                    ? (log.causer_type.split("\\").pop() ?? log.causer_type)
                    : "System";
                  const subjectType = log.subject_type
                    ? (log.subject_type.split("\\").pop() ?? log.subject_type)
                    : null;

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

                  return (
                    <tr
                      key={log.id}
                      className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#FAFAFA] transition-colors"
                    >
                      {/* IP / Agent */}
                      <td className="px-4 py-3">
                        <p className="text-[12px] font-medium text-gray-900 font-mono leading-snug">
                          {log.ip_address ?? "—"}
                        </p>
                        <p
                          className="text-[11px] text-gray-400 truncate max-w-[120px] leading-snug"
                          title={log.user_agent ?? ""}
                        >
                          {log.user_agent
                            ? log.user_agent.slice(0, 24) +
                              (log.user_agent.length > 24 ? "…" : "")
                            : "—"}
                        </p>
                      </td>

                      {/* Channel */}
                      <td className="px-4 py-3">
                        <LogNameBadge name={log.log_name} />
                        {log.event && (
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                            {log.event}
                          </p>
                        )}
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3">
                        <p className="text-[12px] text-gray-800 line-clamp-2 max-w-[260px] leading-relaxed">
                          {log.description}
                        </p>
                      </td>

                      {/* Subject */}
                      <td className="px-4 py-3">
                        {subjectType ? (
                          <>
                            <p className="text-[12px] font-medium text-gray-800 leading-snug">
                              {subjectType}
                            </p>
                            <p className="text-[11px] text-gray-400 leading-snug">
                              ID: {log.subject_id ?? "—"}
                            </p>
                          </>
                        ) : (
                          <span className="text-[12px] text-gray-300">—</span>
                        )}
                      </td>

                      {/* Causer */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={causerName} index={index} />
                          <div className="min-w-0">
                            <p className="text-[12px] font-medium text-gray-800 truncate max-w-[100px] leading-snug">
                              {causerName}
                            </p>
                            <p className="text-[11px] text-gray-400 leading-snug">
                              {causerType}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Time — wider, single line each */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-[12px] text-gray-800 leading-snug">
                          {datePart}
                        </p>
                        <p className="text-[11px] text-gray-400 leading-snug">
                          {timePart}
                        </p>
                      </td>

                      {/* Details */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            onViewDetail({
                              properties: log.properties,
                              description: log.description,
                              logName: log.log_name,
                              event: log.event,
                              ipAddress: log.ip_address,
                              createdAt: log.created_at,
                            })
                          }
                          title="View details"
                          className="w-[26px] h-[26px] rounded-lg border border-[#E5E7EB] bg-transparent inline-flex items-center justify-center text-gray-500 hover:bg-[#F0FDF4] hover:text-[#068847] hover:border-[#068847] transition-colors cursor-pointer"
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

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-[#E5E7EB]">
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
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="text-[12px] px-2 py-1 border border-[#E5E7EB] rounded-lg bg-white focus:outline-none cursor-pointer text-gray-700"
          >
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
            <option value={200}>200 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
