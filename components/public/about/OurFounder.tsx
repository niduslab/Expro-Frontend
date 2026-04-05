"use client";

import { useExproMembers } from "@/lib/hooks/public/useExpromembers";
import Image from "next/image";

const OurFounder = () => {
  // Fetch all members (adjust per_page if you have more than 10)
  const { data, isLoading } = useExproMembers(1, 50);

  const founder = data?.data.find(
    (m) =>
      m.designation === "Founder" || (m.designation === "Co-Founder" && false),
    // only "Founder" here:
  );
  // cleaner:
  const founderMember = data?.data.find((m) => m.designation === "Founder");

  // Don't render the section at all if no founder exists
  if (!isLoading && !founderMember) return null;

  // Show nothing while loading (or add a skeleton)
  if (isLoading || !founderMember) return null;

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

              {/* Keep your static bio paragraphs below, or make them dynamic too */}
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
                src={founderMember.image_url}
                alt={`${founderMember.name} - ${founderMember.designation}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurFounder;
