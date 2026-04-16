"use client";

import { useExproMembers } from "@/lib/hooks/public/useExpromembers";
// REMOVE: import { refresh } from "next/cache";
import Image from "next/image";
import { useState } from "react";

const OurFounder = () => {
  // Fetch all members
  const { data, isLoading, refetch } = useExproMembers(1, 50);

  // Local state for button loading indicator
  const [isRetrying, setIsRetrying] = useState(false);

  // Find the founder specifically
  const founderMember = data?.data?.find((m) => m.designation === "Founder");

  // Handle retry click
  const handleRetry = async () => {
    if (!refetch) return;
    setIsRetrying(true);
    await refetch();
    setIsRetrying(false);
  };

  // 1. Loading State (Initial load only)
  if (isLoading && !data) {
    return (
      <section className="font-dm-sans py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="animate-pulse flex flex-col lg:flex-row gap-10 items-center">
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 aspect-[4/5] bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  // 2. No Data / Not Found State
  if (!founderMember) {
    return (
      <section className="font-dm-sans py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="flex flex-col items-center justify-center text-center py-10">
            <div className="p-4 rounded-full bg-gray-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Founder Not Found
            </h3>
            <p className="text-gray-500 mt-2 max-w-md">
              We couldn't find any member with the designation "Founder" in our
              records at this time.
            </p>
            <button
              onClick={handleRetry}
              disabled={isRetrying || isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-[#24a062] text-white rounded-md hover:bg-[#004d2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 3. Success State
  return (
    <section className="font-dm-sans py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:px-2 items-center">
          {/* Left Column */}
          <div className="space-y-5 md:space-y-6 order-2 lg:order-1 px-2 md:px-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]" />
              Our Founder
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] whitespace-nowrap font-bold text-gray-900 leading-[1.2]">
              About Our Founder
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-[15px] md:text-base">
              <p className="font-bold text-gray-900">
                {founderMember.name}
                <span className="font-normal text-gray-500">
                  , {founderMember.designation}, Expro Welfare Foundation.
                </span>
              </p>

              <p className="text-justify">
                A Visionary Educator and Reformer{" "}
                <span className="font-bold text-gray-900">
                  {founderMember.name}
                </span>{" "}
                is a distinguished academician and a pioneer in the social and
                economic development of modern Bangladesh.
              </p>

              <p className="text-justify">
                Core Philosophy — His life and work are guided by the resilient
                motto:{" "}
                <span className="font-bold italic text-gray-900">
                  "Winner never quit, quitter never win, so never never quit."
                </span>
              </p>

              <p className="text-justify">
                Driven by a deep sense of patriotism, he established the{" "}
                <span className="font-bold text-gray-900">
                  Expro Welfare Foundation
                </span>{" "}
                to bridge the gap between education and economic growth.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full mx-2 aspect-[4/5] rounded-lg overflow-hidden bg-[#F5F5F5]">
              <Image
                src={
                  founderMember.image_url ||
                  "/images/dashboard/memberApproval/1.jpg"
                }
                alt={`${founderMember.name} - ${founderMember.designation}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={founderMember.image_url?.startsWith("http")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurFounder;
