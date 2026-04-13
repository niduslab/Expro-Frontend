"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  UserPlus,
  Search,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { useProjectMembers } from "@/lib/hooks/admin/UseProjectMemberHook";
import type {
  ProjectMember,
  ProjectMemberRole,
  ProjectMemberStatus,
} from "@/lib/types/admin/projectMemberType";
import { ROLE_OPTIONS, STATUS_OPTIONS } from "./constent";

import { Modal, CustomSelect } from "./Projectmemberui";
import { MembersTable } from "./Memberstable";
import { MemberForm } from "./Memberform";
import { DeleteConfirm } from "./DeleteConfirm";

// ─── Modal state discriminated union ─────────────────────────────────────────

type ModalState =
  | { type: "assign" }
  | { type: "edit"; member: ProjectMember }
  | { type: "delete"; member: ProjectMember }
  | null;

// ─── Sort options ─────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "id", label: "Default" },
  { value: "joining_date", label: "Join Date" },
  { value: "status", label: "Status" },
  { value: "project_role", label: "Role" },
  { value: "joining_fee_paid", label: "Fee Paid" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const PER_PAGE = 10;

export default function ProjectMemberPage() {
  const params = useParams();
  const projectId = Number(params.id);

  // ── Local state ──────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [modal, setModal] = useState<ModalState>(null);

  // ── Debounce search ──────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // ── Data ─────────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useProjectMembers({
    project_id: projectId,
    page,
    per_page: PER_PAGE,
    ...(statusFilter ? { status: statusFilter as ProjectMemberStatus } : {}),
    ...(roleFilter ? { project_role: roleFilter as ProjectMemberRole } : {}),
    ...(debouncedSearch ? { q: debouncedSearch } : {}),
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const members = data?.data ?? [];
  const pagination = data?.pagination;
  const assignedUserIds = members.map((m) => m.user_id);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const closeModal = () => setModal(null);

  const hasActiveFilters = !!(statusFilter || roleFilter || search);

  const clearFilters = () => {
    setStatusFilter("");
    setRoleFilter("");
    setSearch("");
    setDebouncedSearch("");
    setSortBy("id");
    setSortOrder("desc");
    setPage(1);
  };

  const toggleSortOrder = () =>
    setSortOrder((o) => (o === "asc" ? "desc" : "asc"));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* ── Page header ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-0.5">
              Project #{projectId}
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              Project Members
            </h1>
            {pagination && (
              <p className="text-sm text-slate-500 mt-0.5">
                {pagination.total} member{pagination.total !== 1 ? "s" : ""}{" "}
                total
                {debouncedSearch && (
                  <span className="ml-1 text-emerald-600">
                    for &quot;{debouncedSearch}&quot;
                  </span>
                )}
              </p>
            )}
          </div>
          <button
            onClick={() => setModal({ type: "assign" })}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Assign Member
          </button>
        </div>

        {/* ── Search + Filters + Sort ───────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="h-[42px] pl-9 pr-9 w-64 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="w-44">
            <CustomSelect
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
              options={[
                { value: "", label: "All statuses" },
                ...STATUS_OPTIONS,
              ]}
              placeholder="All statuses"
            />
          </div>

          {/* Role filter */}
          <div className="w-52">
            <CustomSelect
              value={roleFilter}
              onChange={(v) => {
                setRoleFilter(v);
                setPage(1);
              }}
              options={[{ value: "", label: "All roles" }, ...ROLE_OPTIONS]}
              placeholder="All roles"
            />
          </div>

          {/* Sort by */}
          <div className="w-40">
            <CustomSelect
              value={sortBy}
              onChange={(v) => {
                setSortBy(v);
                setPage(1);
              }}
              options={SORT_OPTIONS}
            />
          </div>

          {/* Sort order toggle */}
          <button
            onClick={toggleSortOrder}
            title={
              sortOrder === "asc"
                ? "Ascending — click for descending"
                : "Descending — click for ascending"
            }
            className="h-[42px] px-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition text-slate-500 hover:text-slate-700 flex items-center gap-1.5 text-xs font-medium"
          >
            {sortOrder === "asc" ? (
              <ArrowUp className="w-3.5 h-3.5" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5" />
            )}
            {sortOrder === "asc" ? "Asc" : "Desc"}
          </button>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="h-[42px] px-3 text-xs font-medium text-slate-500 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </div>

        {/* ── Table card ────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <MembersTable
            members={members}
            isLoading={isLoading}
            isError={isError}
            page={page}
            perPage={PER_PAGE}
            total={pagination?.total}
            onNext={() => setPage((p) => p + 1)}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onPageChange={setPage}
            onEdit={(member) => setModal({ type: "edit", member })}
            onDelete={(member) => setModal({ type: "delete", member })}
            onAssign={() => setModal({ type: "assign" })}
          />
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────────── */}
      {modal?.type === "assign" && (
        <Modal title="Assign New Member" onClose={closeModal}>
          <MemberForm
            projectId={projectId}
            onClose={closeModal}
            assignedUserIds={assignedUserIds}
          />
        </Modal>
      )}
      <div className="max-w-7xl mx-auto">
        {modal?.type === "edit" && (
          <Modal title="Edit Member" onClose={closeModal}>
            <MemberForm
              projectId={projectId}
              initial={modal.member}
              onClose={closeModal}
              assignedUserIds={assignedUserIds.filter(
                (id) => id !== modal.member.user_id,
              )}
            />
          </Modal>
        )}
      </div>
      {modal?.type === "delete" && (
        <Modal title="Remove Member" onClose={closeModal}>
          <DeleteConfirm member={modal.member} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
