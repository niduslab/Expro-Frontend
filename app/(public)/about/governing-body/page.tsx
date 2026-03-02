"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

const team = [
  {
    name: "Md. Motahar Hossen",
    role: "Founder & Chairman",
    emNo: "01",
    image: "/images/landing-page/our-leadership/06-md-ataur-rahman.png",
  },
  {
    name: "Md. Hashan Sofiul Kabir",
    role: "Vice-Chairman & Director General",
    emNo: "02",
    image: "/images/landing-page/our-leadership/05-md-nur-islam.png",
  },
  {
    name: "Md. Ahsanuzzaman",
    role: "Secretary & Executive Director",
    emNo: "03",
    image: "/images/landing-page/our-leadership/03-md-ahsanuzzaman.png",
  },
  {
    name: "Md. Yusuf Ali Khandaker",
    role: "Treasurer & Director Finance",
    emNo: "04",
    image: "/images/landing-page/our-leadership/04-md-yusuf-ali-khandaker.png",
  },
  {
    name: "Md. Nur Islam",
    role: "Director Administration",
    emNo: "05",
    image: "/images/landing-page/our-leadership/01-md-motahar-hossen.png",
  },
  {
    name: "Md. Ataur Rahman",
    role: "Director of Marketing",
    emNo: "06",
    image: "/images/landing-page/our-leadership/02-md-hashan-sofiul-kabir.png",
  },
  {
    name: "Md. Motasim Billah",
    role: "Director of Inspection",
    emNo: "07",
    image: "/images/landing-page/our-leadership/07-md-motasim-billah.png",
  },
  {
    name: "Md. Abdul Mottalib",
    role: "Director of Relationship Management",
    emNo: "08",
    image: "/images/landing-page/our-leadership/08-md-abdul-mottalib.png",
  },
  {
    name: "Md. Mofazzal Hossen Manik",
    role: "Director of Training",
    emNo: "09",
    image:
      "/images/landing-page/our-leadership/09-md-mofazzal-hossen-manik.png",
  },
  {
    name: "Mst. Hajara Akter",
    role: "Director of HR (Human Resources)",
    emNo: "10",
    image: "/images/landing-page/our-leadership/10-mst-hajara-akter.png",
  },

  {
    name: "Mst.Fatema Begum",
    role: "Director of Promotion & Publication",
    emNo: "11",
    image: "/images/landing-page/our-leadership/12-mst-fatema-begum.png",
  },
];

gsap.registerPlugin(ScrollTrigger);
export default function AdvisoryCounsil() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

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
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container relative top-20 mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        <div
          data-leadership-header
          className="text-center mb-14 flex flex-col items-center gap-5"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 ">
            Governing Body
          </h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48] mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
            Governing Body
          </div>
        </div>

        <div
          data-leadership-grid
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-16"
        >
          {team.map((member, index) => (
            <div
              key={index}
              data-leadership-card
              className="group relative w-full max-w-105.25 h-125 bg-[#F3F4F6] rounded-lg overflow-hidden border border-b border-[#E5E7EB]"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={member.image}
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
                  {member.role}
                </p>
                <p className="text-[#475467] text-xs font-normal">
                  EM No: {member.emNo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
