"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export function CtaSection() {
  return (
    <section className="w-full py-16 md:py-20 bg-white flex justify-center">
      <div className="relative w-full max-w-[1450px] min-h-[476px] mx-auto rounded-[16px] overflow-hidden flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-12 bg-[#00341C]/12">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/landing-page/cta/cta-bg.png"
            alt="Background pattern"
            fill
            className="object-cover object-center opacity-100"
            quality={100}
          />
          <div className="absolute inset-0 bg-[#F0F4F2] opacity-90" />
        </div>

        <div className="relative z-10 w-full">
          <h2 className="text-[40px] md:text-[56px] lg:text-[72px] font-semibold text-black mb-6 leading-[120%] tracking-tight">
            Together, We Can Build
            <br className="hidden md:block" /> a Brighter Tomorrow
          </h2>

          <p className="text-[#1A1A1A] text-[16px] max-w-155 mx-auto mb-10 leading-[150%] font-normal tracking-[-0.01em]">
            Your support enables us to reach more communities, help more
            families, and create lasting change. Join our mission to empower
            lives and transform societies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/membership"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-[#008744] hover:bg-[#007038] rounded-md transition-colors duration-300 min-w-50 shadow-sm"
            >
              Become A Member
            </Link>

            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-[#D62828] hover:bg-[#b81d1d] rounded-md transition-colors duration-300 min-w-50 shadow-sm"
            >
              Donate Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
