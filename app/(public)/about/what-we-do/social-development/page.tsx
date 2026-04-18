"use client";

import React, { useState } from "react";
import { sectors } from "./data";

const SocialDevelopment = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Header */}
      <div className="text-center mb-4 pt-32 sm:pt-[170px] flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1 text-sm font-medium text-[#027A48]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
          social-development
        </div>
        <h2 className="font-dm-sans text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
          Social Development
        </h2>
       
      </div>

      {/* Cards Grid */}
      <section className="container mx-auto px-6 sm:px-12 lg:px-20 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {sectors.map((sector) => (
            <div
              key={sector.id}
              className={`group flex flex-col overflow-hidden rounded-2xl border ${sector.border} bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              onMouseEnter={() => setHoveredId(sector.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
          
              {/* Card body */}
              <div className="flex flex-col flex-1 p-6">

                {/* Icon row */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-11 h-11 rounded-xl ${sector.light} ${sector.accent} flex items-center justify-center border ${sector.border} shrink-0`}
                  >
                    {sector.icon}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sector.tag}`}>
                    {String(sector.id).padStart(2, "0")}
                  </span>
                </div>

                {/* Title + underline */}
                <h3 className="text-base font-bold text-gray-900 leading-snug mb-1">
                  {sector.title}
                </h3>
                <div className={`h-0.5 w-8 mb-3 rounded-full bg-gradient-to-r ${sector.color}`} />

                {/* Description — flex-1 pushes footer to bottom */}
                <p className="text-gray-500 text-sm leading-relaxed flex-1">
                  {sector.description}
                </p>

              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SocialDevelopment;