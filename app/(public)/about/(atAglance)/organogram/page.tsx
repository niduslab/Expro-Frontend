"use client";

import {
  DownloadIcon,
  FileText,
  MoveUpRightIcon,
  Notebook,
  TimerIcon,
} from "lucide-react";

const Organogram = () => {
  const pdfUrl = "/file/about/sample_organogram.pdf";

  return (
    <>
      <div className="min-h-screen   py-12">
        <div className="container  mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center mb-4 pt-20 sm:pt-28 flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4  text-sm font-medium text-[#027A48]">
              <span className="font-dm-sans h-1.5 w-1.5 rounded-full bg-[#027A48]" />
              Organogram
            </div>
            <h2 className="font-dm-sans text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
              Organogram Document
            </h2>
          </div>

          {/* Card Container */}
          <div className="container mx-auto px-6 md:px-12 lg:px-20 ">
            <div className="bg-white grid grid-cols-1 lg:grid-cols-[1fr_2fr] rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              {/* LEFT SIDE — 1/3 */}
              <div className="flex flex-col justify-between bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
                {/* File Info */}
                <div className="p-4 space-y-6 bg-green-50">
                  <div className="flex items-center sm:items-start gap-4">
                    {/* Icon */}
                    <div className="p-4  bg-white border border-gray-200 rounded-2xl shadow-sm">
                      <FileText className="text-[#068847]" size={26} />
                    </div>

                    {/* Text Info */}
                    <div className="space-y-2">
                      <div className="flex flex-col justify-between md:flex-row  ">
                        <h2 className="font-dm-sans text-xl font-semibold text-gray-900">
                          EWF Organogram 2026
                        </h2>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm  text-gray-500">
                        <span className="font-dm-sans flex items-center text-xs gap-1">
                          <Notebook className="h-3 w-3 " /> Format: PDF
                        </span>

                        <span className="font-dm-sans flex items-center text-xs gap-1">
                          <TimerIcon className="h-3 w-3 " /> Updated: March 2026
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE — 2/3 PDF Preview */}
              <div className="p-2">
                {/* Actions */}
                <div className="p-2 pb-6 sm:pb-1 flex flex-wrap justify-center sm:justify-end gap-3">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" font-dm-sans inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                  >
                    Open{" "}
                    <MoveUpRightIcon size={14} className="text-[#068847]" />
                  </a>

                  <a
                    href={pdfUrl}
                    download
                    className="font-dm-sans inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#068847] text-white rounded-xl hover:bg-[#05703A] transition shadow-sm"
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
      </div>
    </>
  );
};

export default Organogram;
