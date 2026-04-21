"use client";

import { useProject } from "@/lib/hooks/public/useProjects";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  CalendarDays,
  Wallet,
  TrendingUp,
  Tag,
  CheckCircle2,
} from "lucide-react";

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getFundsPercent = (
  raised?: number | string,
  budget?: number | string,
) => {
  const r = Number(raised ?? 0);
  const b = Number(budget ?? 0);
  if (!b) return 0;
  return Math.min(Math.round((r / b) * 100), 100);
};

const StatCard = ({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 w-auto flex flex-col gap-2">
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent ? "bg-[#00341C]" : "bg-[#e8f7ef]"}`}
    >
      <span className={accent ? "text-white" : "text-[#00341C]"}>{icon}</span>
    </div>
    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
      {label}
    </p>
    <p className="text-xl font-bold text-gray-900">{value}</p>
  </div>
);

const ProjectBody = () => {
  const params = useParams();
  const id = Number(params?.id);
  const { data: project, isLoading } = useProject(id);

  if (isLoading) {
    return (
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-14">
        <div className="space-y-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!project) return null;

  return (
    <section className="font-dm-sans container mx-auto px-6 md:px-12 lg:px-20 py-14 space-y-12">
      {/* Top: Description + Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Description */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              About This Project
            </h2>
            <div
              className="text-gray-600 text-base md:text-lg leading-relaxed [&>p]:mb-0"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Project Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Category"
            value={
              project.category
                ? project.category.charAt(0).toUpperCase() +
                  project.category.slice(1)
                : "N/A"
            }
            icon={<Tag className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 ">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-[#00341C]" />
          Project Timeline
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Start Date
              </p>
              <p className="text-base font-semibold text-gray-800">
                {formatDate(project.start_date)}
              </p>
            </div>
            <div className="hidden sm:flex items-center text-gray-300 text-2xl font-light">
              →
            </div>
            <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                End Date
              </p>
              <p className="text-base font-semibold text-gray-800">
                {formatDate(project.end_date)}
              </p>
            </div>
          </div>
          <div className="flex-1 bg-[#00341C] rounded-xl p-4 shadow-sm">
            <p className="text-xs text-green-300 uppercase tracking-wide mb-1">
              Status
            </p>
            <p className="text-base font-semibold text-white capitalize">
              {project.status ?? "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Project Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {project.gallery.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm group"
              >
                <Image
                  src={img}
                  alt={`${project.title} gallery image ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized={img?.startsWith("http")}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectBody;
