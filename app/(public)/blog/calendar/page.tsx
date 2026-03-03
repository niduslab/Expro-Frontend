"use client";

import { useState } from "react";

const CalendarPage = () => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <section className="text-black min-h-screen pt-32 pb-24 px-6">
      {/* Header */}
      <div className="text-center mb-12 flex flex-col items-center gap-5">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
          Calendar
        </h2>

        <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
          Calendar
        </div>
      </div>

      {/* Download Section */}
      <div className="max-w-3xl mx-auto text-center bg-white shadow-lg rounded-2xl p-10 border border-gray-200">
        <p className="text-lg text-gray-600 mb-8">
          Please click below to preview or download the latest calendar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Preview Button */}
          <button
            onClick={() => setShowPreview(true)}
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition duration-300"
          >
            Preview Calendar
          </button>

          {/* Download Button */}
          <a
            href="/file/Annual-Edition-2026.pdf"
            download
            className="bg-[#027A48] text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition duration-300"
          >
            Download Calendar (PDF)
          </a>
        </div>
      </div>

      {/* Modal Preview */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl h-[80vh] rounded-xl overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1 rounded-lg"
            >
              Close
            </button>

            {/* PDF Viewer */}
            <iframe
              src="/file/Annual-Edition-2026.pdf"
              className="w-full h-full"
              title="Calendar Preview"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default CalendarPage;
