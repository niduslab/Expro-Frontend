"use client";

import { useState } from "react";
import { FileText, Star, Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import { BlogPost } from "@/lib/types/admin/blogType";
import {
  useBlogPosts,
  useDeleteBlogPost,
} from "@/lib/hooks/admin/useBlogPostHook";
import Pagination from "@/components/pagination/page";
import BlogPostModal from "./Blogpostmodal";
import BlogPostDetailModal from "./Blogpostdetails";
import {
  Spinner,
  EmptyState,
  SearchBar,
  FilterToggle,
  AddButton,
  FilterPill,
  STATUS_STYLES,
} from "../Shared";

const STATUS_FILTERS = [
  { l: "All", v: "" },
  { l: "Published", v: "published" },
  { l: "Draft", v: "draft" },
  { l: "Archived", v: "archived" },
];

const FEATURED_FILTERS = [
  { l: "All", v: "" },
  { l: "Featured", v: "true" },
  { l: "Not featured", v: "false" },
];

export default function PostsTab() {
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
  console.log(posts);
  const pagination = data?.pagination;
  const hasFilters = filterStatus !== "" || filterFeatured !== "";

  useDeleteBlogPost({
    onSuccess: () => toast.success("Post deleted"),
    onError: () => toast.error("Failed to delete post"),
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
          placeholder="Search posts..."
        />
        <FilterToggle
          active={showFilters || hasFilters}
          onClick={() => setShowFilters((s) => !s)}
        />
        <AddButton label="Add New Post" onClick={() => setCreateOpen(true)} />
      </div>

      {showFilters && (
        <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 flex flex-wrap gap-x-8 gap-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-[#4a4845]">Status:</span>
            {STATUS_FILTERS.map(({ l, v }) => (
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
            {FEATURED_FILTERS.map(({ l, v }) => (
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
                      {post.author?.member?.name_english ??
                        post.author?.email ??
                        "—"}
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
                      <div className="flex items-center gap-1">
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
