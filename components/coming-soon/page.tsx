"use client";

import { FC } from "react";
import { motion } from "framer-motion";

type ComingSoonProps = {
  title: string;
};

const ComingSoon: FC<ComingSoonProps> = ({ title }) => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] pt-32 pb-24 px-6 text-center bg-gradient-to-b from-red-50 via-red-100 to-white">
      {/* Header */}
      <div className="mb-12 flex flex-col items-center gap-4">
        <motion.div
          className="inline-flex items-center gap-2 rounded-full bg-[#fdecec] px-4 py-1.5 text-sm font-semibold text-[#7a1c02] cursor-default"
          whileHover={{ scale: 1.1 }}
        >
          <span className="h-2 w-2 rounded-full bg-[#7a1c02] animate-pulse" />
          Pending
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-bold tracking-wide text-gray-700">
          Updates Will Be Available Soon.
        </h2>
      </div>

      {/* Animated Icon */}
      <div className="relative w-36 h-36 mb-12 flex items-center justify-center">
        {/* Pulsing Circle Shadow */}
        <motion.div
          className="absolute w-36 h-36 rounded-full bg-red-200 opacity-30"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />

        {/* Rotating Icon */}
        <motion.div
          className="w-28 h-28 text-red-600 flex items-center justify-center"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
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
        </motion.div>
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
        updated. <br className="" />
        <span className="relative top-4">Thank you for your patience!</span>
      </p>
    </section>
  );
};

export default ComingSoon;
