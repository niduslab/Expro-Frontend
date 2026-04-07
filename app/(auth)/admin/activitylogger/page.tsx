"use client";

import { useState, useMemo } from "react";
import { useActivityLogs } from "@/lib/hooks/admin/useActivityLogger";
import { ActivityLogToolbar, ActivityLogTable } from "./activityLogtable";
import {
  StatCard,
  PropertiesModal,
  DownloadIcon,
  RefreshIcon,
  parseCauser,
} from "./activityLogUI";
import type { SortKey, SortDir, ModalLogData } from "./activityLogUI";

export default function ActivityLogPage() {
  // ── Filter state ──
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
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

  function handleSearchSubmit() {
    setSearch(searchInput);
    setPage(1);
    syncFilters({ search: searchInput, page: 1 });
  }

  // ── Client-side sort ──
  const sorted = useMemo(() => {
    return [...logs].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "created_at")
        cmp =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      else if (sortKey === "log_name")
        cmp = (a.log_name ?? "").localeCompare(b.log_name ?? "");
      else if (sortKey === "causer_id") {
        const aId = (a as any).causer?.id ?? a.causer_id ?? 0;
        const bId = (b as any).causer?.id ?? b.causer_id ?? 0;
        cmp = aId - bId;
      }
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
      const key = l.log_name?.toLowerCase() ?? "unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    const topChannel =
      Object.entries(byName).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    const uniqueCausers = new Set(
      logs.map((l) => (l as any).causer?.id ?? l.causer_id).filter(Boolean),
    ).size;

    const authCount = (byName["user"] ?? 0) + (byName["auth"] ?? 0);

    const byEvent = logs.reduce<Record<string, number>>((acc, l) => {
      const e = l.event ?? "unknown";
      acc[e] = (acc[e] ?? 0) + 1;
      return acc;
    }, {});

    const errorCount = byName["error"] ?? 0;

    return { total, topChannel, uniqueCausers, authCount, byEvent, errorCount };
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
    setSearchInput("");
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
    setSearchInput(v);
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
    <div className="min-h-screen bg-[#F8F9FA] ">
      <div className="max-w-[1440px] mx-auto space-y-5">
        {/* ── Page Header ── */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] px-6 py-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-[#F0FDF4] border border-[#A7F3D0] flex items-center justify-center flex-shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#068847"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div>
                <h1 className="text-[20px] font-bold text-gray-900 leading-snug">
                  Activity Logs
                </h1>
                <p className="text-[13px] text-gray-400 mt-0.5">
                  System-wide audit trail
                  {pagination?.total
                    ? ` · ${pagination.total.toLocaleString()} total entries`
                    : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Last updated pill */}
              <div className="hidden sm:flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] text-green-700 font-medium">
                  Live
                </span>
              </div>

              <button
                onClick={refetch}
                className="flex items-center gap-1.5 text-[12px] px-3 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors cursor-pointer text-gray-600 font-medium"
              >
                <RefreshIcon /> Refresh
              </button>
              <button className="flex items-center gap-1.5 text-[12px] px-3 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors cursor-pointer text-gray-600 font-medium">
                <DownloadIcon /> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Logs"
            value={(stats.total ?? 0).toLocaleString()}
            sub="All time entries"
            valueColor="text-[#068847]"
            icon={
              <svg
                width="14"
                height="14"
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
          />
          <StatCard
            label="Auth Events"
            value={stats.authCount.toString()}
            sub="Login & logout activity"
            valueColor="text-[#5B21B6]"
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
          />
          <StatCard
            label="Active Users"
            value={stats.uniqueCausers.toString()}
            sub="Unique actors this page"
            valueColor="text-[#1D4ED8]"
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <StatCard
            label="Top Channel"
            value={
              stats.topChannel === "—"
                ? "—"
                : stats.topChannel
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())
            }
            sub="Most active log channel"
            valueColor="text-[#B45309]"
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          />
        </div>

        {/* ── Toolbar ── */}
        <ActivityLogToolbar
          search={search}
          logNameFilter={logNameFilter}
          dateFilter={dateFilter}
          total={pagination?.total ?? 0}
          showing={logs.length}
          onSearchSubmit={handleSearchSubmit}
          onSearchChange={handleSearchChange}
          onLogNameChange={handleLogNameChange}
          onDateChange={handleDateChange}
          onClear={resetFilters}
        />

        {/* ── Error Banner ── */}
        {isError && (
          <div className="flex items-center gap-3 px-4 py-3.5 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-700">
            <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0">
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
            </div>
            <div>
              <p className="font-semibold text-red-800">
                Failed to load activity logs
              </p>
              <p className="text-[12px] text-red-600 mt-0.5">
                {error ?? "An unexpected error occurred."}
              </p>
            </div>
            <button
              onClick={refetch}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-[12px] font-medium rounded-lg transition-colors cursor-pointer"
            >
              <RefreshIcon /> Retry
            </button>
          </div>
        )}

        {/* ── Empty State ── */}
        {sorted.length === 0 && !isLoading && !isError ? (
          <div className="flex flex-col items-center justify-center min-h-[320px] border border-[#E5E7EB] rounded-xl bg-white shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mb-4">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-gray-700">
              No logs match your filters
            </p>
            <p className="text-[13px] text-gray-400 mt-1 mb-4">
              Try adjusting your search or clearing the filters
            </p>
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 bg-[#068847] hover:bg-[#057a3e] text-white text-[13px] font-medium rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Clear all filters
            </button>
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

      {/* ── Detail Modal ── */}
      {detailLog && (
        <PropertiesModal {...detailLog} onClose={() => setDetailLog(null)} />
      )}
    </div>
  );
}
