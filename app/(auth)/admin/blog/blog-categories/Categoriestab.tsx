"use client";

import { useState } from "react";
import { FolderOpen, Eye, Pencil, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { BlogCategory } from "@/lib/types/admin/blogType";
import {
  useBlogCategories,
  useDeleteBlogCategory,
} from "@/lib/hooks/admin/useBlogCategory";
import Pagination from "@/components/pagination/page";
import BlogCategoryModal from "./blogCategoryModal";
import BlogCategoryDetailModal from "./blogCategoryDetails";
import {
  Spinner,
  EmptyState,
  SearchBar,
  FilterToggle,
  AddButton,
  FilterPill,
} from "../Shared";

const ACTIVE_FILTERS = [
  { l: "All", v: "" },
  { l: "Active", v: "true" },
  { l: "Inactive", v: "false" },
];

export default function CategoriesTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCat, setEditCat] = useState<BlogCategory | null>(null);
  const [detailCat, setDetailCat] = useState<BlogCategory | null>(null);

  const params: Record<string, unknown> = { page };
  if (search) params.q = search;
  if (filterActive !== "") params.is_active = filterActive === "true";

  const { data, isLoading, isError } = useBlogCategories(params);
  const categories = data?.data ?? [];
  const pagination = data?.pagination;

  useDeleteBlogCategory({
    onSuccess: () => toast.success("Category deleted"),
    onError: () => toast.error("Failed to delete category"),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search categories..."
        />
        <FilterToggle
          active={showFilters || filterActive !== ""}
          onClick={() => setShowFilters((s) => !s)}
        />
        <AddButton
          label="Add New Category"
          onClick={() => setCreateOpen(true)}
        />
      </div>

      {showFilters && (
        <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-[#4a4845]">Status:</span>
          {ACTIVE_FILTERS.map(({ l, v }) => (
            <FilterPill
              key={v}
              label={l}
              active={filterActive === v}
              onClick={() => {
                setFilterActive(v);
                setPage(1);
              }}
            />
          ))}
        </div>
      )}

      <div className="bg-white border border-[#d7efdc] rounded-2xl overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <p className="py-20 text-center text-sm text-red-500">
            Failed to load categories. Please try again.
          </p>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            label="categories"
            onAdd={() => setCreateOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[#e3e8e0] bg-[#f8faf7]">
                  {["Name", "Slug", "Parent", "Order", "Status", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-semibold text-[#8a8780] uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ede8]">
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-[#f8faf7] transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#1a1a2e] whitespace-nowrap">
                        {cat.name}
                      </p>
                      {cat.name_bangla && (
                        <p className="text-xs text-[#8a8780]">
                          {cat.name_bangla}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#1a1a2e]/8 text-[#1a1a2e] text-xs font-mono">
                        {cat.slug}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                      {cat.parent?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4a4845]">
                      {cat.order}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {cat.is_active ? (
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
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDetailCat(cat)}
                          className="p-1.5 rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e]"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditCat(cat)}
                          className="p-1.5 rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e]"
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

      {pagination && pagination.last_page > 1 && (
        <Pagination
          page={pagination.current_page}
          perPage={pagination.per_page}
          total={pagination.total}
          dataLength={categories.length}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
          onPageChange={(p) => setPage(p)}
        />
      )}

      <BlogCategoryModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <BlogCategoryModal
        open={!!editCat}
        category={editCat}
        onClose={() => setEditCat(null)}
      />
      <BlogCategoryDetailModal
        open={!!detailCat}
        category={detailCat}
        onClose={() => setDetailCat(null)}
        onEdit={(c) => {
          setDetailCat(null);
          setEditCat(c);
        }}
      />
    </div>
  );
}
