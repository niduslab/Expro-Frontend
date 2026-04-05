"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ArrowUpRight,
  Bell,
  Calendar,
  DownloadIcon,
  X,
  FileText,
  Eye,
  ExternalLink,
} from "lucide-react";
import { useDocuments } from "@/lib/hooks/public/useDocumentPublicHooks";
import type { Document } from "@/lib/types/admin/documentType";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(doc: Document): string {
  const dateStr = doc.publish_date ?? doc.created_at;
  return format(new Date(dateStr), "MMMM d, yyyy");
}

function isPdf(doc: Document): boolean {
  return (
    doc.mime_type === "application/pdf" ||
    doc.file_name?.toLowerCase().endsWith(".pdf")
  );
}

// ── PDF Preview Panel ─────────────────────────────────────────────────────────
function PdfPreview({ doc }: { doc: Document }) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      {/* Toggle preview */}
      <button
        onClick={() => setShow((s) => !s)}
        className="font-dm-sans w-full flex items-center justify-center gap-2 text-sm font-medium border border-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-gray-50 transition"
      >
        <Eye size={15} />
        {show ? "Hide Preview" : "Preview Document"}
      </button>

      {show && (
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
          <iframe
            src={doc.file_url}
            title={doc.file_name}
            className="w-full h-[400px]"
          />
        </div>
      )}
    </div>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function NoticeModal({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const hasFile = !!doc.file_url;
  const canPreview = hasFile && isPdf(doc);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-[#ECFDF3] rounded-xl shrink-0">
              <Bell size={18} className="text-[#027A48]" />
            </div>
            <h3 className="font-dm-sans text-lg font-bold text-gray-900 leading-tight">
              {doc.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar size={13} />
            {formatDate(doc)}
          </div>

          {/* Description */}
          {doc.description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {doc.description}
            </p>
          )}

          {/* ── Attachment block ── */}
          {hasFile && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Attached Document
              </p>

              {/* File info row */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-700 min-w-0">
                  <FileText size={16} className="text-[#068847] shrink-0" />
                  <span className="truncate font-medium">{doc.file_name}</span>
                  {doc.file_size_formatted && (
                    <span className="text-xs text-gray-400 shrink-0">
                      {doc.file_size_formatted}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
                    title="Open in new tab"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <a
                    href={doc.file_url}
                    download={doc.file_name}
                    className="font-dm-sans flex items-center gap-1 text-xs font-medium bg-[#068847] text-white px-3 py-1.5 rounded-lg hover:bg-[#05703A] transition"
                  >
                    <DownloadIcon size={12} /> Download
                  </a>
                </div>
              </div>

              {/* Inline PDF preview toggle */}
              {canPreview && <PdfPreview doc={doc} />}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 shrink-0 flex justify-end border-t border-gray-50 pt-4">
          <button
            onClick={onClose}
            className="font-dm-sans text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function NoticeSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 space-y-3 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-5 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-28 bg-gray-200 rounded" />
      </div>
      <div className="h-3 w-full bg-gray-200 rounded" />
      <div className="h-3 w-4/5 bg-gray-200 rounded" />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const NoticePage = () => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const { documents, isLoading, error } = useDocuments({
    type: "notice",
    status: "active",
    per_page: 50,
    sort_by: "publish_date",
    sort_order: "desc",
  });

  return (
    <>
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <section className="text-black min-h-screen pt-20 lg:pt-24 pb-12">
          {/* Header */}
          <div className="text-center mb-10 pt-10 flex flex-col items-center gap-5">
            <h2 className="font-dm-sans text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
              Notices of EWF
            </h2>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48]">
              <span className="font-dm-sans h-1.5 w-1.5 rounded-full bg-[#027A48]" />
              Notices
            </div>
          </div>

          {/* Error */}
          {error && !isLoading && (
            <div className="text-center py-16 text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && documents.length === 0 && (
            <div className="text-center py-16">
              <Bell size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500">No notices published yet.</p>
            </div>
          )}

          {/* Skeleton */}
          {isLoading && (
            <div className="mx-auto space-y-6 sm:space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <NoticeSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Notice list */}
          {!isLoading && documents.length > 0 && (
            <div className="mx-auto space-y-6 sm:space-y-8">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white hover:bg-gray-50 p-4 sm:p-6 rounded-2xl shadow-lg cursor-pointer border border-gray-200 hover:shadow-xl transition duration-300"
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="font-dm-sans flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-800">
                      <Bell className="h-4 w-4 text-[#027A48] shrink-0" />
                      {doc.name}
                    </h2>
                    <span className="text-gray-400 text-xs sm:text-sm flex items-center gap-1 shrink-0">
                      <Calendar className="h-4 w-4" />
                      {formatDate(doc)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mt-2">
                    {doc.description && (
                      <p className="text-gray-500 text-sm sm:text-[13px] max-w-full sm:max-w-[80%] line-clamp-2">
                        {doc.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      {/* Show file badge on the card if attachment exists */}
                      {doc.file_url && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <FileText size={12} />
                          {doc.file_size_formatted ?? "PDF"}
                        </span>
                      )}
                      <span className="font-dm-sans flex items-center text-green-600 font-medium hover:text-green-700 whitespace-nowrap text-sm">
                        Read More <ArrowUpRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal */}
      {selectedDoc && (
        <NoticeModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}
    </>
  );
};

export default NoticePage;
