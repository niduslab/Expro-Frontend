"use client";

import { useState } from "react";
import {
  FileText,
  FolderOpen,
  Plus,
  Search,
  SlidersHorizontal,
  Eye,
  Pencil,
  Star,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { BlogPost, BlogCategory } from "@/lib/types/admin/blogType";
import {
  useBlogPosts,
  useDeleteBlogPost,
} from "@/lib/hooks/admin/useBlogPostHook";
import {
  useBlogCategories,
  useDeleteBlogCategory,
} from "@/lib/hooks/admin/useBlogCategory";
import Pagination from "@/components/pagination/page";
import BlogPostModal from "./blog-posts/Blogpostmodal";
import BlogPostDetailModal from "./blog-posts/Blogpostdetails";
import BlogCategoryModal from "./blog-categories/blogCategoryModal";
import BlogCategoryDetailModal from "./blog-categories/blogCategoryDetails";

// ─── Tab config ────────────────────────────────────────────────
const TABS = [
  { key: "posts", label: "Blog Posts", icon: FileText },
  { key: "categories", label: "Categories", icon: FolderOpen },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700",
  draft: "bg-amber-50  text-amber-700",
  archived: "bg-gray-100  text-gray-500",
};

// ─── Shared helpers ────────────────────────────────────────────
function Spinner() {
  return (
    <div className="py-20 flex flex-col items-center gap-3 text-[#8a8780]">
      <div className="w-8 h-8 border-2 border-[#1a1a2e]/20 border-t-[#1a1a2e] rounded-full animate-spin" />
      <span className="text-sm">Loading…</span>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  label,
  onAdd,
}: {
  icon: React.ElementType;
  label: string;
  onAdd: () => void;
}) {
  return (
    <div className="py-20 flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-[#f5f4f0] flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#b8b5ae]" />
      </div>
      <p className="text-sm text-[#8a8780]">No {label} found</p>
      <button
        onClick={onAdd}
        className="text-sm text-[#1a1a2e] underline underline-offset-2 font-medium"
      >
        Create {label.replace(/s$/, "s")}
      </button>
    </div>
  );
}

function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8780]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e8e6e0] rounded-xl text-sm placeholder:text-[#b8b5ae] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/10 focus:border-[#1a1a2e]"
      />
    </div>
  );
}

function FilterToggle({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
        active
          ? "bg-[#068847] text-white border-[#068847]"
          : "bg-white text-[#4a4845] border-[#e8e6e0] hover:border-[#1a1a2e]"
      }`}
    >
      <SlidersHorizontal className="w-4 h-4" />
      Filter
      {active && <span className="w-2 h-2 rounded-full bg-white/70" />}
    </button>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#068847] text-white text-sm font-semibold whitespace-nowrap"
    >
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-[#068847] text-white"
          : "bg-[#d7efdc] text-[#4a4845] hover:bg-[#c3e8ca]"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Root Page ─────────────────────────────────────────────────
export default function BlogPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("posts");

  return (
    <div className="min-h-screen font-['DM_Sans',sans-serif]">
      {/* Unified Header */}
      <div className="bg-white border-b border-[#e8e6e0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
            Blog
          </p>
          <p className="text-sm text-[#4A5565] mt-1 mb-5">
            Manage posts and categories from one place.
          </p>

          {/* Tab row */}
          <div className="flex items-center gap-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as TabKey)}
                className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === key
                    ? "text-[#068847] bg-[#f8faf7]"
                    : "text-[#6A7282] hover:text-[#030712] hover:bg-[#f5f4f0]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {activeTab === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#068847] rounded-t" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "posts" && <PostsTab />}
        {activeTab === "categories" && <CategoriesTab />}
      </div>
    </div>
  );
}

// ─── Posts Tab ─────────────────────────────────────────────────
function PostsTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [detailPost, setDetailPost] = useState<BlogPost | null>(null);

  const params: Record<string, unknown> = { page };
  if (search) params.q = search;
  if (filterStatus) params.status = filterStatus;
  if (filterFeatured !== "") params.is_featured = filterFeatured === "true";

  const { data, isLoading, isError } = useBlogPosts(params);
  const posts = data?.data ?? [];
  const pagination = data?.pagination;
  const hasFilters = filterStatus !== "" || filterFeatured !== "";

  useDeleteBlogPost({
    onSuccess: () => toast.success("Post deleted"),
    onError: () => toast.error("Failed to delete post"),
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search posts…"
        />
        <FilterToggle
          active={showFilters || hasFilters}
          onClick={() => setShowFilters((s) => !s)}
        />
        <AddButton label="New Post" onClick={() => setCreateOpen(true)} />
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 flex flex-wrap gap-x-8 gap-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-[#4a4845]">Status:</span>
            {[
              { l: "All", v: "" },
              { l: "Published", v: "published" },
              { l: "Draft", v: "draft" },
              { l: "Archived", v: "archived" },
            ].map(({ l, v }) => (
              <FilterPill
                key={v}
                label={l}
                active={filterStatus === v}
                onClick={() => {
                  setFilterStatus(v);
                  setPage(1);
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-[#4a4845]">
              Featured:
            </span>
            {[
              { l: "All", v: "" },
              { l: "Featured", v: "true" },
              { l: "Not featured", v: "false" },
            ].map(({ l, v }) => (
              <FilterPill
                key={v}
                label={l}
                active={filterFeatured === v}
                onClick={() => {
                  setFilterFeatured(v);
                  setPage(1);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#d7efdc] rounded-2xl overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <p className="py-20 text-center text-sm text-red-500">
            Failed to load posts. Please try again.
          </p>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={FileText}
            label="posts"
            onAdd={() => setCreateOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-[#e3e8e0] bg-[#f8faf7]">
                  {[
                    "Title",
                    "Category",
                    "Author",
                    "Status",
                    "Featured",
                    "Published At",
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
                {posts.map((post, index) => (
                  <tr
                    key={post.id ?? `${post.title}-${index}`}
                    className="hover:bg-[#f8faf7] transition-colors group"
                  >
                    <td className="px-5 py-4 max-w-[220px]">
                      <p className="text-sm font-medium text-[#1a1a2e] truncate">
                        {post.title}
                      </p>
                      {post.title_bangla && (
                        <p className="text-xs text-[#8a8780] truncate">
                          {post.title_bangla}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                      {post.category?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                      {post.author?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[String(post.status)] ?? "bg-gray-100 text-gray-500"}`}
                      >
                        {String(post.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Star
                        className={`w-4 h-4 ${post.is_featured ? "text-amber-400 fill-amber-400" : "text-[#d1d5dc]"}`}
                      />
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )
                        : "—"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1  transition-opacity">
                        <button
                          onClick={() => setDetailPost(post)}
                          className="p-1.5 rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e]"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditPost(post)}
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
          dataLength={posts.length}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
          onPageChange={(p) => setPage(p)}
        />
      )}

      <BlogPostModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <BlogPostModal
        open={!!editPost}
        post={editPost}
        onClose={() => setEditPost(null)}
      />
      <BlogPostDetailModal
        open={!!detailPost}
        post={detailPost}
        onClose={() => setDetailPost(null)}
        onEdit={(p) => {
          setDetailPost(null);
          setEditPost(p);
        }}
      />
    </div>
  );
}

// ─── Categories Tab ────────────────────────────────────────────
function CategoriesTab() {
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
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search categories…"
        />
        <FilterToggle
          active={showFilters || filterActive !== ""}
          onClick={() => setShowFilters((s) => !s)}
        />
        <AddButton label="New Category" onClick={() => setCreateOpen(true)} />
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-[#4a4845]">Status:</span>
          {[
            { l: "All", v: "" },
            { l: "Active", v: "true" },
            { l: "Inactive", v: "false" },
          ].map(({ l, v }) => (
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

      {/* Table */}
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
                      <div className="flex items-center gap-1  transition-opacity">
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
