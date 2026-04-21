"use client";

import {
  X,
  Calendar,
  Tag,
  TrendingUp,
  DollarSign,
  Users,
  Star,
  Globe,
  ImageOff,
  CheckCircle2,
  Clock,
  Ban,
  Hourglass,
  PlayCircle,
} from "lucide-react";
import { Project } from "@/lib/types/projectType";
import FundRaiseProgress from "./fund-raise-progress";
import FormateDateTime from "@/components/formateDateTime/page";

interface ProjectViewModalProps {
  project: Project;
  onClose: () => void;
}

const statusConfig: Record<
  string,
  { label: string; icon: React.ReactNode; className: string }
> = {
  completed: {
    label: "Completed",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    className: "bg-[#DFF1E9] text-[#29A36A] border border-[#A8DAC3]",
  },
  ongoing: {
    label: "Ongoing",
    icon: <PlayCircle className="h-3.5 w-3.5" />,
    className: "bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]",
  },
  upcoming: {
    label: "Upcoming",
    icon: <Hourglass className="h-3.5 w-3.5" />,
    className: "bg-[#FEF1DA] text-[#F59F0A] border border-[#FBD89C]",
  },
  planned: {
    label: "Planned",
    icon: <Clock className="h-3.5 w-3.5" />,
    className: "bg-[#F3F4F6] text-[#6A7282] border border-[#D1D5DC]",
  },
  cancelled: {
    label: "Cancelled",
    icon: <Ban className="h-3.5 w-3.5" />,
    className: "bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]",
  },
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#F3F4F6] last:border-0">
      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#F3F4F6] text-[#068847] shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider">
          {label}
        </span>
        <span className="text-[14px] text-[#030712] font-medium leading-snug break-words">
          {value}
        </span>
      </div>
    </div>
  );
}

export default function ProjectViewModal({
  project,
  onClose,
}: ProjectViewModalProps) {
  const status = project.status ?? "planned";
  const statusInfo = statusConfig[status] ?? statusConfig["planned"];

  const formatCurrency = (val?: number) =>
    val != null ? `৳${val.toLocaleString("en-BD")}` : "—";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex flex-col w-full max-w-[680px] max-h-[90vh] bg-white rounded-2xl border border-[#E5E7EB] shadow-xl overflow-hidden">
        {/* ── Featured Image ── */}
        <div className="relative w-full h-[200px] sm:h-[240px] shrink-0 bg-[#F3F4F6]">
          {project.featured_image ? (
            <img
              src={project.featured_image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-[#D1D5DC]">
              <ImageOff className="h-10 w-10" />
              <span className="text-[13px]">No image available</span>
            </div>
          )}

          {/* Gradient overlay at bottom of image */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Status badge over image */}
          <div
            className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold ${statusInfo.className}`}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#4A5565] hover:text-black hover:bg-white transition-colors shadow-sm"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Badges over image bottom */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            {project.is_featured && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/90 text-amber-900 text-[11px] font-semibold backdrop-blur-sm">
                <Star className="h-3 w-3" /> Featured
              </span>
            )}
            {project.is_published && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#068847]/90 text-white text-[11px] font-semibold backdrop-blur-sm">
                <Globe className="h-3 w-3" /> Published
              </span>
            )}
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto">
          {/* Title section */}
          <div className="px-6 pt-5 pb-4 border-b border-[#E5E7EB]">
            <p className="text-[20px] font-semibold text-[#030712] leading-tight tracking-[-0.01em]">
              {project.title}
            </p>
            {project.title_bangla && (
              <p className="text-[15px] text-[#4A5565] mt-1">
                {project.title_bangla}
              </p>
            )}
            {project.category && (
              <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md bg-[#F3F4F6] text-[#4A5565] text-[12px] font-medium">
                <Tag className="h-3 w-3" />
                {project.category.charAt(0).toUpperCase() +
                  project.category.slice(1).replace(/_/g, " ")}
              </span>
            )}
          </div>

          <div className="px-6 py-4 flex flex-col gap-5">
            {/* Fund raise progress */}
            <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA]">
              <FundRaiseProgress
                raised={Number(project.funds_raised ?? 0)}
                goal={Number(project.budget ?? 1)}
              />
            </div>

            {/* Short description */}
            {project.short_description && (
              <div>
                <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">
                  Summary
                </p>
                <div
                  className="text-[14px] text-[#4A5565] leading-[1.7] [&>p]:mb-0"
                  dangerouslySetInnerHTML={{
                    __html: project.short_description,
                  }}
                />
              </div>
            )}

            {/* Full description */}
            {project.description && (
              <div>
                <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">
                  Description
                </p>
                <div
                  className="text-[14px] text-[#4A5565] leading-[1.7] prose prose-sm max-w-none [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>
            )}
            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 rounded-xl border border-[#E5E7EB] divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB] overflow-hidden">
              {/* Left column */}
              <div className="px-4 py-2">
                <InfoRow
                  icon={<DollarSign className="h-4 w-4" />}
                  label="Total Budget"
                  value={formatCurrency(project.budget)}
                />
                <InfoRow
                  icon={<TrendingUp className="h-4 w-4" />}
                  label="Funds Raised"
                  value={formatCurrency(project.funds_raised)}
                />
                <InfoRow
                  icon={<TrendingUp className="h-4 w-4" />}
                  label="Funds Utilized"
                  value={formatCurrency(project.funds_utilized)}
                />
              </div>

              {/* Right column */}
              <div className="px-4 py-2">
                <InfoRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Start Date"
                  value={
                    project.start_date ? (
                      <FormateDateTime
                        datetime={project.start_date}
                        type="date"
                      />
                    ) : (
                      "—"
                    )
                  }
                />
                <InfoRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="End Date"
                  value={
                    project.end_date ? (
                      <FormateDateTime
                        datetime={project.end_date}
                        type="date"
                      />
                    ) : (
                      "—"
                    )
                  }
                />
                <InfoRow
                  icon={<Users className="h-4 w-4" />}
                  label="Project Lead ID"
                  value={project.project_lead_id ?? "—"}
                />
              </div>
            </div>

            {project.gallery && project.gallery.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
                  Gallery
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {project.gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden bg-[#F3F4F6] border border-[#E5E7EB]"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1 pb-2 border-t border-[#F3F4F6]">
              {project.created_at && (
                <span className="text-[11px] text-[#9CA3AF]">
                  Created:{" "}
                  <FormateDateTime datetime={project.created_at} type="date" />
                </span>
              )}
              {project.updated_at && (
                <span className="text-[11px] text-[#9CA3AF]">
                  Updated:{" "}
                  <FormateDateTime datetime={project.updated_at} type="date" />
                </span>
              )}
              {project.slug && (
                <span className="text-[11px] text-[#9CA3AF]">
                  Slug: <span className="font-mono">{project.slug}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] shrink-0">
          <button
            onClick={onClose}
            className="w-full h-[44px] rounded-xl border border-[#E5E7EB] text-[#6A7282] font-medium text-[14px] hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
