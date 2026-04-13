"use client";

import Hero from "../hero";
import { useExproMember } from "@/lib/hooks/public/useExpromembers";
import { useParams } from "next/navigation";
import Image from "next/image";

const ExproMemberPage = () => {
  const params = useParams();
  const id = Number(params?.id);
  const { data: member, isLoading, isError } = useExproMember(id);

  return (
    <div className="font-dm-sans">
      <Hero />

      {/* Body Section */}
      <section className="bg-white py-16 px-6 md:px-12 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="flex flex-col md:flex-row gap-10 animate-pulse">
              <div className="w-full md:w-72 h-96 bg-gray-200 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-4 pt-4">
                <div className="h-8 bg-gray-200 rounded w-2/3" />
                <div className="h-5 bg-gray-100 rounded w-1/3" />
                <div className="h-px bg-gray-200 my-4" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          )}

          {/* Error */}
          {isError && (
            <p className="text-red-500 text-center py-10">
              Failed to load member details. Please try again.
            </p>
          )}

          {/* Member Data */}
          {member && (
            <div className="flex flex-col md:flex-row gap-10">
              {/* Photo */}
              <div className="shrink-0 w-full md:w-72">
                <div className="relative w-full md:w-72 h-96 rounded-2xl overflow-hidden shadow-md border border-gray-100">
                  <Image
                    src={member.image_url || "/fallback.jpg"}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    unoptimized={
                      !!(
                        member.image_url?.startsWith("http") ||
                        member.image_url?.startsWith("/")
                      )
                    }
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-6 pt-2">
                {/* Name & Designation */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {member.name}
                  </h2>
                  <p className="mt-2 text-lg font-medium text-[#008A4B]">
                    {member.designation}
                  </p>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#F9FAFB] rounded-xl px-5 py-4 border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                      Member ID
                    </p>
                    <p className="text-base font-semibold text-gray-800">
                      EM-{String(member.id).padStart(2, "0")}
                    </p>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-xl px-5 py-4 border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                      Designation
                    </p>
                    <p className="text-base font-semibold text-gray-800">
                      {member.designation}
                    </p>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-xl px-5 py-4 border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                      Member Since
                    </p>
                    <p className="text-base font-semibold text-gray-800">
                      {new Date(member.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-xl px-5 py-4 border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                      Status
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#027A48]">
                      <span className="h-2 w-2 rounded-full bg-[#027A48]" />
                      Active Member
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExproMemberPage;
