"use client";

import { YouTubeVideo } from "@/lib/types/admin/Ytvideostype";
import { Pencil, Play } from "lucide-react";

interface YouTubeVideoDetailModalProps {
  open: boolean;
  onClose: () => void;
  video: YouTubeVideo | null;
  onEdit: (video: YouTubeVideo) => void;
}

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

export default function YouTubeVideoDetailModal({
  open,
  onClose,
  video,
  onEdit,
}: YouTubeVideoDetailModalProps) {
  if (!open || !video) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusColors: Record<
    string,
    { bg: string; text: string; dot: string }
  > = {
    published: { bg: "#DCFCE7", text: "#16A34A", dot: "●" },
    draft: { bg: "#FEF9C3", text: "#CA8A04", dot: "●" },
    archived: { bg: "#F3F4F6", text: "#6B7280", dot: "●" },
  };
  const sc = statusColors[video.status] ?? statusColors.draft;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex flex-col w-full max-w-[620px] h-[85vh] bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black overflow-hidden">
        {/* ── Fixed Header ── */}
        <div className="flex-shrink-0 flex flex-col gap-2 px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
          <div className="flex justify-between items-center">
            <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
              Video Details
            </p>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
            Full information for this YouTube video.
          </p>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
          <div className="flex flex-col gap-6">
            {/* Section 1: Thumbnail Preview */}
            {video.thumbnail_url && (
              <div className="flex flex-col gap-3">
                <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                  Preview
                </p>
                <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video group">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <a
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="bg-white/90 rounded-full p-3 shadow-md group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 text-[#068847] fill-[#068847]" />
                    </div>
                  </a>
                </div>
                <SectionDivider />
              </div>
            )}

            {/* Section 2: Video Details */}
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                  Video Details
                </p>
                <span
                  className="inline-flex items-center px-[10px] py-[4px] rounded-full font-semibold text-[12px] leading-[150%]"
                  style={{ background: sc.bg, color: sc.text }}
                >
                  {sc.dot} {video.status_label}
                </span>
              </div>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Video ID"
                    value={video.youtube_video_id}
                  />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="View Count"
                    value={video.view_count.toLocaleString()}
                  />
                </div>
              </div>

              <DetailField label="Title" value={video.title} />
              <DetailField label="Slug" value={video.slug} />

              {video.description && (
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[12px] leading-[150%] tracking-[-0.01em] text-[#6A7282] uppercase">
                    Description
                  </span>
                  <p className="font-normal text-[14px] leading-[160%] tracking-[-0.01em] text-[#030712] whitespace-pre-wrap">
                    {video.description}
                  </p>
                </div>
              )}

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <span className="font-semibold text-[12px] leading-[150%] tracking-[-0.01em] text-[#6A7282] uppercase block mb-1">
                    Featured
                  </span>
                  {video.is_featured ? (
                    <span className="inline-flex items-center px-[10px] py-[4px] rounded-full bg-[#EFF6FF] text-[#2563EB] font-semibold text-[12px]">
                      ★ Featured
                    </span>
                  ) : (
                    <span className="text-[14px] text-[#030712]">No</span>
                  )}
                </div>
                <div className="w-1/2">
                  <DetailField label="YouTube URL" value={video.youtube_url} />
                </div>
              </div>

              <SectionDivider />
            </div>

            {/* Section 3: Record Info */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Record Info
              </p>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Created By"
                    value={video.created_by?.email}
                  />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="Updated By"
                    value={video.updated_by?.email}
                  />
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Created At"
                    value={formatDate(video.created_at)}
                  />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="Last Updated"
                    value={formatDate(video.updated_at)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Fixed Footer ── */}
        <div className="flex-shrink-0 flex items-center gap-[16px] px-6 py-4 border-t border-[#E5E7EB] bg-white">
          <button
            onClick={onClose}
            className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] leading-[150%] tracking-[-0.01em]"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(video)}
            className="bg-[#068847] h-[48px] w-[180px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em] gap-2"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Video</span>
          </button>
        </div>
      </div>
    </div>
  );
}
