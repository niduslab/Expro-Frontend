"use client";

import { useState } from "react";
import { ImageIcon, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { Gallery, GalleryImage } from "@/lib/types/admin/galleryType";
import {
  useGalleryImages,
  useDeleteGalleryImage,
} from "@/lib/hooks/admin/useGalleryHook";
import Pagination from "@/components/pagination/page";
import GalleryImageModal from "./GalleryImageModal";
import { FilterToggle, AddButton, FilterPill } from "../blogfeature/Shared";
import DeleteConfirmDialog from "../projects/delete-confirmation";
import Image from "next/image";
import { GalleryImageListParams } from "@/lib/types/admin/galleryType";

// Only use values accepted by GalleryImageListParams["sort_by"]
type SortKey = "display_order" | "recent";

const SORT_FILTERS: { label: string; value: SortKey }[] = [
  { label: "Display Order", value: "display_order" },
  { label: "Recent", value: "recent" },
];

interface GalleryImagesTabProps {
  galleryId: number;
}

export default function GalleryImagesTab({ galleryId }: GalleryImagesTabProps) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortKey>("display_order");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [editImage, setEditImage] = useState<GalleryImage | null>(null);
  const [deleteImage, setDeleteImage] = useState<GalleryImage | null>(null);

  // useDeleteGalleryImage takes no galleryId arg — galleryId + imageId come from variables
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteGalleryImage(
    {
      onSuccess: () => {
        toast.success("Image deleted");
        setDeleteImage(null);
      },
      onError: () => toast.error("Failed to delete image"),
    },
  );

  // Build params — sort_by only accepts "recent" | "display_order"
  const queryParams: GalleryImageListParams = {
    page,
    per_page: 12,
    sort_by: sortBy,
  };

  // useGalleryImages returns ApiResponse shape; pagination lives one level up
  const { data, isLoading, isError } = useGalleryImages(galleryId, queryParams);

  const images = data?.data ?? [];
  // The response body includes pagination at the top level alongside `data`
  const pagination = (data as any)?.pagination as
    | {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
      }
    | undefined;

  const handleSortChange = (newSort: SortKey) => {
    setSortBy(newSort);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* ─── Toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <FilterToggle
            active={showFilters}
            onClick={() => setShowFilters((s) => !s)}
          />
          <span className="text-sm text-[#6A7282]">
            {pagination?.total ?? 0} images
          </span>
        </div>
        <AddButton label="Add Image" onClick={() => setCreateOpen(true)} />
      </div>

      {/* ─── Sort Filter ─────────────────────────────────────── */}
      {showFilters && (
        <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 flex items-center gap-3 flex-wrap shadow-sm">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#8a8780]" />
            <span className="text-sm font-medium text-[#4a4845]">Sort by:</span>
          </div>
          {SORT_FILTERS.map(({ label, value }) => (
            <FilterPill
              key={value}
              label={label}
              active={sortBy === value}
              onClick={() => handleSortChange(value)}
            />
          ))}
        </div>
      )}

      {/* ─── Image Grid ──────────────────────────────────────── */}
      <div className="bg-white border border-[#d7efdc] rounded-2xl overflow-hidden min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
            <div className="w-8 h-8 border-2 border-[#d7efdc] border-t-green-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading images…</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-center p-4">
            <ImageIcon className="w-8 h-8 text-red-300" />
            <p className="text-sm text-red-500 font-medium">
              Failed to load images.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-center p-6">
            <div className="w-12 h-12 rounded-full bg-[#f0f9f1] flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-[#a3c9a8]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">
                No images yet
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Add your first image to get started
              </p>
            </div>
            <button
              onClick={() => setCreateOpen(true)}
              className="mt-1 text-xs font-medium text-white bg-green-700 hover:bg-green-950 px-3 py-1.5 rounded-lg transition-colors"
            >
              + Add Image
            </button>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-square rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#f8faf7] shadow-sm hover:shadow-md transition-all duration-200"
              >
                {img.image_path ? (
                  <Image
                    src={img.image_path || "/fallback.jpg"}
                    alt={img.title ?? `Image ${img.id}`}
                    width={256}
                    height={256}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized={img.image_path?.startsWith("http")}
                    onError={() =>
                      console.error("Image load error:", img.image_path)
                    }
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-50">
                    <ImageIcon className="w-8 h-8 text-[#D1D5DC]" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 z-10 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                  {/* Order badge — top left */}
                  <span className="text-white/80 text-[10px] font-medium bg-black/30 px-1.5 py-0.5 rounded w-fit">
                    Order: {img.display_order}
                  </span>

                  {/* Title + actions — bottom */}
                  <div className="flex items-end justify-between w-full gap-2">
                    {img.title && (
                      <span className="text-white text-xs font-semibold truncate drop-shadow-md max-w-[60%]">
                        {img.title}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditImage(img);
                        }}
                        className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-700 hover:text-blue-600 transition-colors shadow-sm"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteImage(img);
                        }}
                        className="p-1.5 rounded-lg bg-white/90 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors shadow-sm"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Pagination ──────────────────────────────────────── */}
      {pagination && pagination.total > 0 && (
        <Pagination
          page={pagination.current_page}
          perPage={pagination.per_page}
          total={pagination.total}
          dataLength={images.length}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
          onPageChange={(p) => setPage(p)}
        />
      )}

      {/* ─── Modals ──────────────────────────────────────────── */}
      <GalleryImageModal
        open={createOpen}
        galleryId={galleryId}
        onClose={() => setCreateOpen(false)}
      />
      <GalleryImageModal
        open={!!editImage}
        galleryId={galleryId}
        image={editImage}
        onClose={() => setEditImage(null)}
      />

      {deleteImage && (
        <DeleteConfirmDialog
          projectTitle={deleteImage.title ?? `Image #${deleteImage.id}`}
          isPending={isDeleting}
          onConfirm={() =>
            // Pass both galleryId and imageId as the DeleteGalleryImageVariables object
            deleteMutate(
              { galleryId: galleryId, imageId: deleteImage.id },
              { onSuccess: () => setDeleteImage(null) },
            )
          }
          onCancel={() => setDeleteImage(null)}
        />
      )}
    </div>
  );
}
