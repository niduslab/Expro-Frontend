"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useExproMembers } from "@/lib/hooks/public/useExpromembers";
import Link from "next/link";

const ADVISORY_DESIGNATIONS = [
  "Chief Advisors",
  "Advisor on International Affairs",
  "Legal Advisor",
  "Advisor",
] as const;

gsap.registerPlugin(ScrollTrigger);

export default function AdvisoryCounsil() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { data, isLoading } = useExproMembers(1, 50);

  const advisors =
    data?.data.filter((m) =>
      ADVISORY_DESIGNATIONS.includes(
        m.designation as (typeof ADVISORY_DESIGNATIONS)[number],
      ),
    ) ?? [];

  useEffect(() => {
    if (!sectionRef.current || advisors.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-leadership-header]", {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-leadership-header]",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from("[data-leadership-card]", {
        opacity: 0,
        y: 28,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: "[data-leadership-grid]",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from("[data-leadership-button]", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-leadership-button]",
          start: "top 90%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [advisors.length]);

  // Don't render the section at all if no advisors exist
  if (!isLoading && advisors.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-20 bg-white pt-12 md:pt-20">
      <div className="container relative top-20 mx-auto px-6 md:px-12 lg:px-20 xl:px-20">
        <div className="text-center mb-8 flex flex-col items-center gap-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48] ">
            <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
            Advisory Council
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Advisory Council
          </h2>
        </div>

        {isLoading ? (
          // Skeleton loader matching the card layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-125 bg-[#F3F4F6] rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <div
              data-leadership-grid
              className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 justify-items-center pt-[32px] mb-16"
            >
              {advisors.map((member) => (
                <div
                  key={member.id}
                  data-leadership-card
                  className="group relative w-full bg-white rounded-xl border border-[#E5E7EB] p-2 py-6 hover:z-10
                  flex flex-col items-center gap-2 hover:border-[#D0D5DD] hover:scale-105 hover:shadow-lg"
                >
                  {/* Arrow Link */}
                  <Link
                    href={`/projects/projectScheme/expromembers/${String(member.id)}`}
                    className="absolute top-2 right-2 z-10"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#008A4B] flex items-center justify-center">
                      <ArrowUpRight
                        size={10}
                        strokeWidth={2.5}
                        className="text-white"
                      />
                    </div>
                  </Link>

                  {/* Rounded Image */}
                  <div
                    className="w-[60px] h-[60px] rounded-full p-0.5 flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #D1FAE5, #6EE7B7)",
                    }}
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-[#E5E7EB] flex-shrink-0">
                      <Image
                        src={member.image_url || "/fallback.jpg"}
                        alt={`${member.name} - ${member.designation}`}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                        unoptimized={member.image_url?.startsWith("http")}
                      />
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="text-center pt-2">
                    <p className="text-[12px] font-medium text-[#101828] leading-tight">
                      {member.name}
                    </p>
                    <p className="text-[11px] text-[#475467] leading-tight mt-0.5">
                      {member.designation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
