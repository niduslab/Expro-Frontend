"use client";

import { Pencil, Star, Images } from "lucide-react";
import { Gallery } from "@/lib/types/admin/galleryType";
import Image from "next/image";

interface GalleryDetailModalProps {
  open: boolean;
  onClose: () => void;
  gallery: Gallery | null;
  onEdit: (gallery: Gallery) => void;
}

const STATUS_STYLES: Record<string, string> = {
  published: "bg-[#DCFCE7] text-[#16A34A]",
  draft: "bg-[#FEF9C3] text-[#A16207]",
  archived: "bg-[#F3F4F6] text-[#6B7280]",
};

function DetailField({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-[12px] leading-[150%] tracking-[-0.01em] text-[#6A7282] uppercase">
        {label}
      </span>
      <span className="font-normal text-[14px] leading-[160%] tracking-[-0.01em] text-[#030712]">
        {value ?? "—"}
      </span>
    </div>
  );
}

function SectionDivider() {
  return <div className="w-full border border-[#E5E7EB]" />;
}

export default function GalleryDetailModal({
  open,
  onClose,
  gallery,
  onEdit,
}: GalleryDetailModalProps) {
  if (!open || !gallery) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusStr = String(gallery.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex flex-col w-full max-w-[680px] h-[90vh] bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex flex-col gap-2 px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
          <div className="flex justify-between items-center">
            <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
              Gallery Details
            </p>
            <button onClick={onClose} className="text-gray-500 hover:text-black">
              ✕
            </button>
          </div>
          <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
            Full information for this gallery.
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
          <div className="flex flex-col gap-6">

            {/* Section 1: Gallery Info */}
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                  Gallery Info
                </p>
                <div className="flex items-center gap-2">
                  {gallery.is_featured && (
                    <span className="inline-flex items-center gap-1 px-[10px] py-[4px] rounded-full bg-[#FEF9C3] text-[#A16207] font-semibold text-[12px]">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-[10px] py-[4px] rounded-full font-semibold text-[12px] capitalize ${STATUS_STYLES[statusStr] ?? "bg-gray-100 text-gray-500"}`}
                  >
                    ● {gallery.status_label ?? statusStr}
                  </span>
                </div>
              </div>

              <DetailField label="Title" value={gallery.title} />

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <span className="font-semibold text-[12px] text-[#6A7282] uppercase">
                    Slug
                  </span>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#1a1a2e]/8 text-[#1a1a2e] text-xs font-mono break-all">
                      {gallery.slug}
                    </span>
                  </div>
                </div>
                <div className="w-1/2">
                  <DetailField label="View Count" value={gallery.view_count} />
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField label="Images" value={gallery.images_count} />
                </div>
              </div>

              {gallery.description && (
                <DetailField label="Description" value={gallery.description} />
              )}

              {/* Cover Image */}
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-[12px] text-[#6A7282] uppercase">
                  Cover Image
                </span>
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[#E5E7EB] bg-[#f8faf7]">
                  {gallery.cover_image ? (
                    <Image
                      src={gallery.cover_image}
                      alt={gallery.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      unoptimized={gallery.cover_image?.startsWith("http")}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <Images className="w-10 h-10 text-[#D1D5DC]" />
                    </div>
                  )}
                </div>
              </div>

              <SectionDivider />
            </div>

            {/* Section 2: Image Previews */}
            {gallery.images && gallery.images.length > 0 && (
              <div className="flex flex-col gap-[16px]">
                <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                  Images ({gallery.images.length})
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {gallery.images.slice(0, 6).map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-square rounded-lg overflow-hidden border border-[#E5E7EB] bg-[#f8faf7]"
                    >
                      {img.image_path ? (
                        <Image
                          src={img.image_path}
                          alt={img.title ?? `Image ${img.id}`}
                          fill
                          className="object-cover"
                          sizes="160px"
                          unoptimized={img.image_path?.startsWith("http")}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <Images className="w-6 h-6 text-[#D1D5DC]" />
                        </div>
                      )}
                    </div>
                  ))}
                  {gallery.images.length > 6 && (
                    <div className="relative aspect-square rounded-lg overflow-hidden border border-[#E5E7EB] bg-[#f0f0f0] flex items-center justify-center">
                      <span className="text-sm font-semibold text-[#6A7282]">
                        +{gallery.images.length - 6}
                      </span>
                    </div>
                  )}
                </div>
                <SectionDivider />
              </div>
            )}

            {/* Section 3: Audit */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Audit
              </p>
              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Created By"
                    value={gallery.created_by?.name}
                  />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="Updated By"
                    value={gallery.updated_by?.name}
                  />
                </div>
              </div>
              <SectionDivider />
            </div>

            {/* Section 4: Record Info */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Record Info
              </p>
              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Created At"
                    value={formatDate(gallery.created_at)}
                  />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="Last Updated"
                    value={formatDate(gallery.updated_at)}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 flex items-center gap-[16px] px-6 py-4 border-t border-[#E5E7EB] bg-white">
          <button
            onClick={onClose}
            className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px]"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(gallery)}
            className="bg-[#068847] h-[48px] w-[180px] rounded-xl px-[16px] text-white flex items-center justify-center font-semibold text-[16px] gap-2"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Gallery</span>
          </button>
        </div>
      </div>
    </div>
  );
}
