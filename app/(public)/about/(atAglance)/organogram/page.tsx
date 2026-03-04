"use client";

import {
  DownloadIcon,
  FileText,
  MoveUpRightIcon,
  Notebook,
  TimerIcon,
} from "lucide-react";

const Organogram = () => {
  const pdfUrl = "/file/Annual-Edition-2026.pdf";

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center mb-4 pt-20 flex flex-col items-center gap-2">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
              Organogram Document
            </h2>

            <p className="text-gray-500 max-w-2xl">
              View and download your uploaded Organogram document below.
            </p>
          </div>

          {/* Card Container */}
          <div className="bg-white grid grid-cols-1 lg:grid-cols-[1fr_2fr] rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {/* LEFT SIDE — 1/3 */}
            <div className="flex flex-col justify-between bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
              {/* File Info */}
              <div className="p-8 space-y-8">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <FileText className="text-gray-700" size={26} />
                  </div>

                  {/* Text Info */}
                  <div className="space-y-2">
                    <div className="flex flex-col justify-between md:flex-row space-y-2 ">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Annual Edition
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm py-2 text-gray-500">
                      <span className="flex items-center gap-1">
                        <Notebook className="h-4 w-4" /> PDF Format
                      </span>

                      <span className="flex items-center gap-1">
                        <TimerIcon className="h-4 w-4" /> Updated: March 2026
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE — 2/3 PDF Preview */}
            <div className="p-8">
              {/* Actions */}
              <div className="p-2 pt-0 flex flex-wrap justify-center lg:justify-end gap-3">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                >
                  Open <MoveUpRightIcon size={14} className="text-green-500" />
                </a>

                <a
                  href={pdfUrl}
                  download
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#068847] text-white rounded-xl hover:bg-[#05703A] transition shadow-sm"
                >
                  Download
                  <DownloadIcon size={18} />
                </a>
              </div>
              <div className="w-full h-[650px] rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="Profile PDF Preview"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Organogram;
