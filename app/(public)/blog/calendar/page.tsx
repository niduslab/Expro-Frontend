"use client";

import { useState } from "react";
import { DownloadIcon, Eye, X, CalendarDays } from "lucide-react";
import { useDocuments } from "@/lib/hooks/public/useDocumentPublicHooks";
import type { Document } from "@/lib/types/admin/documentType";

function formatPublishDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// ── Preview Modal ────────────────────────────────────────────────────────────
function PreviewModal({
  doc,
  onClose,
}: {
  doc: Document;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-5xl h-[80vh] rounded-xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="font-dm-sans absolute top-4 right-4 z-10 flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-lg text-sm transition"
        >
          <X size={14} /> Close
        </button>
        <iframe
          src={doc.file_url}
          className="w-full h-full"
          title={`${doc.name} Preview`}
        />
      </div>
    </div>
  );
}

// ── Calendar Card ─────────────────────────────────────────────────────────────
function CalendarCard({
  doc,
  onPreview,
}: {
  doc: Document;
  onPreview: (doc: Document) => void;
}) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200 flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="p-4 bg-[#ECFDF3] rounded-2xl">
          <CalendarDays size={32} className="text-[#068847]" />
        </div>
        <h3 className="font-dm-sans text-xl font-bold text-gray-800">
          {doc.name}
        </h3>
        {doc.description && (
          <p className="text-gray-500 text-sm max-w-xs">{doc.description}</p>
        )}
        {doc.publish_date && (
          <p className="text-xs text-gray-400">
            {formatPublishDate(doc.publish_date)}
          </p>
        )}
        {doc.file_size_formatted && (
          <p className="text-xs text-gray-400">{doc.file_size_formatted}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
          onClick={() => onPreview(doc)}
          className="font-dm-sans flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition duration-300 text-sm"
        >
          <Eye size={16} /> Preview Calendar
        </button>
        <a
          href={doc.file_url}
          download={doc.file_name}
          className="font-dm-sans flex items-center justify-center gap-2 bg-[#027A48] text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition duration-300 text-sm"
        >
          <DownloadIcon size={16} /> Download (PDF)
        </a>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function CalendarSkeleton() {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200 flex flex-col items-center gap-6 animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-gray-200" />
      <div className="space-y-2 w-full flex flex-col items-center">
        <div className="h-5 w-48 bg-gray-200 rounded" />
        <div className="h-3 w-64 bg-gray-200 rounded" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <div className="h-12 w-40 bg-gray-200 rounded-xl" />
        <div className="h-12 w-40 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const CalendarPage = () => {
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  const { documents, isLoading, error } = useDocuments({
    type: "calendar",
    status: "active",
    per_page: 50,
    sort_by: "display_order",
    sort_order: "asc",
  });

  return (
    <>
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <section className="text-black min-h-screen pt-20 lg:pt-24 pb-12">
          {/* Header */}
          <div className="text-center mb-10 pt-10 flex flex-col items-center gap-5">
            <h2 className="font-dm-sans text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
              EWF Calendars
            </h2>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48]">
              <span className="font-dm-sans h-1.5 w-1.5 rounded-full bg-[#027A48]" />
              Calendar
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
              <CalendarDays size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500">
                No calendars available yet.
              </p>
            </div>
          )}

          {/* Skeleton */}
          {isLoading && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <CalendarSkeleton />
            </div>
          )}

          {/* Calendar list */}
          {!isLoading && documents.length > 0 && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {documents.map((doc) => (
                <CalendarCard
                  key={doc.id}
                  doc={doc}
                  onPreview={setPreviewDoc}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal */}
      {previewDoc && (
        <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      )}
    </>
  );
};

export default CalendarPage;
