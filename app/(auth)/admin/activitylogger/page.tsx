"use client";

import { useState, useMemo } from "react";
import { useActivityLogs } from "@/lib/hooks/admin/useActivityLogger";
import { ActivityLogToolbar, ActivityLogTable } from "./activityLogtable";
import {
  StatCard,
  PropertiesModal,
  DownloadIcon,
  RefreshIcon,
} from "./activityLogUI";
import type { SortKey, SortDir, ModalLogData } from "./activityLogUI";

export default function ActivityLogPage() {
  // ── Filter state ──
  const [search, setSearch] = useState("");
  const [logNameFilter, setLogNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  // ── Sort state ──
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // ── Modal state ──
  const [detailLog, setDetailLog] = useState<ModalLogData | null>(null);

  // ── Data ──
  const { logs, pagination, isLoading, isError, error, setFilters, refetch } =
    useActivityLogs({
      page,
      per_page: perPage,
      search: search || undefined,
      log_name: logNameFilter || undefined,
      created_at: dateFilter || undefined,
    });

  // ── Client-side sort ──
  const sorted = useMemo(() => {
    return [...logs].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "created_at")
        cmp =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      else if (sortKey === "log_name")
        cmp = (a.log_name ?? "").localeCompare(b.log_name ?? "");
      else if (sortKey === "causer_id")
        cmp = (a.causer_id ?? 0) - (b.causer_id ?? 0);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [logs, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // ── Stats ──
  const stats = useMemo(() => {
    const total = pagination?.total ?? logs.length;
    const byName = logs.reduce<Record<string, number>>((acc, l) => {
      acc[l.log_name] = (acc[l.log_name] ?? 0) + 1;
      return acc;
    }, {});
    const topChannel =
      Object.entries(byName).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const uniqueCausers = new Set(logs.map((l) => l.causer_id).filter(Boolean))
      .size;
    return { total, topChannel, uniqueCausers, authCount: byName["auth"] ?? 0 };
  }, [logs, pagination]);

  // ── Filter helpers ──
  function syncFilters(patch: object) {
    setFilters({
      search,
      log_name: logNameFilter,
      created_at: dateFilter,
      page,
      per_page: perPage,
      ...patch,
    });
  }

  function resetFilters() {
    setSearch("");
    setLogNameFilter("");
    setDateFilter("");
    setPage(1);
    setFilters({
      search: "",
      log_name: "",
      created_at: "",
      page: 1,
      per_page: perPage,
    });
  }

  function handleSearchChange(v: string) {
    setSearch(v);
    setPage(1);
    syncFilters({ search: v, page: 1 });
  }
  function handleLogNameChange(v: string) {
    setLogNameFilter(v);
    setPage(1);
    syncFilters({ log_name: v, page: 1 });
  }
  function handleDateChange(v: string) {
    setDateFilter(v);
    setPage(1);
    syncFilters({ created_at: v, page: 1 });
  }
  function handlePageChange(p: number) {
    setPage(p);
    syncFilters({ page: p });
  }
  function handlePerPageChange(v: number) {
    setPerPage(v);
    setPage(1);
    syncFilters({ per_page: v, page: 1 });
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[1400px] mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-[22px] font-medium text-gray-900">
                Activity Logs
              </p>
              <p className="text-[13px] text-gray-500 mt-0.5">
                System-wide audit trail · Updated just now
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refetch}
                className="flex items-center gap-1.5 text-[12px] px-3 py-[5px] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors cursor-pointer text-gray-700"
              >
                <RefreshIcon /> Refresh
              </button>
              <button className="flex items-center gap-1.5 text-[12px] px-3 py-[5px] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors cursor-pointer text-gray-700">
                <DownloadIcon /> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Logs"
            value={(stats.total ?? 0).toLocaleString()}
            sub="All time entries"
            valueColor="text-[#068847]"
          />
          <StatCard
            label="Auth Events"
            value={stats.authCount.toString()}
            sub="Login / logout activity"
          />
          <StatCard
            label="Active Users"
            value={stats.uniqueCausers.toString()}
            sub="Unique causers (this page)"
            valueColor="text-[#185FA5]"
          />
          <StatCard
            label="Top Channel"
            value={stats.topChannel}
            sub="Most active log name"
            valueColor="text-[#854F0B]"
          />
        </div>

        {/* Toolbar */}
        <ActivityLogToolbar
          search={search}
          logNameFilter={logNameFilter}
          dateFilter={dateFilter}
          total={pagination?.total ?? 0}
          showing={logs.length}
          onSearchChange={handleSearchChange}
          onLogNameChange={handleLogNameChange}
          onDateChange={handleDateChange}
          onClear={resetFilters}
        />

        {/* Error banner */}
        {isError && (
          <div className="flex items-center gap-3 px-4 py-3 bg-[#FEE2E2] border border-[#FECACA] rounded-lg text-[13px] text-[#991B1B]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error ?? "Failed to load activity logs."}
            <button
              onClick={refetch}
              className="ml-auto underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {sorted.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center min-h-[300px] border border-[#E5E7EB] rounded-lg bg-white">
            <div className="text-center">
              <p className="text-[14px] text-gray-600">
                No activity logs match your filters
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 text-[12px] text-[#068847] underline"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <ActivityLogTable
            logs={sorted}
            isLoading={isLoading}
            sortKey={sortKey}
            sortDir={sortDir}
            pagination={pagination}
            page={page}
            perPage={perPage}
            onSort={handleSort}
            onViewDetail={setDetailLog}
            onPageChange={handlePageChange}
            onNext={() => handlePageChange(page + 1)}
            onPrev={() => handlePageChange(Math.max(1, page - 1))}
            onPerPageChange={handlePerPageChange}
          />
        )}
      </div>

      {/* Detail modal */}
      {detailLog && (
        <PropertiesModal {...detailLog} onClose={() => setDetailLog(null)} />
      )}
    </div>
  );
}
