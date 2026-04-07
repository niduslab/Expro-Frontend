"use client";

import { useState, useMemo } from "react";
import {
  useContactMessages,
  useContactMessageMutations,
} from "@/lib/hooks/admin/useContactmessages";
import type {
  ContactMessage,
  ContactMessageStatus,
  ContactMessagePriority,
  ContactMessageUpdatePayload,
  ContactMessageFilters,
} from "@/lib/types/admin/ContactMessageType";

import {
  StatCard,
  MessageModal,
  DeleteModal,
  MailIcon,
  RefreshIcon,
  XIcon,
} from "./contactmessagecomponent";
import ContactMessagesTable from "./contactmessagestable";
import { BellPlus, MailWarning, MessageCircle, Reply } from "lucide-react";

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function ContactMessagesPage() {
  // ── Filter state ──
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactMessageStatus | "">(
    "",
  );
  const [priorityFilter, setPriorityFilter] = useState<
    ContactMessagePriority | ""
  >("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  // ── Modal state ──
  const [viewMsg, setViewMsg] = useState<ContactMessage | null>(null);
  const [editMsg, setEditMsg] = useState<ContactMessage | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<ContactMessage | null>(null);

  // ── Derived filter object ──
  const filters: ContactMessageFilters = {
    page,
    per_page: perPage,
    ...(search ? { name: search } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(priorityFilter ? { priority: priorityFilter } : {}),
  };

  // ── Data fetching ──
  const {
    messages,
    pagination,
    isLoading,
    isError,
    error,
    setFilters,
    refetch,
  } = useContactMessages(filters);

  const { update, remove, isUpdating, isDeleting, mutationError } =
    useContactMessageMutations();

  // ── Filter helpers ──
  function syncFilters(patch: Partial<ContactMessageFilters>) {
    setFilters({
      page,
      per_page: perPage,
      ...(search ? { name: search } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(priorityFilter ? { priority: priorityFilter } : {}),
      ...patch,
    });
  }

  function handleSearchChange(v: string) {
    setSearch(v);
    setPage(1);
    // syncFilters({ name: v || undefined, page: 1 });
  }
  function handleCommitSearch() {
    syncFilters({
      name: search || undefined,
      page: 1,
    });
  }
  function handleStatusChange(v: string) {
    setStatusFilter(v as ContactMessageStatus | "");
    setPage(1);
    syncFilters({
      status: v ? (v as ContactMessageStatus) : undefined,
      page: 1,
    });
  }

  function handlePriorityChange(v: string) {
    setPriorityFilter(v as ContactMessagePriority | "");
    setPage(1);
    syncFilters({
      priority: v ? (v as ContactMessagePriority) : undefined,
      page: 1,
    });
  }

  function handleClear() {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setPage(1);
    setFilters({
      page: 1,
      per_page: perPage,
      name: undefined, // ✅ Explicitly clear search param
      status: undefined, // ✅ Clear status param
      priority: undefined, // ✅ Clear priority param
    });
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

  // ── Mutations ──
  async function handleSave(id: number, payload: ContactMessageUpdatePayload) {
    const result = await update(id, payload);
    if (result) {
      setEditMsg(null);
      refetch();
    }
  }

  async function handleDelete() {
    if (!deleteMsg) return;
    const ok = await remove(deleteMsg.id);
    if (ok) {
      setDeleteMsg(null);
      refetch();
    }
  }

  // ── Stats (derived from current page for fast counts) ──
  const stats = useMemo(() => {
    const total = pagination?.total ?? messages.length;
    const newCount = messages.filter((m) => m.status === "new").length;
    const urgentCount = messages.filter(
      (m) => m.priority === "urgent" || m.priority === "high",
    ).length;
    const repliedCount = messages.filter((m) => m.status === "replied").length;
    return { total, newCount, urgentCount, repliedCount };
  }, [messages, pagination]);

  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-[1440px] mx-auto space-y-5 p-5">
        {/* ── Page Header ── */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] px-6 py-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#F0FDF4] border border-[#A7F3D0] flex items-center justify-center flex-shrink-0">
                <MailIcon size={20} />
              </div>
              <div>
                <h1 className="text-[20px] font-bold text-gray-900 leading-snug">
                  Contact Messages
                </h1>
                <p className="text-[13px] text-gray-400 mt-0.5">
                  Manage incoming contact form submissions
                  {pagination?.total
                    ? ` · ${pagination.total.toLocaleString()} total`
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Messages"
            value={(stats.total ?? 0).toLocaleString()}
            sub="All received"
            valueColor="text-[#068847]"
            icon={<MessageCircle className="h-4 w-4" />}
          />
          <StatCard
            label="New / Unread"
            value={stats.newCount.toString()}
            sub="Awaiting response"
            valueColor="text-blue-600"
            icon={<BellPlus className="h-4 w-4" />}
          />
          <StatCard
            label="High Priority"
            value={stats.urgentCount.toString()}
            sub="Urgent + High"
            valueColor="text-orange-500"
            icon={<MailWarning className="h-4 w-4" />}
          />
          <StatCard
            label="Replied"
            value={stats.repliedCount.toString()}
            sub="This page"
            valueColor="text-[#5B21B6]"
            icon={<Reply className="h-4 w-4" />}
          />
        </div>

        {/* ── Error banner ── */}
        {(isError || mutationError) && (
          <div className="flex items-center gap-3 px-4 py-3.5 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-700">
            <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0">
              <XIcon />
            </div>
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-[12px] text-red-600 mt-0.5">
                {error ?? mutationError ?? "An unexpected error occurred."}
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

        {/* ── Table ── */}
        <ContactMessagesTable
          messages={messages}
          isLoading={isLoading}
          total={pagination?.total ?? 0}
          page={page}
          lastPage={pagination?.last_page ?? 1}
          perPage={perPage}
          search={search}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onSearchChange={handleSearchChange}
          onCommitSearch={handleCommitSearch}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onClear={handleClear}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onView={setViewMsg}
          onEdit={setEditMsg}
          onDelete={setDeleteMsg}
        />
      </div>

      {/* ── Modals ── */}
      {viewMsg && (
        <MessageModal
          message={viewMsg}
          mode="view"
          onClose={() => setViewMsg(null)}
          onSave={handleSave}
          isSaving={isUpdating}
        />
      )}
      {editMsg && (
        <MessageModal
          message={editMsg}
          mode="edit"
          onClose={() => setEditMsg(null)}
          onSave={handleSave}
          isSaving={isUpdating}
        />
      )}
      {deleteMsg && (
        <DeleteModal
          message={deleteMsg}
          onConfirm={handleDelete}
          onCancel={() => setDeleteMsg(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
