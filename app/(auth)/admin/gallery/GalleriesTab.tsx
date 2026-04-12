"use client";

import { useState } from "react";
import {
  Images,
  Star,
  Eye,
  Pencil,
  Trash2,
  X,
  Search,
  LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";
import { Gallery, GalleryStatus } from "@/lib/types/admin/galleryType";
import {
  useGalleries,
  useDeleteGallery,
} from "@/lib/hooks/admin/useGalleryHook";
import Pagination from "@/components/pagination/page";
import GalleryModal from "./GalleryModal";
import GalleryDetailModal from "./GalleryDetails";
import {
  Spinner,
  EmptyState,
  FilterToggle,
  AddButton,
  FilterPill,
  STATUS_STYLES,
} from "../blogfeature/Shared";
import DeleteConfirmDialog from "../projects/delete-confirmation";
import Image from "next/image";
import { GalleryListParams } from "@/lib/types/admin/galleryType";

const STATUS_FILTERS: { l: string; v: GalleryStatus | "" }[] = [
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

interface GalleriesTabProps {
  onViewImages: (gallery: { id: number; title: string }) => void; // ← narrowed type is fine, Gallery still satisfies it
}
export default function GalleriesTab({ onViewImages }: GalleriesTabProps) {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<GalleryStatus | "">("");
  const [filterFeatured, setFilterFeatured] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editGallery, setEditGallery] = useState<Gallery | null>(null);
  const [detailGallery, setDetailGallery] = useState<Gallery | null>(null);
  const [deleteGallery, setDeleteGallery] = useState<Gallery | null>(null);
  const [inputSearch, setInputSearch] = useState("");
  const [search, setSearch] = useState("");

  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteGallery({
    onSuccess: () => toast.success("Gallery deleted"),
    onError: () => toast.error("Failed to delete gallery"),
  });

  const params: GalleryListParams = { page };
  if (search) params.search = search;
  if (filterStatus) params.status = filterStatus;
  if (filterFeatured !== "") params.is_featured = filterFeatured === "true";

  // useGalleries returns PaginatedResponse shape: { data, pagination }
  const { data, isLoading, isError } = useGalleries(params);
  const galleries = data?.data ?? [];
  // `data` here is the full PaginatedResponse<Gallery> body from the hook
  const pagination = (data as any)?.pagination as
    | {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
      }
    | undefined;
  const hasFilters = filterStatus !== "" || filterFeatured !== "";

  return (
    <div className="space-y-4">
      {/* ─── Toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8780] pointer-events-none" />
              <input
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearch(inputSearch);
                    setPage(1);
                  }
                }}
                placeholder="Search galleries..."
                className="pl-9 pr-8 h-9 w-64 cursor-pointer rounded-lg border border-[#e8e6e0] bg-white text-sm text-[#1a1a2e] placeholder:text-[#8a8780] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
              />
              {inputSearch && (
                <button
                  onClick={() => {
                    setInputSearch("");
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute cursor-pointer right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e] transition-colors"
                  title="Clear"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setSearch(inputSearch);
                setPage(1);
              }}
              className="flex items-center cursor-pointer gap-1.5 px-4 h-9 rounded-lg bg-[#068847] hover:bg-green-700 text-white text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
          </div>

          <FilterToggle
            active={showFilters || hasFilters}
            onClick={() => setShowFilters((s) => !s)}
          />
        </div>
        <AddButton
          label="Add New Gallery"
          onClick={() => setCreateOpen(true)}
        />
      </div>

      {/* ─── Filters ─────────────────────────────────────────── */}
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

      {/* ─── Table ───────────────────────────────────────────── */}
      <div className="bg-white border border-[#d7efdc] rounded-2xl overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <p className="py-20 text-center text-sm text-red-500">
            Failed to load galleries. Please try again.
          </p>
        ) : galleries.length === 0 ? (
          <EmptyState
            icon={Images}
            label="galleries"
            onAdd={() => setCreateOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#e3e8e0] bg-[#f8faf7]">
                  {[
                    "Cover",
                    "Title",
                    "Slug",
                    "Images",
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
                {galleries.map((gallery, index) => (
                  <tr
                    key={gallery.id ?? `${gallery.title}-${index}`}
                    className="hover:bg-[#f8faf7] transition-colors group"
                  >
                    {/* Cover thumbnail */}
                    <td className="px-5 py-4">
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-[#E5E7EB] bg-[#f8faf7]">
                        {gallery.cover_image ? (
                          <Image
                            src={gallery.cover_image || "/fallback.jpg"}
                            alt={`${gallery.title} - ${gallery.slug}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                            unoptimized={gallery.cover_image?.startsWith(
                              "http",
                            )}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <Images className="w-5 h-5 text-[#D1D5DC]" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-5 py-4 max-w-[200px]">
                      <p className="text-sm font-medium text-[#1a1a2e] truncate">
                        {gallery.title}
                      </p>
                      {gallery.description && (
                        <p className="text-xs text-[#8a8780] truncate mt-0.5">
                          {gallery.description}
                        </p>
                      )}
                    </td>

                    {/* Slug */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#1a1a2e]/8 text-[#1a1a2e] text-xs font-mono">
                        {gallery.slug}
                      </span>
                    </td>

                    {/* Images count */}
                    <td className="px-5 py-4 text-sm text-[#4a4845]">
                      {gallery.images_count}
                    </td>

                    {/* View count */}
                    <td className="px-5 py-4 text-sm text-[#4a4845]">
                      {gallery.view_count}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[String(gallery.status)] ?? "bg-gray-100 text-gray-500"}`}
                      >
                        {gallery.status_label ?? String(gallery.status)}
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="px-5 py-4">
                      <Star
                        className={`w-4 h-4 ${gallery.is_featured ? "text-amber-400 fill-amber-400" : "text-[#d1d5dc]"}`}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDetailGallery(gallery)}
                          className="p-1.5 cursor-pointer rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e]"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onViewImages(gallery)}
                          className="p-1.5 cursor-pointer rounded-lg hover:bg-[#d7efdc] text-[#8a8780] hover:text-[#068847]"
                          title="Manage images"
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditGallery(gallery)}
                          className="p-1.5 cursor-pointer rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e]"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteGallery(gallery)}
                          className="p-1.5 cursor-pointer rounded-lg hover:bg-red-50 text-[#8a8780] hover:text-red-500 transition-colors"
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

      {/* ─── Pagination ──────────────────────────────────────── */}
      {pagination && pagination.total > 0 && (
        <Pagination
          page={pagination.current_page}
          perPage={pagination.per_page}
          total={pagination.total}
          dataLength={galleries.length}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
          onPageChange={(p) => setPage(p)}
        />
      )}

      {/* ─── Modals ──────────────────────────────────────────── */}
      <GalleryModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <GalleryModal
        open={!!editGallery}
        gallery={editGallery}
        onClose={() => setEditGallery(null)}
      />
      <GalleryDetailModal
        open={!!detailGallery}
        gallery={detailGallery}
        onClose={() => setDetailGallery(null)}
        onEdit={(g) => {
          setDetailGallery(null);
          setEditGallery(g);
        }}
      />
      {deleteGallery && (
        <DeleteConfirmDialog
          projectTitle={deleteGallery.title}
          isPending={isDeleting}
          onConfirm={() =>
            deleteMutate(deleteGallery.id, {
              onSuccess: () => setDeleteGallery(null),
            })
          }
          onCancel={() => setDeleteGallery(null)}
        />
      )}
    </div>
  );
}
