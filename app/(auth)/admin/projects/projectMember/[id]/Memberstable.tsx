"use client";

// components/projectMember/MembersTable.tsx
// Renders the desktop table, mobile cards, and all data states.

import {
  AlertTriangle,
  Loader2,
  Pencil,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";
import type { ProjectMember } from "@/lib/types/admin/projectMemberType";
import { RoleBadge, StatusBadge, Pagination } from "./Projectmemberui";

// ─── Props ────────────────────────────────────────────────────────────────────

interface MembersTableProps {
  members: ProjectMember[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  perPage: number;
  total?: number;
  onNext: () => void;
  onPrev: () => void;
  onPageChange: (page: number) => void;
  onEdit: (member: ProjectMember) => void;
  onDelete: (member: ProjectMember) => void;
  onAssign: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MembersTable({
  members,
  isLoading,
  isError,
  page,
  perPage,
  total,
  onNext,
  onPrev,
  onPageChange,
  onEdit,
  onDelete,
  onAssign,
}: MembersTableProps) {
  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-2">
        <AlertTriangle className="w-6 h-6 text-red-400" />
        <p className="text-sm text-slate-500">Failed to load members.</p>
      </div>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────────
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <User className="w-5 h-5 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600">No members found</p>
        <p className="text-xs text-slate-400">
          Assign your first member to get started.
        </p>
        <button
          onClick={onAssign}
          className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
        >
          <UserPlus className="w-3.5 h-3.5" /> Assign Member
        </button>
      </div>
    );
  }

  // ── Data ─────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Desktop table ─────────────────────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              {[
                "Member",
                "Role",
                "Status",
                "Joined",
                "Fee Paid",
                "Downline",
                "",
              ].map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${
                    i === 0 ? "text-left px-5" : i === 6 ? "" : "text-left"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/60 transition">
                {/* Member */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-xs flex-shrink-0">
                      {(member.user?.name ?? `U${member.user_id}`)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 leading-tight">
                        {member.user?.name ?? `User #${member.user_id}`}
                      </p>
                      <p className="text-xs text-slate-400">
                        {member.user?.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-4 py-3.5">
                  <RoleBadge role={member.project_role} />
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <StatusBadge status={member.status} />
                </td>

                {/* Joined */}
                <td className="px-4 py-3.5 text-slate-600">
                  {member.joining_date ?? "—"}
                </td>

                {/* Fee */}
                <td className="px-4 py-3.5 text-slate-600">
                  ৳{Number(member.joining_fee_paid).toLocaleString()}
                </td>

                {/* Downline */}
                <td className="px-4 py-3.5">
                  <span className="text-slate-600">
                    {member.current_downline_count}
                  </span>
                  {member.max_downline_members !== null && (
                    <span className="text-slate-400">
                      {" "}
                      / {member.max_downline_members}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => onEdit(member)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(member)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ──────────────────────────────────────────────────────── */}
      <div className="md:hidden divide-y divide-slate-100">
        {members.map((member) => (
          <div key={member.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm flex-shrink-0">
                  {(member.user?.name ?? `U${member.user_id}`)
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">
                    {member.user?.name ?? `User #${member.user_id}`}
                  </p>
                  <p className="text-xs text-slate-400">{member.user?.email}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(member)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(member)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <RoleBadge role={member.project_role} />
              <StatusBadge status={member.status} />
            </div>

            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>Joined: {member.joining_date ?? "—"}</span>
              <span>
                Fee: ৳{Number(member.joining_fee_paid).toLocaleString()}
              </span>
              <span>
                Downline: {member.current_downline_count}
                {member.max_downline_members !== null
                  ? ` / ${member.max_downline_members}`
                  : ""}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pagination ────────────────────────────────────────────────────────── */}
      <div className="px-5 py-4">
        <Pagination
          page={page}
          perPage={perPage}
          total={total}
          dataLength={members.length}
          onNext={onNext}
          onPrev={onPrev}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}
