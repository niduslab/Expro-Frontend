"use client";

import { Document } from "@/lib/types/admin/documentType";
import { Pencil, Download, FileText, Eye } from "lucide-react";

interface DocumentDetailModalProps {
  open: boolean;
  onClose: () => void;
  document: Document | null;
  onEdit: (document: Document) => void;
  onDownload: (document: Document) => void;
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

function StatusBadge({ status }: { status: Document["status"] }) {
  const map = {
    active: { bg: "#DCFCE7", text: "#16A34A", label: "Active" },
    inactive: { bg: "#FEE2E2", text: "#DC2626", label: "Inactive" },
    archived: { bg: "#F3F4F6", text: "#6B7280", label: "Archived" },
  };
  const s = map[status] ?? map.inactive;
  return (
    <span
      className="inline-flex items-center px-[10px] py-[4px] rounded-full font-semibold text-[12px] leading-[150%]"
      style={{ background: s.bg, color: s.text }}
    >
      ● {s.label}
    </span>
  );
}

export default function DocumentDetailModal({
  open,
  onClose,
  document,
  onEdit,
  onDownload,
}: DocumentDetailModalProps) {
  if (!open || !document) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex flex-col w-full max-w-[600px] h-[85vh] bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black overflow-hidden">
        {/* ── Fixed Header ── */}
        <div className="flex-shrink-0 flex flex-col gap-2 px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
          <div className="flex justify-between items-center">
            <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
              Document Details
            </p>
            <button onClick={onClose} className="text-gray-500 hover:text-black">
              ✕
            </button>
          </div>
          <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
            Full information for this document.
          </p>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
          <div className="flex flex-col gap-6">
            {/* Section 1: Document Info */}
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                  Document Info
                </p>
                <StatusBadge status={document.status} />
              </div>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField label="Document Name" value={document.name} />
                </div>
                <div className="w-1/2">
                  <DetailField label="Type" value={document.type_label} />
                </div>
              </div>

              {document.description && (
                <DetailField label="Description" value={document.description} />
              )}

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Publish Date"
                    value={
                      document.publish_date
                        ? new Date(document.publish_date).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" },
                          )
                        : null
                    }
                  />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="Featured"
                    value={document.is_featured ? "Yes" : "No"}
                  />
                </div>
              </div>

              <SectionDivider />
            </div>

            {/* Section 2: File Details */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                File Details
              </p>

              {/* File preview card */}
              <div className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
                <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#068847]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#030712] truncate">
                    {document.file_name}
                  </p>
                  <p className="text-[12px] text-[#6A7282]">
                    {document.file_size_formatted} · {document.mime_type}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Downloads"
                    value={document.download_count}
                  />
                </div>
                <div className="w-1/2">
                  <DetailField label="Views" value={document.view_count} />
                </div>
              </div>

              <SectionDivider />
            </div>

            {/* Section 3: Uploaded By */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Upload Info
              </p>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Uploaded By"
                    value={document.uploaded_by?.name}
                  />
                  <span className="text-[#6A7282] font-normal text-[12px] leading-[160%] tracking-[-0.01em]">
                    {document.uploaded_by?.email}
                  </span>
                </div>
                {document.updated_by && (
                  <div className="w-1/2">
                    <DetailField
                      label="Last Updated By"
                      value={document.updated_by.name}
                    />
                    <span className="text-[#6A7282] font-normal text-[12px] leading-[160%] tracking-[-0.01em]">
                      {document.updated_by.email}
                    </span>
                  </div>
                )}
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
                    value={formatDate(document.created_at)}
                  />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="Last Updated"
                    value={formatDate(document.updated_at)}
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
            onClick={() => onDownload(document)}
            className="h-[48px] px-[16px] rounded-xl border border-[#068847] text-[#068847] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em] gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          <button
            onClick={() => onEdit(document)}
            className="bg-[#068847] h-[48px] w-[180px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em] gap-2"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Document</span>
          </button>
        </div>
      </div>
    </div>
  );
}
