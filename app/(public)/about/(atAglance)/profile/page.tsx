"use client";

import { useState } from "react";
import {
  DownloadIcon,
  FileText,
  MoveUpRightIcon,
  Notebook,
  TimerIcon,
  Loader2,
} from "lucide-react";
import { useDocuments } from "@/lib/hooks/public/useDocumentPublicHooks";
import { downloadDocument } from "@/lib/api/functions/public/useDocumentPublicApi";
import { apiClient } from "@/lib";

function formatPublishDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function resolveFileUrl(fileUrl: string) {
  return fileUrl.startsWith("http")
    ? fileUrl
    : `${apiClient.defaults.baseURL?.replace("/api/v1", "")}${fileUrl}`;
}

function SingleDocSkeleton() {
  return (
    <div className="bg-white grid grid-cols-1 lg:grid-cols-[1fr_2fr] rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      <div className="p-4 bg-green-50 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gray-200" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-3/4 bg-gray-200 rounded" />
          <div className="h-3 w-1/2 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-end gap-2">
          <div className="h-9 w-20 bg-gray-200 rounded-xl" />
          <div className="h-9 w-28 bg-gray-200 rounded-xl" />
        </div>
        <div className="w-full h-[650px] rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}

const Profile = () => {
  const [downloading, setDownloading] = useState(false);

  const { documents, isLoading, error } = useDocuments({
    type: "profile",
    status: "active",
    per_page: 1,
    sort_by: "display_order",
    sort_order: "asc",
  });

  const doc = documents[0] ?? null;
  const fullUrl = doc ? resolveFileUrl(doc.file_url) : "";

  const handleDownload = async () => {
    if (!doc) return;
    setDownloading(true);
    try {
      await downloadDocument(doc.id, doc.file_name);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center mb-4 pt-20 sm:pt-28 flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 text-sm font-medium text-[#027A48]">
            <span className="font-dm-sans h-1.5 w-1.5 rounded-full bg-[#027A48]" />
            Profile
          </div>
          <h2 className="font-dm-sans text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Profile Document
          </h2>
        </div>

        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {/* Error */}
          {error && !isLoading && (
            <div className="flex items-center justify-center rounded-3xl border border-red-100 bg-red-50 p-12 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && !doc && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-16 text-center">
              <FileText size={40} className="mb-3 text-gray-300" />
              <p className="text-sm font-medium text-gray-600">
                No profile document available yet.
              </p>
            </div>
          )}

          {/* Skeleton */}
          {isLoading && <SingleDocSkeleton />}

          {/* Content */}
          {!isLoading && doc && (
            <div className="bg-white grid grid-cols-1 lg:grid-cols-[1fr_2fr] rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              {/* LEFT — file info */}
              <div className="flex flex-col justify-between bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
                <div className="p-4 space-y-6 bg-green-50">
                  <div className="flex items-center sm:items-start gap-4">
                    <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm shrink-0">
                      <FileText className="text-[#068847]" size={26} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="font-dm-sans text-xl font-semibold text-gray-900">
                        {doc.name}
                      </h2>
                      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-start xl:items-center gap-2 text-sm text-gray-500">
                        <span className="font-dm-sans flex items-center text-xs gap-1">
                          <Notebook className="h-3 w-3" /> Format: PDF
                        </span>
                        <span className="font-dm-sans flex items-center text-xs gap-1">
                          <TimerIcon className="h-3 w-3" />
                          Updated: {formatPublishDate(doc.publish_date)}
                        </span>
                      </div>
                      {doc.file_size_formatted && (
                        <p className="text-xs text-gray-400">
                          {doc.file_size_formatted}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — PDF preview */}
              <div className="p-2">
                <div className="p-2 pb-6 sm:pb-1 flex flex-wrap justify-center sm:justify-end gap-3">
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-dm-sans inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                  >
                    Open{" "}
                    <MoveUpRightIcon size={14} className="text-[#068847]" />
                  </a>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="font-dm-sans inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#068847] text-white rounded-xl hover:bg-[#05703A] transition shadow-sm disabled:opacity-70"
                  >
                    {downloading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        Download
                        <DownloadIcon size={18} />
                      </>
                    )}
                  </button>
                </div>
                <div className="w-full h-[650px] rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                  <iframe
                    src={`${fullUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                    className="w-full h-full"
                    title={`${doc.name} Preview`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
