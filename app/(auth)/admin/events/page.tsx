"use client";

import { useState, useRef } from "react";
import { useEvents, useDeleteEvent } from "@/lib/hooks/admin/useEventsHook";
import {
  Event,
  EventStatus,
  EventQueryParams,
} from "@/lib/types/admin/eventType";

import {
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  Trash2,
  Eye,
  CalendarDays,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import EventModal from "./eventModal";
import EventDetailModal from "./eventDetails";

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
interface DeleteConfirmDialogProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function DeleteConfirmDialog({
  title,
  onConfirm,
  onCancel,
  isPending,
}: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex flex-col w-full max-w-[420px] bg-white rounded-2xl border border-[#E5E7EB] shadow-lg p-6 gap-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-50 border border-red-100">
            <AlertTriangle className="h-6 w-6 text-[#FB2C36]" />
          </div>
          <div>
            <p className="font-semibold text-[18px] text-[#030712] leading-[130%]">
              Delete Event
            </p>
            <p className="text-[13px] text-[#4A5565] mt-1 leading-[160%]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#030712]">"{title}"</span>?
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="border border-[#E5E7EB]" />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 cursor-pointer h-[44px] rounded-xl border border-[#E5E7EB] text-[#6A7282] font-normal text-[15px] hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 h-[44px] cursor-pointer rounded-xl bg-[#FB2C36] text-white font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Inline Pagination ────────────────────────────────────────────────────────
type PaginationProps = {
  page: number;
  perPage: number;
  total?: number;
  dataLength: number;
  onNext: () => void;
  onPrev: () => void;
  onPageChange?: (page: number) => void;
};

function Pagination({
  page,
  perPage,
  total,
  dataLength,
  onNext,
  onPrev,
  onPageChange,
}: PaginationProps) {
  const totalPages = total ? Math.ceil(total / perPage) : undefined;
  const hasNext = total ? page < totalPages! : dataLength === perPage;

  const getPages = () => {
    if (!totalPages) return [];
    const pages: (number | "...")[] = [];
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    pages.push(1);
    if (page > 3) pages.push("...");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex flex-col w-full md:flex-row items-center justify-between mt-6 gap-4 md:gap-0">
      {total && (
        <p className="text-sm text-gray-500">
          Page <span className="font-medium text-gray-700">{page}</span> of{" "}
          <span className="font-medium text-gray-700">{totalPages}</span> —{" "}
          <span className="font-medium text-gray-700">{total}</span> results
        </p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="px-3 py-2 flex text-slate-700 items-center rounded-lg border text-sm font-medium bg-white hover:bg-gray-100 transition disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        {getPages().map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange?.(p as number)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                p === page
                  ? "bg-green-600 text-white border-green-600 shadow"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="px-3 py-2 text-slate-700 flex items-center rounded-lg border text-sm font-medium bg-white hover:bg-gray-100 transition disabled:opacity-40"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Status badge config ──────────────────────────────────────────────────────
const STATUS_BADGE: Record<
  EventStatus,
  { bg: string; text: string; label: string }
> = {
  draft: { bg: "bg-gray-100", text: "text-gray-600", label: "Draft" },
  published: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    label: "Published",
  },
  cancelled: { bg: "bg-red-50", text: "text-red-600", label: "Cancelled" },
  completed: { bg: "bg-blue-50", text: "text-blue-600", label: "Completed" },
};

const STATUS_FILTER_OPTIONS: { label: string; value: EventStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Completed", value: "completed" },
];

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<EventStatus | "">("");
  const [showFilters, setShowFilters] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [detailEvent, setDetailEvent] = useState<Event | null>(null);

  // ── Delete dialog state ────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);

  // ── Search helpers ─────────────────────────────────────────────────────────
  const commitSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };
  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
    searchInputRef.current?.focus();
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitSearch();
    if (e.key === "Escape") clearSearch();
  };

  // ── Query ──────────────────────────────────────────────────────────────────
  const params: EventQueryParams = { page };
  if (search) params.q = search;
  if (filterStatus) params.status = filterStatus;

  const { data, isLoading, isError } = useEvents(params);
  const events = data?.data ?? [];
  const pagination = data?.pagination;

  // ── Delete ─────────────────────────────────────────────────────────────────
  const { mutate: deleteEvent, isPending: deleting } = useDeleteEvent({
    onSuccess: () => {
      toast.success("Event deleted successfully");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete event"),
  });

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteEvent(deleteTarget.id);
  };

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="bg-white border-b border-[#e8e6e0] flex items-center max-w-7xl mx-auto">
        <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
              Events
            </p>
            <p className="text-sm text-[#4A5565]">
              Manage events, schedules, and registrations.
            </p>
          </div>
          <div className="flex justify-start sm:justify-end">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#068847] text-white whitespace-nowrap"
            >
              <Plus className="h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold">New Event</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 space-y-4">
        {/* ── Search & Filter Bar ── */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Input + Search button */}
          <div className="flex items-center gap-2 flex-1 min-w-0 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8780] pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search events..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 pr-9 py-2.5 bg-white border border-[#e8e6e0] rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#b8b5ae] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/10 focus:border-[#1a1a2e]"
              />

              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8780] hover:text-[#1a1a2e] transition-colors rounded p-0.5"
                  title="Clear"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search button */}
            <button
              onClick={commitSearch}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#068847] text-white text-sm font-medium hover:bg-[#05713b] transition-colors whitespace-nowrap shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ml-auto ${
              showFilters || filterStatus !== ""
                ? "bg-[#068847] text-white border-[#068847]"
                : "bg-white text-[#4a4845] border-[#e8e6e0] hover:border-[#1a1a2e]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {filterStatus !== "" && (
              <span className="w-2 h-2 rounded-full bg-white/70" />
            )}
          </button>
        </div>

        {/* Active search chip */}
        {search && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1a2e]/8 border border-[#1a1a2e]/15 text-sm mt-2">
            <span className="text-[#6a6a7a] text-xs">Searching:</span>
            <span className="font-medium text-[#1a1a2e] truncate max-w-[120px]">
              {search}
            </span>
            <button
              onClick={clearSearch}
              className="text-[#8a8780] hover:text-[#1a1a2e] ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* ── Filter Panel ── */}
        {showFilters && (
          <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-[#4a4845]">Status:</span>
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setFilterStatus(opt.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === opt.value
                    ? "bg-[#068847] text-white"
                    : "bg-[#d7efdc] text-[#4a4845] hover:bg-[#ece9e0]"
                }`}
              >
                {opt.label}
              </button>
            ))}
            {filterStatus !== "" && (
              <button
                onClick={() => {
                  setFilterStatus("");
                  setPage(1);
                }}
                className="ml-auto text-xs text-[#DC2626] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* ── Table ── */}
        <div className="bg-white border border-[#d7efdc] rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center gap-3 text-[#8a8780]">
              <div className="w-8 h-8 border-2 border-[#1a1a2e]/20 border-t-[#1a1a2e] rounded-full animate-spin" />
              <span className="text-sm">Loading events...</span>
            </div>
          ) : isError ? (
            <div className="py-20 text-center text-sm text-red-500">
              Failed to load events. Please try again.
            </div>
          ) : events.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f5f4f0] flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-[#b8b5ae]" />
              </div>
              <p className="text-sm text-[#8a8780]">
                {search ? `No events found for "${search}"` : "No events found"}
              </p>
              {search ? (
                <button
                  onClick={clearSearch}
                  className="text-sm text-[#1a1a2e] underline underline-offset-2 font-medium"
                >
                  Clear search
                </button>
              ) : (
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="text-sm text-[#1a1a2e] underline underline-offset-2 font-medium"
                >
                  Create your first event
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#e3e8e0] bg-[#f8faf7]">
                    {[
                      "photo",
                      "Title",
                      "Location",
                      "Start Date",
                      "End Date",
                      "Attendees",
                      "Fee",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-semibold text-[#8a8780] uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede8]">
                  {events.map((ev) => {
                    const badge = STATUS_BADGE[ev.status] ?? STATUS_BADGE.draft;
                    return (
                      <tr
                        key={ev.id}
                        className="hover:bg-[#f8faf7] transition-colors"
                      >
                        <td className="px-5 py-4 whitespace-nowrap">
                          {ev.image ? (
                            <img
                              src={ev.image}
                              alt={ev.title}
                              className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#d7efdc] flex items-center justify-center text-[#068847] font-semibold text-sm">
                              {ev.title?.charAt(0)?.toUpperCase() ?? "?"}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 max-w-[200px]">
                          <p className="text-sm font-medium text-[#1a1a2e] truncate">
                            {ev.title}
                          </p>
                          {ev.description && (
                            <p className="text-xs text-[#8a8780] truncate max-w-[180px]">
                              {ev.description}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                          {ev.location ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                          {formatDate(ev.start_date)}
                        </td>
                        <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                          {formatDate(ev.end_date)}
                        </td>
                        <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                          {ev.max_attendees != null ? ev.max_attendees : "—"}
                        </td>
                        <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                          {ev.registration_fee &&
                          Number(ev.registration_fee) > 0
                            ? `৳ ${Number(ev.registration_fee).toFixed(2)}`
                            : "Free"}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${badge.bg} ${badge.text}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setDetailEvent(ev)}
                              className="p-1.5 rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e] transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditEvent(ev)}
                              className="p-1.5 rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e] transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(ev)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-[#8a8780] hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {pagination && pagination.last_page > 0 && (
          <Pagination
            page={pagination.current_page}
            perPage={pagination.per_page}
            total={pagination.total}
            dataLength={events.length}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>

      {/* ── Modals ── */}
      <EventModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <EventModal
        open={!!editEvent}
        event={editEvent}
        onClose={() => setEditEvent(null)}
      />
      <EventDetailModal
        open={!!detailEvent}
        event={detailEvent}
        onClose={() => setDetailEvent(null)}
        onEdit={(e) => {
          setDetailEvent(null);
          setEditEvent(e);
        }}
      />

      {/* ── Delete Confirm Dialog ── */}
      {deleteTarget && (
        <DeleteConfirmDialog
          title={deleteTarget.title}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          isPending={deleting}
        />
      )}
    </div>
  );
}
