"use client";

import { useState } from "react";
import {
  DownloadIcon,
  MoveUpRightIcon,
  FileText,
  Info,
  Notebook,
  TimerIcon,
} from "lucide-react";

const Rules = () => {
  // Array of PDFs
  const pdfs = [
    {
      name: "Annual Edition 2026",
      url: "/file/Annual-Edition-2026.pdf",
      updated: "March 2026",
      status: "Active",
    },
    {
      name: "Mid-Year Report 2025",
      url: "/file/Mid-Year-Report-2025.pdf",
      updated: "July 2025",
      status: "Active",
    },
    {
      name: "Quarterly Update Q1",
      url: "/file/Quarterly-Q1.pdf",
      updated: "Jan 2026",
      status: "Active",
    },
    {
      name: "Financial Overview 2025",
      url: "/file/Financial-2025.pdf",
      updated: "Dec 2025",
      status: "Inactive",
    },
    {
      name: "Policy Guidelines",
      url: "/file/Policy-Guidelines.pdf",
      updated: "Feb 2026",
      status: "Active",
    },
  ];

  // State to track selected PDF
  const [selectedPdf, setSelectedPdf] = useState(pdfs[0]);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center pt-10 sm:pt-16 flex flex-col items-center gap-3">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Rules Documents
          </h2>

          <p className="text-gray-500 text-sm sm:text-base max-w-2xl">
            View and download your uploaded rules documents below.
          </p>
        </div>

        {/* Main layout */}
        <div
          className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden 
                    grid grid-cols-1 lg:grid-cols-[280px_1fr] 
                    min-h-[500px] lg:min-h-[600px]"
        >
          {/* Sidebar */}
          <nav className="bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
            {/* Horizontal scroll on mobile, vertical on desktop */}
            <ul className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
              {pdfs.map((pdf) => {
                const isSelected = selectedPdf.url === pdf.url;

                return (
                  <li key={pdf.url} className="min-w-[220px] lg:min-w-0">
                    <button
                      onClick={() => setSelectedPdf(pdf)}
                      className={`w-full text-left px-4 sm:px-6 py-4 flex items-center gap-3 transition
                    ${
                      isSelected
                        ? "bg-slate-100 text-[#068847] font-semibold lg:rounded-r-2xl"
                        : "text-gray-700 hover:bg-slate-100"
                    }
                  `}
                    >
                      <FileText
                        size={20}
                        className={
                          isSelected ? "text-[#068847]" : "text-gray-600"
                        }
                      />
                      <span className="truncate text-sm sm:text-base">
                        {pdf.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Content */}
          <section className="p-4 sm:p-6 lg:p-8 flex flex-col">
            {/* Header + Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              {/* Title + meta */}
              <div className="flex flex-col gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 break-words">
                  {selectedPdf.name}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Notebook className="h-4 w-4" />
                    PDF Format
                  </span>

                  <span className="flex items-center gap-1">
                    <TimerIcon className="h-4 w-4" />
                    Updated: {selectedPdf.updated}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a
                  href={selectedPdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-5 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                >
                  Open
                  <MoveUpRightIcon size={14} className="text-green-500" />
                </a>

                <a
                  href={selectedPdf.url}
                  download
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#068847] text-white rounded-xl hover:bg-[#05703A] transition shadow-sm"
                >
                  Download
                  <DownloadIcon size={18} />
                </a>
              </div>
            </div>

            {/* PDF Preview */}
            <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-inner">
              <iframe
                src={selectedPdf.url}
                className="w-full h-[50vh] sm:h-[60vh] lg:h-[calc(100vh-300px)] min-h-[350px]"
                title={`${selectedPdf.name} Preview`}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Rules;
