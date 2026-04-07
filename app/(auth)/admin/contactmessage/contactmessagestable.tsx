"use client";

import { useMemo, useState } from "react";
import type {
  ContactMessage,
  ContactMessageStatus,
  ContactMessagePriority,
} from "@/lib/types/admin/ContactMessageType";
import {
  Toolbar,
  SortTh,
  TableRow,
  LoadingSkeleton,
  SearchIcon,
  XIcon,
  STATUS_CONFIG,
  type SortKey,
  type SortDir,
} from "./contactmessagecomponent";
import Pagination from "@/components/pagination/page";

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface ContactMessagesTableProps {
  messages: ContactMessage[];
  isLoading: boolean;
  total: number;
  page: number;
  lastPage: number;
  perPage: number;
  onCommitSearch: () => void;
  search: string;
  statusFilter: ContactMessageStatus | "";
  priorityFilter: ContactMessagePriority | "";

  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onPriorityChange: (v: string) => void;
  onClear: () => void;
  onPageChange: (p: number) => void;
  onPerPageChange: (v: number) => void;

  onView: (m: ContactMessage) => void;
  onEdit: (m: ContactMessage) => void;
  onDelete: (m: ContactMessage) => void;
}

// ─────────────────────────────────────────────
// Status legend pill
// ─────────────────────────────────────────────
function StatusLegend() {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-[#F3F4F6] bg-[#FAFAFA]">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mr-1">
        Legend:
      </span>
      {(["new", "read", "replied", "archived"] as ContactMessageStatus[]).map(
        (s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <span
              key={s}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`}
              />
              {cfg.label}
            </span>
          );
        },
      )}
      <span className="ml-auto text-[10px] text-gray-400 flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 border-l-[3px] border-l-blue-500 rounded-sm bg-blue-50/40" />
        Unread row highlighted
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// ContactMessagesTable
// ─────────────────────────────────────────────
export default function ContactMessagesTable({
  messages,
  isLoading,
  total,
  page,
  lastPage,
  perPage,
  search,
  statusFilter,
  priorityFilter,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onClear,
  onPageChange,
  onPerPageChange,
  onView,
  onEdit,
  onDelete,
  onCommitSearch,
}: ContactMessagesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Client-side sort of the current page
  const sorted = useMemo(() => {
    return [...messages].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "created_at")
        cmp =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      else if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      else if (sortKey === "priority") {
        const order: ContactMessagePriority[] = [
          "urgent",
          "high",
          "normal",
          "low",
        ];
        cmp = order.indexOf(a.priority) - order.indexOf(b.priority);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [messages, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const isEmpty = sorted.length === 0 && !isLoading;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Toolbar
        search={search}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onCommitSearch={onCommitSearch}
        onStatusChange={onStatusChange}
        priorityFilter={priorityFilter}
        onPriorityChange={onPriorityChange}
        onClear={onClear}
        total={total}
        showing={sorted.length}
        perPage={perPage}
        onPerPageChange={onPerPageChange}
      />

      {/* Empty state */}
      {isEmpty ? (
        <div className=" p-4 flex flex-col items-center justify-center min-h-[320px] border border-[#E5E7EB] rounded-xl bg-white shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mb-4">
            <SearchIcon />
          </div>
          <p className="text-[15px] font-semibold text-gray-700">
            No messages found
          </p>
          <p className="text-[13px] text-gray-400 mt-1 mb-4">
            Try adjusting your filters
          </p>
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 bg-[#068847] hover:bg-[#057a3e] text-white text-[13px] font-medium rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          {/* Status legend */}
          <StatusLegend />

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                <tr>
                  <SortTh
                    col="name"
                    label="Sender"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Subject / Message
                  </th>
                  <SortTh
                    col="status"
                    label="Status"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortTh
                    col="priority"
                    label="Priority"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <SortTh
                    col="created_at"
                    label="Date"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 min-w-[140px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  sorted.map((msg) => (
                    <TableRow
                      key={msg.id}
                      msg={msg}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
            <div className="px-6 py-3">
              {" "}
              {lastPage > 0 && (
                <Pagination
                  page={page}
                  perPage={perPage}
                  total={total}
                  dataLength={sorted.length} // ✅ Required: items on current page
                  onNext={() => onPageChange(page + 1)} // ✅ Required
                  onPrev={() => onPageChange(page - 1)} // ✅ Required
                  onPageChange={onPageChange} // ✅ Prop name updated
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
