"use client";

// app/admin/projects/projectMember/[id]/page.tsx
// Slim orchestrator: owns state, composes all feature components.

import { useState } from "react";
import { useParams } from "next/navigation";
import { UserPlus } from "lucide-react";

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

// ─── Page ─────────────────────────────────────────────────────────────────────

const PER_PAGE = 10;

export default function ProjectMemberPage() {
  const params = useParams();
  const projectId = Number(params.id);

  // ── Local state ──────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [modal, setModal] = useState<ModalState>(null);

  // ── Data ─────────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useProjectMembers({
    project_id: projectId,
    page,
    per_page: PER_PAGE,
    ...(statusFilter ? { status: statusFilter as ProjectMemberStatus } : {}),
    ...(roleFilter ? { project_role: roleFilter as ProjectMemberRole } : {}),
  });

  const members = data?.data ?? [];
  const pagination = data?.pagination;

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const closeModal = () => setModal(null);
  const clearFilters = () => {
    setStatusFilter("");
    setRoleFilter("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto py-8">
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

        {/* ── Filters ───────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-4">
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
          {(statusFilter || roleFilter) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-xs font-medium text-slate-500 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition"
            >
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
          <MemberForm projectId={projectId} onClose={closeModal} />
        </Modal>
      )}

      {modal?.type === "edit" && (
        <Modal title="Edit Member" onClose={closeModal}>
          <MemberForm
            projectId={projectId}
            initial={modal.member}
            onClose={closeModal}
          />
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal title="Remove Member" onClose={closeModal}>
          <DeleteConfirm member={modal.member} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
