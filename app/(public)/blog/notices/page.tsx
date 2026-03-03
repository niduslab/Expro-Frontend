"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ArrowUpRight, Bell, Calendar } from "lucide-react";
import DemoNoticeTicker from "@/components/dev-warning/page";

type Notice = {
  id: string;
  title: string;
  date: string; // ISO string
  description: string;
  link?: string;
};

// Sample notices
const sampleNotices: Notice[] = [
  {
    id: "1",
    title: "Annual General Meeting",
    date: "2026-03-15",
    description:
      "The AGM will be held online to discuss annual reports and future plans.",
    link: "#",
  },
  {
    id: "2",
    title: "Pension Update",
    date: "2026-03-20",
    description:
      "New pension contribution guidelines and transparency report released.",
    link: "#",
  },
  {
    id: "3",
    title: "Community Workshop",
    date: "2026-03-25",
    description:
      "Workshop for members on financial literacy and community engagement.",
    link: "# ",
  },
];

const NoticePage = () => {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  return (
    <section className="text-black min-h-screen pt-32 pb-24 px-6">
      <DemoNoticeTicker />
      {/* Header */}
      <div className="text-center mb-16 flex flex-col items-center gap-5">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
          Notices
        </h2>

        <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
          Notices
        </div>

        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Stay updated with official announcements, reports, and community
          notices.
        </p>
      </div>

      {/* Notice List */}
      <div className="max-w-6xl mx-auto space-y-8 ">
        {sampleNotices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white hover:bg-gray-100 p-6 rounded-2xl shadow-lg cursor-pointer border border-gray-200 hover:shadow-xl transition duration-300"
            onClick={() => setSelectedNotice(notice)}
          >
            <div className="flex justify-between items-center">
              <h2 className="flex items-center gap-2 text-xl font-dm-sans  font-bold text-gray-800">
                <Bell className="h-4 w-4 text-[#027A48]" /> {notice.title}
              </h2>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(notice.date), "MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex w-full justify-between">
              {" "}
              <p className="text-gray-500 text-[13px] mt-2 ">
                {notice.description}
              </p>
              {notice.link && (
                <a
                  href={notice.link}
                  className="mt-2 flex items-center text-green-600 font-medium hover:underline"
                >
                  Read More <ArrowUpRight />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Notice Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-xl w-full shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold"
              onClick={() => setSelectedNotice(null)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedNotice.title}
            </h2>
            <p className="text-gray-500 mb-2">
              {format(new Date(selectedNotice.date), "MMMM d, yyyy")}
            </p>
            <p className="text-gray-700">{selectedNotice.description}</p>
            {selectedNotice.link && (
              <a
                href={selectedNotice.link}
                className="mt-4 inline-block text-green-600 font-semibold hover:underline"
              >
                More Info <ArrowUpRight />
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default NoticePage;
