"use client";

import { useState } from "react";
import {
  DownloadIcon,
  X,
  CalendarDays,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useDocuments } from "@/lib/hooks/public/useDocumentPublicHooks";
import { downloadDocument } from "@/lib/api/functions/public/useDocumentPublicApi";
import { apiClient } from "@/lib";
import type { Document } from "@/lib/types/admin/documentType";

function formatPublishDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function resolveFileUrl(fileUrl: string) {
  return fileUrl.startsWith("http")
    ? fileUrl
    : `${apiClient.defaults.baseURL?.replace("/api/v1", "")}${fileUrl}`;
}

// ── PDF Thumbnail ─────────────────────────────────────────────────────────────
function PdfThumbnail({ url, featured }: { url: string; featured: boolean }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-gray-100 ${
        featured ? "md:w-1/3 h-56 md:h-auto" : "h-40 md:h-44 xl:h-52"
      }`}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      )}
      <iframe
        src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1`}
        className="border-0 absolute top-0 left-0"
        style={{
          width: "200%",
          height: "200%",
          transform: "scale(0.5)",
          transformOrigin: "top left",
          pointerEvents: "none",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s",
        }}
        onLoad={() => setLoaded(true)}
        title="PDF preview"
        aria-hidden="true"
      />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}

// ── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({
  doc,
  onClose,
}: {
  doc: Document;
  onClose: () => void;
}) {
  const fullUrl = resolveFileUrl(doc.file_url);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadDocument(doc.id, doc.file_name);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex flex-col w-full max-w-5xl h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#068847]/10 flex items-center justify-center shrink-0">
              <CalendarDays size={16} className="text-[#068847]" />
            </div>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {doc.name}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition text-xs font-medium"
            >
              <ExternalLink size={13} />
              Open in tab
            </a>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#068847] text-white hover:bg-[#05703A] transition text-xs font-medium disabled:opacity-60"
            >
              {downloading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <DownloadIcon size={13} />
              )}
              {downloading ? "Downloading..." : "Download"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-gray-100">
          <iframe
            src={`${fullUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            className="w-full h-full border-0"
            title={doc.name}
          />
        </div>
      </div>
    </div>
  );
}

// ── Calendar Card ─────────────────────────────────────────────────────────────
function CalendarCard({
  doc,
  featured = false,
  onRead,
}: {
  doc: Document;
  featured?: boolean;
  onRead: (doc: Document) => void;
}) {
  const fullUrl = resolveFileUrl(doc.file_url);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    setDownloading(true);
    try {
      await downloadDocument(doc.id, doc.file_name);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className={`bg-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group ${
        featured ? "flex flex-col md:flex-row" : ""
      }`}
    >
      <PdfThumbnail url={fullUrl} featured={featured} />
      <div
        className={`p-6 flex flex-col justify-between ${featured ? "flex-1" : ""}`}
      >
        <div>
          <p className="text-xs font-medium text-[#068847] uppercase tracking-wide mb-1">
            {doc.publish_date
              ? formatPublishDate(doc.publish_date)
              : new Date(doc.created_at).getFullYear()}
          </p>
          <h3 className="font-dm-sans text-xl font-bold text-gray-800">
            {doc.name}
          </h3>
          {doc.description && (
            <p className="text-gray-600 mt-3 text-sm leading-relaxed">
              {doc.description}
            </p>
          )}
          {doc.file_size_formatted && (
            <p className="text-xs text-gray-400 mt-2">
              {doc.file_size_formatted}
            </p>
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onRead(doc)}
            className="font-dm-sans flex-1 text-center border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
          >
            View
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="font-dm-sans flex-1 flex items-center justify-center gap-2 bg-[#068847] text-white py-2 rounded-lg hover:bg-[#05703A] transition text-sm font-medium disabled:opacity-70"
          >
            {downloading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                Download <DownloadIcon size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function CardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow animate-pulse overflow-hidden ${
        featured ? "flex flex-col md:flex-row" : ""
      }`}
    >
      <div
        className={`bg-gray-200 ${featured ? "md:w-1/3 h-56 md:h-auto" : "h-44"}`}
      />
      <div className="p-6 flex-1 space-y-3">
        <div className="h-3 w-16 bg-gray-200 rounded" />
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 rounded" />
        <div className="flex gap-3 mt-6">
          <div className="flex-1 h-9 bg-gray-200 rounded-lg" />
          <div className="flex-1 h-9 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const CalendarPage = () => {
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);

  const { documents, isLoading, error } = useDocuments({
    type: "calendar",
    status: "active",
    per_page: 50,
    sort_by: "display_order",
    sort_order: "asc",
  });

  const [featured, ...previous] = documents;

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-20">
      <section className="bg-white min-h-screen pt-32  pb-12">
        <div className="text-center mb-10 pt-10 flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 text-sm font-medium text-[#027A48]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
            Calendar
          </div>
          <h2 className="font-dm-sans text-3xl md:text-5xl font-bold tracking-tight text-gray-900 ">
            EWF Calendars
          </h2>
        </div>

        {error && !isLoading && (
          <div className="text-center py-16 text-sm text-red-500">{error}</div>
        )}

        {!isLoading && !error && documents.length === 0 && (
          <div className="text-center py-16">
            <CalendarDays size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500">No calendars available yet.</p>
          </div>
        )}

        {(isLoading || featured) && (
          <div className="font-dm-sans mx-auto mb-16 max-w-7xl">
            {isLoading ? (
              <CardSkeleton featured />
            ) : (
              <CalendarCard doc={featured} featured onRead={setViewingDoc} />
            )}
          </div>
        )}

        {(isLoading || previous.length > 0) && (
          <div className="mx-auto">
            <h2 className="font-dm-sans text-3xl font-bold text-center mb-14 text-gray-800">
              Previous Editions
            </h2>
            <div className="grid md:grid-cols-3 gap-10 font-dm-sans">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <CardSkeleton key={i} />
                  ))
                : previous.map((doc) => (
                    <CalendarCard
                      key={doc.id}
                      doc={doc}
                      onRead={setViewingDoc}
                    />
                  ))}
            </div>
          </div>
        )}
      </section>

      {viewingDoc && (
        <PreviewModal doc={viewingDoc} onClose={() => setViewingDoc(null)} />
      )}
    </div>
  );
};

export default CalendarPage;
