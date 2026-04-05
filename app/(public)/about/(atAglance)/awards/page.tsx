"use client";

import { useState, useEffect } from "react";
import {
  DownloadIcon,
  MoveUpRightIcon,
  FileText,
  Notebook,
  TimerIcon,
} from "lucide-react";
import { useDocuments } from "@/lib/hooks/public/useDocumentPublicHooks";
import type { Document } from "@/lib/types/admin/documentType";

function formatPublishDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function SidebarSkeleton() {
  return (
    <ul className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible p-3 gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="min-w-[220px] lg:min-w-0">
          <div className="h-12 rounded-xl bg-gray-200 animate-pulse" />
        </li>
      ))}
    </ul>
  );
}

function ContentSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4 animate-pulse">
      <div className="h-7 w-2/3 bg-gray-200 rounded-lg" />
      <div className="h-4 w-1/3 bg-gray-200 rounded-lg" />
      <div className="flex-1 rounded-2xl bg-gray-100 min-h-[450px]" />
    </div>
  );
}

const Awards = () => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const { documents, isLoading, error } = useDocuments({
    type: "awards",
    status: "active",
    per_page: 50,
    sort_by: "display_order",
    sort_order: "asc",
  });

  useEffect(() => {
    if (documents.length > 0 && !selectedDoc) {
      setSelectedDoc(documents[0]);
    }
  }, [documents, selectedDoc]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center pt-20 sm:pt-28 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 text-sm font-medium text-[#027A48]">
            <span className="font-dm-sans h-1.5 w-1.5 rounded-full bg-[#027A48]" />
            Award & Recognition
          </div>
          <h2 className="font-dm-sans text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Awards & Recognition Documents
          </h2>
        </div>

        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {error && !isLoading && (
            <div className="flex items-center justify-center rounded-3xl border border-red-100 bg-red-50 p-12 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!isLoading && !error && documents.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-16 text-center">
              <FileText size={40} className="mb-3 text-gray-300" />
              <p className="text-sm font-medium text-gray-600">
                No award documents available yet.
              </p>
            </div>
          )}

          {(isLoading || documents.length > 0) && (
            <div
              className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden 
                          grid grid-cols-1 lg:grid-cols-[280px_1fr] 
                          min-h-[500px] lg:min-h-[600px]"
            >
              {/* Sidebar */}
              <nav className="bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
                {isLoading ? (
                  <SidebarSkeleton />
                ) : (
                  <ul className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
                    {documents.map((doc) => {
                      const isSelected = selectedDoc?.id === doc.id;
                      return (
                        <li key={doc.id} className="min-w-[220px] lg:min-w-0">
                          <button
                            onClick={() => setSelectedDoc(doc)}
                            className={`w-full text-left px-4 sm:px-6 py-4 flex items-center gap-3 transition
                              ${
                                isSelected
                                  ? "bg-slate-100 text-[#068847] font-semibold lg:rounded-r-2xl"
                                  : "text-gray-700 hover:bg-slate-100 hover:underline"
                              }`}
                          >
                            <FileText
                              size={20}
                              className={
                                isSelected ? "text-[#068847]" : "text-gray-600"
                              }
                            />
                            <span className="font-dm-sans truncate text-sm sm:text-base">
                              {doc.name}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </nav>

              {/* Right Content */}
              {isLoading ? (
                <ContentSkeleton />
              ) : selectedDoc ? (
                <section className="p-4 sm:p-6 lg:p-8 flex flex-col">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <div className="flex flex-col gap-1 w-full">
                      <h2 className="text-xl font-dm-sans sm:text-2xl font-semibold text-gray-900 break-words">
                        {selectedDoc.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center font-dm-sans gap-1">
                          <Notebook className="h-3 w-3" /> Format: PDF
                        </span>
                        <span className="flex items-center font-dm-sans gap-1">
                          <TimerIcon className="h-3 w-3" />
                          Updated: {formatPublishDate(selectedDoc.publish_date)}
                        </span>
                        {selectedDoc.file_size_formatted && (
                          <span className="font-dm-sans text-gray-400">
                            {selectedDoc.file_size_formatted}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <a
                        href={selectedDoc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full font-dm-sans sm:w-auto inline-flex justify-center items-center gap-2 px-5 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                      >
                        Open
                        <MoveUpRightIcon size={14} className="text-[#068847]" />
                      </a>
                      <a
                        href={selectedDoc.file_url}
                        download={selectedDoc.file_name}
                        className="w-full font-dm-sans sm:w-auto inline-flex justify-center items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#068847] text-white rounded-xl hover:bg-[#05703A] transition shadow-sm"
                      >
                        Download
                        <DownloadIcon size={18} />
                      </a>
                    </div>
                  </div>

                  <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-inner">
                    <iframe
                      key={selectedDoc.id}
                      src={selectedDoc.file_url}
                      className="w-full h-[50vh] sm:h-[60vh] lg:h-[calc(100vh-300px)] min-h-[450px]"
                      title={`${selectedDoc.name} Preview`}
                    />
                  </div>
                </section>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Awards;
