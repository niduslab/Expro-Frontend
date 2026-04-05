"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useExproMembers } from "@/lib/hooks/public/useExpromembers";

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
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container relative top-20 mx-auto px-6 md:px-12 lg:px-20 xl:px-20">
        <div className="text-center mb-8 flex flex-col items-center gap-5">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Advisory Council
          </h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48] mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
            Advisory Council
          </div>
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
          <div
            data-leadership-grid
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-6"
          >
            {advisors.map((member) => (
              <div
                key={member.id}
                data-leadership-card
                className="group relative w-full h-125 bg-[#F3F4F6] rounded-lg overflow-hidden border border-b border-[#E5E7EB]"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={member.image_url}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
                </div>

                {/* Top Right Icon */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-8 h-8 rounded-full bg-[#008A4B] flex items-center justify-center text-white">
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Bottom Content Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-5 shadow-sm">
                  <h3 className="text-[20px] font-bold text-[#101828] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#475467] text-sm font-normal mb-1">
                    {member.designation}
                  </p>
                  <p className="text-[#475467] text-xs font-normal">
                    EM No: {String(member.id).padStart(2, "0")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
