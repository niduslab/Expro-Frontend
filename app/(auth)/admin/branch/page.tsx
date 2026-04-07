"use client";

import { useState, useRef } from "react";
import {
  useBranches,
  useDeleteBranch,
} from "@/lib/hooks/admin/useBranchesHook";
import { Branch } from "@/lib/types/branchType";

import {
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  Eye,
  Trash2,
  Building2,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import BranchModal from "./branchModal";
import BranchDetailModal from "./branchDetails";
import DeleteConfirmDialog from "../projects/delete-confirmation"; // adjust path
import Pagination from "@/components/pagination/page";

export default function BranchesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [page, setPage] = useState(1);
  const [filterActive, setFilterActive] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [detailBranch, setDetailBranch] = useState<Branch | null>(null);

  // ── Delete state ───────────────────────────────────────────────────────────
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);

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

  // ── Query params ───────────────────────────────────────────────────────────
  const params: Record<string, unknown> = { page };
  if (search) params.q = search;
  if (filterActive !== "") params.is_active = filterActive === "true";

  const { data, isLoading, isError } = useBranches(params);
  const branches = data?.data ?? [];
  const pagination = data?.pagination;

  const { mutate: deleteBranch, isPending: deleting } = useDeleteBranch({
    onSuccess: () => {
      toast.success("Branch deleted successfully");
      setDeletingBranch(null);
    },
    onError: () => {
      toast.error("Failed to delete branch");
      setDeletingBranch(null);
    },
  });

  return (
    <div className="min-h-screen font-['DM_Sans',sans-serif]">
      {/* ── Header ── */}
      <div className="bg-white border-b border-[#e8e6e0] flex items-center max-w-7xl mx-auto">
        <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
              Branches
            </p>
            <p className="text-sm text-[#4A5565]">
              Manage Branches data and update here.
            </p>
          </div>
          <div className="flex justify-start sm:justify-end">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#068847] text-white whitespace-nowrap"
            >
              <Plus className="h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold">New Branch</span>
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
                placeholder="Search branches..."
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
              showFilters || filterActive !== ""
                ? "bg-[#068847] text-white border-[#068847]"
                : "bg-white text-[#4a4845] border-[#e8e6e0] hover:border-[#1a1a2e]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {filterActive !== "" && (
              <span className="w-2 h-2 rounded-full bg-white/70" />
            )}
          </button>
        </div>

        {/* ── Filter Panel ── */}
        {showFilters && (
          <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-[#4a4845]">Status:</span>
            {[
              { label: "All", value: "" },
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setFilterActive(opt.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterActive === opt.value
                    ? "bg-[#068847] text-white"
                    : "bg-[#d7efdc] text-[#4a4845] hover:bg-[#ece9e0]"
                }`}
              >
                {opt.label}
              </button>
            ))}
            {filterActive !== "" && (
              <button
                onClick={() => {
                  setFilterActive("");
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
              <span className="text-sm">Loading branches...</span>
            </div>
          ) : isError ? (
            <div className="py-20 text-center text-sm text-red-500">
              Failed to load branches. Please try again.
            </div>
          ) : branches.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f5f4f0] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#b8b5ae]" />
              </div>
              <p className="text-sm text-[#8a8780]">
                {search
                  ? `No branches found for "${search}"`
                  : "No branches found"}
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
                  Create your first branch
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#e3e8e0] bg-[#f8faf7]">
                    {[
                      "Code",
                      "Name",
                      "District",
                      "Division",
                      "Contact",
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
                  {branches.map((branch) => (
                    <tr
                      key={branch.id}
                      className="hover:bg-[#f8faf7] transition-colors group"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#1a1a2e]/8 text-[#1a1a2e] text-xs font-mono font-semibold">
                          {branch.code}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#1a1a2e] whitespace-nowrap">
                            {branch.name}
                          </p>
                          {branch.name_bangla && (
                            <p className="text-xs text-[#8a8780]">
                              {branch.name_bangla}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                        {branch.district ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                        {branch.division ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                        {branch.contact_number ?? "—"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {branch.is_active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                            <XCircle className="w-3 h-3" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 transition-opacity">
                          <button
                            onClick={() => setDetailBranch(branch)}
                            className="p-1.5 rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e] transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditBranch(branch)}
                            className="p-1.5 rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {/* ── Delete button ── */}
                          <button
                            onClick={() => setDeletingBranch(branch)}
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
            dataLength={branches.length}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>

      {/* ── Modals ── */}
      <BranchModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <BranchModal
        open={!!editBranch}
        branch={editBranch}
        onClose={() => setEditBranch(null)}
      />
      <BranchDetailModal
        open={!!detailBranch}
        branch={detailBranch}
        onClose={() => setDetailBranch(null)}
        onEdit={(b) => {
          setDetailBranch(null);
          setEditBranch(b);
        }}
      />

      {/* ── Delete Confirm Dialog ── */}
      {deletingBranch && (
        <DeleteConfirmDialog
          projectTitle={deletingBranch.name}
          isPending={deleting}
          onConfirm={() => deleteBranch(deletingBranch.id)}
          onCancel={() => setDeletingBranch(null)}
        />
      )}
    </div>
  );
}
