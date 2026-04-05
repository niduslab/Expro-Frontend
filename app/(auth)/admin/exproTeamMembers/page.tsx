"use client";

import { useState, useRef } from "react";
import {
  useExproTeamMembers,
  useDeleteExproTeamMember,
} from "@/lib/hooks/admin/useexproTeamMembersHook";
import { ExproTeamMember } from "@/lib/types/admin/exproTeamMemberType";

import {
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  Eye,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import ExproTeamMemberModal from "./exproTeamMemberModal";
import ExproTeamMemberDetailModal from "./exproTeamMemberDetails";
import Pagination from "@/components/pagination/page";
import DatePicker from "@/components/ui/date-picker";
import DeleteConfirmDialog from "../projects/delete-confirmation";

export default function ExproTeamMembersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filterDesignation, setFilterDesignation] = useState("");
  const [filterCreatedAt, setFilterCreatedAt] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editMember, setEditMember] = useState<ExproTeamMember | null>(null);
  const [detailMember, setDetailMember] = useState<ExproTeamMember | null>(
    null,
  );

  // ── Delete state ────────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<ExproTeamMember | null>(
    null,
  );

  // ── Search helpers ──────────────────────────────────────────────────────────
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

  // ── Active filter count ─────────────────────────────────────────────────────
  const activeFilterCount = [filterDesignation, filterCreatedAt].filter(
    Boolean,
  ).length;

  const clearFilters = () => {
    setFilterDesignation("");
    setFilterCreatedAt("");
    setPage(1);
  };

  // ── Query params ────────────────────────────────────────────────────────────
  const params: Record<string, unknown> = { page };
  if (search) params.q = search;
  if (filterDesignation) params.designation = filterDesignation;
  if (filterCreatedAt) params.created_at = filterCreatedAt;

  const { data, isLoading, isError } = useExproTeamMembers(params);
  const members = data?.data ?? [];
  const pagination = data?.pagination;

  const { mutate: deleteMember, isPending: deleting } =
    useDeleteExproTeamMember({
      onSuccess: () => {
        toast.success("Team member deleted successfully");
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error("Failed to delete team member");
        setDeleteTarget(null);
      },
    });

  return (
    <div className="min-h-screen font-['DM_Sans',sans-serif]">
      {/* ── Header ── */}
      <div className="bg-white border-b border-[#e8e6e0] flex items-center max-w-7xl mx-auto">
        <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
              Expro Team Members
            </p>
            <p className="text-sm text-[#4A5565]">
              Manage Expro team members data and update here.
            </p>
          </div>
          <div className="flex justify-start sm:justify-end">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#068847] text-white whitespace-nowrap"
            >
              <Plus className="h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold">New Member</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 space-y-4">
        {/* ── Search & Filter Bar ── */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8780] pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by name or designation..."
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

            <button
              onClick={commitSearch}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#068847] text-white text-sm font-medium hover:bg-[#05713b] transition-colors whitespace-nowrap shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ml-auto ${
              showFilters || activeFilterCount > 0
                ? "bg-[#068847] text-white border-[#068847]"
                : "bg-white text-[#4a4845] border-[#e8e6e0] hover:border-[#1a1a2e]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white/20 text-white text-xs flex items-center justify-center font-semibold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Filter Panel ── */}
        {showFilters && (
          <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
                <label className="text-xs font-semibold text-[#4a4845] uppercase tracking-wide">
                  Designation
                </label>
                <input
                  type="text"
                  placeholder="Filter by designation..."
                  value={filterDesignation}
                  onChange={(e) => {
                    setFilterDesignation(e.target.value);
                    setPage(1);
                  }}
                  className="h-[38px] border border-[#D1D5DC] rounded-lg px-3 bg-white text-sm text-[#1a1a2e] placeholder:text-[#b8b5ae] focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847]"
                />
              </div>

              <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
                <label className="text-xs font-semibold text-[#4a4845] uppercase tracking-wide">
                  Created Date
                </label>
                <DatePicker
                  value={filterCreatedAt}
                  onChange={(value) => {
                    setFilterCreatedAt(value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#DC2626] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Table ── */}
        <div className="bg-white border border-[#d7efdc] rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center gap-3 text-[#8a8780]">
              <div className="w-8 h-8 border-2 border-[#1a1a2e]/20 border-t-[#1a1a2e] rounded-full animate-spin" />
              <span className="text-sm">Loading team members...</span>
            </div>
          ) : isError ? (
            <div className="py-20 text-center text-sm text-red-500">
              Failed to load team members. Please try again.
            </div>
          ) : members.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f5f4f0] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#b8b5ae]" />
              </div>
              <p className="text-sm text-[#8a8780]">
                {search || activeFilterCount > 0
                  ? "No team members match your search or filters"
                  : "No team members found"}
              </p>
              {search || activeFilterCount > 0 ? (
                <div className="flex gap-3">
                  {search && (
                    <button
                      onClick={clearSearch}
                      className="text-sm text-[#1a1a2e] underline underline-offset-2 font-medium"
                    >
                      Clear search
                    </button>
                  )}
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-[#1a1a2e] underline underline-offset-2 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="text-sm text-[#1a1a2e] underline underline-offset-2 font-medium"
                >
                  Add your first team member
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#e3e8e0] bg-[#f8faf7]">
                    {["Photo", "Name", "Designation", "Actions"].map((h) => (
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
                  {members.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-[#f8faf7] transition-colors group"
                    >
                      {/* Avatar */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {member.image_url ? (
                          <img
                            src={member.image_url}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#d7efdc] flex items-center justify-center text-[#068847] font-semibold text-sm">
                            {member.name?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                        )}
                      </td>

                      {/* Name */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-[#1a1a2e] whitespace-nowrap">
                          {member.name}
                        </p>
                      </td>

                      {/* Designation */}
                      <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                        {member.designation}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setDetailMember(member)}
                            className="p-1.5 rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e] transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditMember(member)}
                            className="p-1.5 rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(member)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-[#8a8780] hover:text-[#FB2C36] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
            dataLength={members.length}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>

      {/* ── Modals ── */}
      <ExproTeamMemberModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <ExproTeamMemberModal
        open={!!editMember}
        member={editMember}
        onClose={() => setEditMember(null)}
      />
      <ExproTeamMemberDetailModal
        open={!!detailMember}
        member={detailMember}
        onClose={() => setDetailMember(null)}
        onEdit={(m) => {
          setDetailMember(null);
          setEditMember(m);
        }}
      />

      {/* ── Delete Confirmation ── */}
      {deleteTarget && (
        <DeleteConfirmDialog
          projectTitle={deleteTarget.name}
          isPending={deleting}
          onConfirm={() => deleteMember(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
