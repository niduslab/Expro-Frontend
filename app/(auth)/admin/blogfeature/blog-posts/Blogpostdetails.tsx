"use client";

import { Pencil, Star } from "lucide-react";
import { BlogPost } from "@/lib/types/admin/blogType";
import Image from "next/image";

interface BlogPostDetailModalProps {
  open: boolean;
  onClose: () => void;
  post: BlogPost | null;
  onEdit: (post: BlogPost) => void;
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

export default function BlogPostDetailModal({
  open,
  onClose,
  post,
  onEdit,
}: BlogPostDetailModalProps) {
  if (!open || !post) return null;

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

  const statusStr = String(post.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex flex-col w-full max-w-[680px] h-[90vh] bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex flex-col gap-2 px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
          <div className="flex justify-between items-center">
            <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
              Post Details
            </p>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
            Full information for this blog post.
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
          <div className="flex flex-col gap-6">
            {/* Section 1: Post Details */}
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                  Post Details
                </p>
                <div className="flex items-center gap-2">
                  {post.is_featured && (
                    <span className="inline-flex items-center gap-1 px-[10px] py-[4px] rounded-full bg-[#FEF9C3] text-[#A16207] font-semibold text-[12px]">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-[10px] py-[4px] rounded-full font-semibold text-[12px] capitalize ${STATUS_STYLES[statusStr] ?? "bg-gray-100 text-gray-500"}`}
                  >
                    ● {statusStr}
                  </span>
                </div>
              </div>

              <DetailField label="Title" value={post.title} />
              {post.title_bangla && (
                <DetailField label="Title (Bangla)" value={post.title_bangla} />
              )}

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <span className="font-semibold text-[12px] text-[#6A7282] uppercase">
                    Slug
                  </span>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#1a1a2e]/8 text-[#1a1a2e] text-xs font-mono break-all">
                      {post.slug}
                    </span>
                  </div>
                </div>
                <div className="w-1/2">
                  <DetailField label="View Count" value={post.view_count} />
                </div>
              </div>

              {post.excerpt && (
                <DetailField label="Excerpt" value={post.excerpt} />
              )}

              <div className="flex flex-col gap-2">
                <span className="font-semibold text-[12px] text-[#6A7282] uppercase">
                  Featured Image
                </span>

                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[#E5E7EB]">
                  <Image
                    src={
                      post.featured_image_url ||
                      "/images/dashboard/memberApproval/1.jpg"
                    }
                    alt={`${post.title} - ${post.slug}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized={post.featured_image_url?.startsWith("http")}
                  />
                </div>
              </div>

              <SectionDivider />
            </div>

            {/* Section 2: Content */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Content
              </p>
              <div className="bg-[#f8faf7] rounded-xl p-4 text-sm text-[#4a4845] leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap border border-[#e8e6e0]">
                {post.content || "—"}
              </div>
              <SectionDivider />
            </div>

            {/* Section 3: Publishing */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Publishing
              </p>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Author"
                    value={
                      post.author?.member?.name_english ?? post.author?.email
                    }
                  />
                </div>
                <div className="w-1/2">
                  <DetailField label="Category" value={post.category?.name} />
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Published At"
                    value={formatDate(post.published_at)}
                  />
                </div>
              </div>

              {(post.tags ?? []).length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[12px] text-[#6A7282] uppercase">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(post.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex px-2.5 py-1 rounded-full bg-[#d7efdc] text-[#068847] text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
                    value={formatDate(post.created_at)}
                  />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="Last Updated"
                    value={formatDate(post.updated_at)}
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
            onClick={() => onEdit(post)}
            className="bg-[#068847] h-[48px] w-[180px] rounded-xl px-[16px] text-white flex items-center justify-center font-semibold text-[16px] gap-2"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Post</span>
          </button>
        </div>
      </div>
    </div>
  );
}
