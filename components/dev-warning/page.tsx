"use client";

import { FC } from "react";
import { motion } from "framer-motion";

const DemoNoticeTicker: FC = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full h-9 md:h-10 bg-red-600 text-white overflow-hidden z-50 shadow-md">
      <div className="flex items-center h-full">
        {/* Breaking Label */}
        <div className="bg-black px-3 h-full flex items-center text-xs md:text-sm font-bold uppercase tracking-wide">
          Attention
        </div>

        {/* Scrolling Text */}
        <div className="relative flex-1 overflow-hidden">
          <motion.div
            className="whitespace-nowrap text-xs md:text-sm font-medium pl-6"
            animate={{ x: ["100%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
          >
            This page has been created solely for display and demonstration
            purposes, as the original content was not provided by the client at
            the time of development. To present a complete and visually
            representative layout, the developer included temporary placeholder
            text, images, and structure. The content shown here is for
            illustration only and will be replaced once the client provides the
            official materials.
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DemoNoticeTicker;
