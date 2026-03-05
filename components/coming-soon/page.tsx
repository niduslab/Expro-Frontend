"use client";

import { FC, useEffect, useRef } from "react";
import gsap from "gsap";
import DemoNoticeTicker from "../dev-warning/page";

type ComingSoonProps = {
  title: string;
};

const ComingSoon: FC<ComingSoonProps> = ({ title }) => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hover scale animation (replaces whileHover)
    if (badgeRef.current) {
      badgeRef.current.addEventListener("mouseenter", () => {
        gsap.to(badgeRef.current, { scale: 1.1, duration: 0.3 });
      });
      badgeRef.current.addEventListener("mouseleave", () => {
        gsap.to(badgeRef.current, { scale: 1, duration: 0.3 });
      });
    }

    // Pulsing circle animation (replaces scale repeat)
    if (pulseRef.current) {
      gsap.to(pulseRef.current, {
        scale: 1.5,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    // Rotating icon animation
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: 15,
        duration: 1.25,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <section className="font-dm-sans flex flex-col items-center justify-center min-h-[70vh] pt-32 pb-24 px-6 text-center bg-gradient-to-b from-red-50 via-red-100 to-white">
      {/* Header */}
      <div className="mb-12 flex flex-col items-center gap-4">
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 rounded-full bg-[#fdecec] px-4 py-1.5 text-sm font-semibold text-[#7a1c02] cursor-default"
        >
          <span className="h-2 w-2 rounded-full bg-[#7a1c02] animate-pulse" />
          Pending
        </div>

        <DemoNoticeTicker />
      </div>

      {/* Animated Icon */}
      <div className="relative w-36 h-36 mb-12 flex items-center justify-center">
        {/* Pulsing Circle Shadow */}
        <div
          ref={pulseRef}
          className="absolute w-36 h-36 rounded-full bg-red-200 opacity-30"
        />

        {/* Rotating Icon */}
        <div
          ref={iconRef}
          className="w-28 h-28 text-red-600 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-full h-full drop-shadow-lg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-slate-700 mb-3">
        {title} Page
      </h1>

      {/* Message */}
      <p className="text-gray-400 text-base md:text-lg max-w-lg leading-relaxed pt-5">
        The content for{" "}
        <span className="font-semibold text-red-600">{title} </span>
        has not been received yet. Once it’s available, this page will be
        updated.
        <br />
        <span className="relative top-4">Thank you for your patience!</span>
      </p>
    </section>
  );
};

export default ComingSoon;
