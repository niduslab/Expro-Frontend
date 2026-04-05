"use client";

import Link from "next/link";
import { DownloadIcon, BookOpen } from "lucide-react";
import { useDocuments } from "@/lib/hooks/public/useDocumentPublicHooks";
import type { Document } from "@/lib/types/admin/documentType";

// ── Card ────────────────────────────────────────────────────────────────────
const MagazineCard = ({
  doc,
  featured = false,
}: {
  doc: Document;
  featured?: boolean;
}) => {
  return (
    <div
      className={`bg-blue-50 p-4  rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group ${
        featured ? "flex flex-col md:flex-row gap-0" : ""
      }`}
    >
      {/* Cover image — fall back to a placeholder if no image */}
      <div
        className={`overflow-hidden bg-gray-100 flex items-center justify-center ${
          featured ? "md:w-1/3 h-56 md:h-auto" : "h-30 md:h-42 xl:h-52"
        }`}
      >
        {(doc.file_url && doc.mime_type === "image/png") ||
        doc.mime_type === "image/jpeg" ? (
          <img
            src={doc.file_url}
            alt={`${doc.name} cover`}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
          />
        ) : (
          <BookOpen size={featured ? 64 : 40} className="text-gray-300" />
        )}
      </div>

      <div
        className={`p-6 flex flex-col justify-between ${featured ? "flex-1" : ""}`}
      >
        <div>
          <p className="text-xs font-medium text-[#068847] uppercase tracking-wide mb-1">
            {doc.publish_date
              ? new Date(doc.publish_date).getFullYear()
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
        </div>

        <div className="flex gap-3 mt-6">
          <a
            href={doc.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-dm-sans flex-1 text-center border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
          >
            Read
          </a>
          <a
            href={doc.file_url}
            download={doc.file_name}
            className="font-dm-sans flex-1 flex items-center justify-center gap-2 bg-[#068847] text-white py-2 rounded-lg hover:bg-[#05703A] transition text-sm font-medium"
          >
            Download <DownloadIcon size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
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

// ── Page ─────────────────────────────────────────────────────────────────────
const MagazinePage = () => {
  const { documents, isLoading, error } = useDocuments({
    type: "magazine",
    status: "active",
    per_page: 50,
    sort_by: "display_order",
    sort_order: "asc",
  });

  const [featured, ...previous] = documents;

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-20">
      <section className="bg-white min-h-screen pt-20 lg:pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-10 pt-10 flex flex-col items-center gap-2">
          <h2 className="font-dm-sans text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Our Magazine
          </h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 text-sm font-medium text-[#027A48]">
            <span className="font-dm-sans h-1.5 w-1.5 rounded-full bg-[#027A48]" />
            Magazine
          </div>
        </div>

        {/* Error */}
        {error && !isLoading && (
          <div className="text-center py-16 text-sm text-red-500">{error}</div>
        )}

        {/* Empty */}
        {!isLoading && !error && documents.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500">
              No magazine editions available yet.
            </p>
          </div>
        )}

        {/* Featured */}
        {(isLoading || featured) && (
          <div className="font-dm-sans mx-auto mb-16 max-w-7xl">
            {isLoading ? (
              <CardSkeleton featured />
            ) : (
              <MagazineCard doc={featured} featured />
            )}
          </div>
        )}

        {/* Previous Editions */}
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
                    <MagazineCard key={doc.id} doc={doc} />
                  ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MagazinePage;
