"use client";

import React, { useState } from "react";
import { enterprises } from "./data";

const SocialEnterprise = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Header ── */}
      <div className="text-center pt-32 sm:pt-[170px] pb-4 flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-xs font-semibold tracking-wide text-[#027A48]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
          social-enterprise
        </div>
        <h1 className="font-dm-sans text-3xl md:text-[44px] font-bold tracking-tight text-gray-900 leading-tight">
          Social Enterprise
        </h1>
      </div>

      {/* ── Enterprise Cards ── */}
      <section className="sm:max-w-3xl xl:max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-12 space-y-5">
        {enterprises.map((ent, idx) => {
          const isReverse = idx % 2 !== 0;
          return (
            <div
              key={ent.id}
              onMouseEnter={() => setHoveredId(ent.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                group flex flex-col md:flex-row
                ${isReverse ? "md:flex-row-reverse" : ""}
                overflow-hidden rounded-2xl border bg-white
                transition-all duration-300
                ${hoveredId === ent.id ? "border-gray-300 shadow-lg" : `border-gray-100 ${ent.border}`}
              `}
            >
              {/* ── Image panel ── */}
              <div className="relative w-full md:w-[260px] lg:w-[300px] shrink-0 bg-gray-100 overflow-hidden"
                style={{ minHeight: "220px" }}>
                <img
                  src={ent.image}
                  alt={ent.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                {/* Subtle overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>

              {/* ── Content panel ── */}
              <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-10">

                {/* Icon + subtitle row */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`shrink-0 w-9 h-9 rounded-lg ${ent.light} ${ent.accent} flex items-center justify-center border ${ent.border}`}
                  >
                    <span className="w-[18px] h-[18px]">{ent.icon}</span>
                  </div>
                  <span className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${ent.accent}`}>
                    {ent.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-3">
                  {ent.title}
                </h2>

                {/* Color accent bar */}
                <div className={`h-[3px] w-10 mb-4 rounded-full bg-gradient-to-r ${ent.color}`} />

                {/* Description */}
                <p className="text-gray-500 text-[15px] leading-[1.8] mb-5">
                  {ent.description}
                </p>

                {/* Tag */}
                <span className={`self-start text-[11px] font-semibold px-3 py-1 rounded-full ${ent.tag}`}>
                  {ent.subtitle.split("&")[0].trim()}
                </span>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default SocialEnterprise;