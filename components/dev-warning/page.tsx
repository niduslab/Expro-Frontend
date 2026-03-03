"use client";

import { FC } from "react";
import { motion } from "framer-motion";

const DemoNoticeTicker: FC = () => {
  return (
    <>
      <div className="w-full flex items-center justify-center">
        <div
          className="w-44 mt-8 mb-8 h-12  rounded-xl flex items-center justify-center
                text-red-600 bg-red-100 border border-red-500 
                shadow-xl shadow-red-200 text-sm font-bold"
        >
          Content Required{" "}
          <span className="ml-1 font-extrabold text-[20px] mt-2">*</span>
        </div>
      </div>
    </>
  );
};

export default DemoNoticeTicker;
