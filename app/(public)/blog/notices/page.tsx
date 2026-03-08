"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ArrowUpRight, Bell, Calendar } from "lucide-react";

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
    <>
      <div className="container mx-auto px-6 md:px-12 lg:px-20 ">
        {" "}
        <section className="text-black min-h-screen pt-20 lg:pt-24 pb-12">
          {/* Header */}
          <div className="text-center mb-10 pt-10  flex flex-col items-center gap-5">
            <h2 className="font-dm-sans text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
              Notices of EWF
            </h2>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48]">
              <span className="font-dm-sans h-1.5 w-1.5 rounded-full bg-[#027A48]" />
              Notices
            </div>
          </div>

          {/* Notice List */}
          <div className="mx-auto space-y-6 sm:space-y-8">
            {sampleNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white hover:bg-gray-100 p-4 sm:p-6 rounded-2xl shadow-lg cursor-pointer border border-gray-200 hover:shadow-xl transition duration-300"
                onClick={() => setSelectedNotice(notice)}
              >
                {/* Header */}
                <div className="font-dm-sans flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-800">
                    <Bell className="h-4 w-4 text-[#027A48]" />
                    {notice.title}
                  </h2>

                  <span className="text-gray-400 text-xs sm:text-sm flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(notice.date), "MMMM d, yyyy")}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mt-2">
                  <p className="text-gray-500 text-sm sm:text-[13px] max-w-full sm:max-w-[80%]">
                    {notice.description}
                  </p>

                  <span className="font-dm-sans flex items-center text-green-600 font-medium hover:text-green-700 whitespace-nowrap">
                    Read More <ArrowUpRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default NoticePage;
