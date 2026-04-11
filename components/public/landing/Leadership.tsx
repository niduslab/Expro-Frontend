"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useExproMembers } from "@/lib/hooks/public/useExpromembers";

gsap.registerPlugin(ScrollTrigger);

const Leadership = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { data, isLoading, error } = useExproMembers(1, 0);

  const latestExecutiveMembers =
    data?.data
      .filter((m) => m.designation === "Executive Member")
      .sort((a, b) => b.id - a.id)
      .slice(0, 6) ?? [];

  useEffect(() => {
    if (!sectionRef.current || latestExecutiveMembers.length === 0) return;

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
  }, [latestExecutiveMembers.length]);

  if (isLoading) {
    return (
      <section className="font-dm-sans py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 2xl:px-17">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full max-w-105.25 h-125 bg-[#F3F4F6] rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) return <div>Error: {error.message}</div>;

  if (latestExecutiveMembers.length === 0) return null;

  return (
    <section ref={sectionRef} className="font-dm-sans py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 2xl:px-17">
        <div data-leadership-header className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48] mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
            Our Team
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Meet Our Leadership
          </h2>
        </div>

        <div
          data-leadership-grid
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-16"
        >
          {latestExecutiveMembers.map((member) => (
            <div
              key={member.id}
              data-leadership-card
              className="group relative w-full max-w-105.25 h-125 bg-[#F3F4F6] rounded-lg overflow-hidden border border-b border-[#E5E7EB]"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={
                    member.image_url || "/images/dashboard/memberApproval/1.jpg"
                  }
                  alt={`${member.name} - ${member.designation}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized={member.image_url?.startsWith("http")}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>
              {/* Top Right Icon */}
              <Link
                href={`/projects/projectScheme/expromembers/${String(member.id)}`}
              >
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-8 h-8 rounded-full bg-[#008A4B] flex items-center justify-center text-white">
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </div>
                </div>
              </Link>{" "}
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

        <div className="text-center">
          <div data-leadership-button>
            <Link
              href="/projects/projectScheme"
              className="inline-block px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md"
            >
              View All Members
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leadership;
