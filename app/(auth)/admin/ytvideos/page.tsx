"use client";

import { useState, useRef } from "react";

import {
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  Eye,
  Trash2,
  Youtube,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";
import YouTubeVideoModal from "./youtubeVideoModal";
import YouTubeVideoDetailModal from "./youtubeVideoDetails";
import Pagination from "@/components/pagination/page";
import {
  GetYouTubeVideosParams,
  VideoStatus,
  YouTubeVideo,
} from "@/lib/types/admin/Ytvideostype";
import {
  useDeleteYouTubeVideo,
  useYouTubeVideos,
} from "@/lib/hooks/admin/useYoutubeVideosHook";
import DeleteConfirmDialog from "../projects/delete-confirmation";

const STATUS_FILTER_OPTIONS = [
  { label: "All", value: "" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
] as const;

const statusBadge: Record<
  VideoStatus,
  { bg: string; text: string; label: string }
> = {
  published: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    label: "Published",
  },
  draft: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Draft" },
  archived: { bg: "bg-gray-100", text: "text-gray-500", label: "Archived" },
};

export default function YouTubeVideosPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editVideo, setEditVideo] = useState<YouTubeVideo | null>(null);
  const [detailVideo, setDetailVideo] = useState<YouTubeVideo | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<YouTubeVideo | null>(null);

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

  // ── Query ──────────────────────────────────────────────────────────────────
  const params: GetYouTubeVideosParams = { page };
  if (search) params.search = search;
  if (filterStatus) params.status = filterStatus as VideoStatus;

  const { data, isLoading, isError } = useYouTubeVideos(params);
  const videos = data?.data ?? [];
  const pagination = data?.pagination;

  const { mutate: deleteVideo, isPending: deleting } = useDeleteYouTubeVideo();

  const handleDelete = () => {
    if (!deletingVideo) return;
    deleteVideo(deletingVideo.id, {
      onSuccess: () => {
        toast.success("Video deleted successfully");
        setDeletingVideo(null);
      },
      onError: () => {
        toast.error("Failed to delete video");
        setDeletingVideo(null);
      },
    });
  };

  return (
    <div className="min-h-screen font-['DM_Sans',sans-serif]">
      {/* ── Header ── */}
      <div className="bg-white border-b border-[#e8e6e0] flex items-center max-w-7xl mx-auto">
        <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
              YouTube Videos
            </p>
            <p className="text-sm text-[#4A5565]">
              Manage YouTube video gallery and featured content.
            </p>
          </div>
          <div className="flex justify-start sm:justify-end">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#068847] text-white whitespace-nowrap"
            >
              <Plus className="h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold">Add Video</span>
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
                placeholder="Search by title or description..."
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
              showFilters || filterStatus !== ""
                ? "bg-[#068847] text-white border-[#068847]"
                : "bg-white text-[#4a4845] border-[#e8e6e0] hover:border-[#1a1a2e]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {filterStatus !== "" && (
              <span className="w-2 h-2 rounded-full bg-white/70" />
            )}
          </button>
        </div>

        {/* ── Filter Panel ── */}
        {showFilters && (
          <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-[#4a4845]">Status:</span>
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setFilterStatus(opt.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === opt.value
                    ? "bg-[#068847] text-white"
                    : "bg-[#d7efdc] text-[#4a4845] hover:bg-[#ece9e0]"
                }`}
              >
                {opt.label}
              </button>
            ))}
            {filterStatus !== "" && (
              <button
                onClick={() => {
                  setFilterStatus("");
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
              <span className="text-sm">Loading videos...</span>
            </div>
          ) : isError ? (
            <div className="py-20 text-center text-sm text-red-500">
              Failed to load videos. Please try again.
            </div>
          ) : videos.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f5f4f0] flex items-center justify-center">
                <Youtube className="w-5 h-5 text-[#b8b5ae]" />
              </div>
              <p className="text-sm text-[#8a8780]">
                {search ? `No videos found for "${search}"` : "No videos found"}
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
                  Add your first video
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[750px]">
                <thead>
                  <tr className="border-b border-[#e3e8e0] bg-[#f8faf7]">
                    {[
                      "Thumbnail",
                      "Title",
                      "Video ID",
                      "Views",
                      "Status",
                      "Featured",
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
                  {videos.map((video) => {
                    const badge =
                      statusBadge[video.status] ?? statusBadge.draft;
                    return (
                      <tr
                        key={video.id}
                        className="hover:bg-[#f8faf7] transition-colors group"
                      >
                        {/* Thumbnail */}
                        <td className="px-5 py-3 whitespace-nowrap">
                          <div className="w-[72px] h-[42px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {video.thumbnail_url ? (
                              <img
                                src={video.thumbnail_url}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Youtube className="w-4 h-4 text-[#b8b5ae]" />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Title */}
                        <td className="px-5 py-4 max-w-[220px]">
                          <p
                            className="text-sm font-medium text-[#1a1a2e] truncate"
                            title={video.title}
                          >
                            {video.title}
                          </p>
                          <p className="text-xs text-[#8a8780] truncate">
                            {video.slug}
                          </p>
                        </td>

                        {/* Video ID */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#1a1a2e]/8 text-[#1a1a2e] text-xs font-mono font-semibold">
                            {video.youtube_video_id}
                          </span>
                        </td>

                        {/* Views */}
                        <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                          {video.view_count.toLocaleString()}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {badge.label}
                          </span>
                        </td>

                        {/* Featured */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {video.is_featured ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-medium">
                              <Star className="w-3 h-3 fill-[#2563EB]" />
                              Featured
                            </span>
                          ) : (
                            <span className="text-xs text-[#8a8780]">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setDetailVideo(video)}
                              className="p-1.5 rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e] transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditVideo(video)}
                              className="p-1.5 rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e] transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingVideo(video)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-[#8a8780] hover:text-[#FB2C36] transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
            dataLength={videos.length}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>

      {/* ── Modals ── */}
      <YouTubeVideoModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <YouTubeVideoModal
        open={!!editVideo}
        video={editVideo}
        onClose={() => setEditVideo(null)}
      />
      <YouTubeVideoDetailModal
        open={!!detailVideo}
        video={detailVideo}
        onClose={() => setDetailVideo(null)}
        onEdit={(v) => {
          setDetailVideo(null);
          setEditVideo(v);
        }}
      />

      {/* ── Delete Confirm ── */}
      {deletingVideo && (
        <DeleteConfirmDialog
          projectTitle={deletingVideo.title}
          isPending={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeletingVideo(null)}
        />
      )}
    </div>
  );
}
