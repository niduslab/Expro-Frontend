"use client";

import { useState } from "react";
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
  Trash2,
  Eye,
  Building2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import BranchModal from "./branchModal";
import BranchDetailModal from "./branchDetails";
import Pagination from "@/components/pagination/page";

export default function BranchesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [detailBranch, setDetailBranch] = useState<Branch | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const params: Record<string, unknown> = { page };
  if (search) params.q = search;
  if (filterActive !== "") params.is_active = filterActive === "true";

  const { data, isLoading, isError } = useBranches(params);
  const branches = data?.data ?? [];
  const pagination = data?.pagination;

  const { mutate: deleteBranch, isPending: deleting } = useDeleteBranch({
    onSuccess: () => toast.success("Branch deleted successfully"),
    onError: () => toast.error("Failed to delete branch"),
  });

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;
    setDeletingId(id);
    deleteBranch(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  return (
    <div className="min-h-screen  font-['DM_Sans',sans-serif]">
      {/* Header */}
      <div className="bg-white border-b border-[#e8e6e0] flex items-center">
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

      <div className="max-w-7xl mx-auto  py-6 space-y-4">
        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8780]" />
            <input
              type="text"
              placeholder="Search branches..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e8e6e0] rounded-xl text-sm text-[#1a1a2e] placeholder:text-[#b8b5ae] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/10 focus:border-[#1a1a2e]"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
              showFilters || filterActive !== ""
                ? "bg-[#068847] text-white border-[#1a1a2e]"
                : "bg-white text-[#4a4845] border-[#e8e6e0] hover:border-[#1a1a2e]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {filterActive !== "" && (
              <span className="w-2 h-2 rounded-full bg-[#068847]" />
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 flex items-center gap-4">
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
          </div>
        )}

        {/* Table */}
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
              <p className="text-sm text-[#8a8780]">No branches found</p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="text-sm text-[#1a1a2e] underline underline-offset-2 font-medium"
              >
                Create your first branch
              </button>
            </div>
          ) : (
            /* Horizontal scroll wrapper — lets table breathe on small screens */
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
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {/* Always visible on mobile; hover-only on desktop */}
                        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <Pagination
            page={pagination.current_page}
            perPage={pagination.per_page} // if your API returns per_page
            total={pagination.total}
            dataLength={branches.length}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>

      {/* Modals */}
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
    </div>
  );
}
