"use client";

import { format } from "date-fns";
import { BriefcaseIcon, CalendarIcon, MapPinIcon } from "lucide-react";

type Job = {
  id: string;
  title: string;
  location: string;
  type: "Full-time" | "Part-time" | "Internship" | "Contract";
  postedDate: string; // ISO string
  description: string;
  link?: string; // Apply link
};

// Sample job openings
const sampleJobs: Job[] = [
  {
    id: "1",
    title: "Expro Admin Intern",
    location: "Remote / Global",
    type: "Internship",
    postedDate: "2026-03-01",
    description:
      "Work on our web platform, implement features, optimize performance, and collaborate with cross-functional teams.",
  },
  {
    id: "2",
    title: "Expro Staff Member",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    postedDate: "2026-03-05",
    description:
      "Assist with marketing campaigns, social media content, and community engagement initiatives.",
  },
  {
    id: "3",
    title: "Expro Project Manager",
    location: "London, UK",
    type: "Full-time",
    postedDate: "2026-03-10",
    description:
      "Manage ongoing projects, coordinate teams, track progress, and ensure timely delivery of initiatives.",
  },
];

const CareerPage = () => {
  return (
    <section className="text-black min-h-screen pt-32 pb-24 px-6">
      {/* Header */}
      <div className="text-center mb-10 pt-10  flex flex-col items-center gap-5">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
          Careers
        </h2>

        <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
          Careers
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-2 gap-10">
        {sampleJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
          >
            <div className="p-6 flex flex-col h-full">
              {/* Job Title */}
              <h2 className="text-xl font-bold text-gray-950">{job.title}</h2>

              {/* Job Meta Info */}
              <div className="flex flex-wrap items-center text-gray-400 text-sm mt-2 gap-4">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span>
                    {format(new Date(job.postedDate), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>

              {/* Job Description */}
              <p className="text-gray-500 text-[14px] mt-4 flex-1 ">
                {job.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CareerPage;
