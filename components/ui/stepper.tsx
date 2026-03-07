"use client";

import React from "react";

type StepperProps = {
  step: number;
};

const steps = [
  { id: 1, label: "Donation" },
  { id: 2, label: "Details" },
  { id: 3, label: "Payment" },
];

const Stepper: React.FC<StepperProps> = ({ step }) => {
  return (
    <div className="flex  sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
      {steps.map((s, idx) => (
        <div
          key={s.id}
          className="flex items-center sm:flex-row sm:items-center flex-1 gap-2"
        >
          {/* Step circle */}
          <div
            className={`w-4 h-4 sm:w-9 sm:h-9 flex items-center justify-center rounded-full font-semibold text-sm
            ${step >= s.id ? "bg-[#36F293] text-white" : "bg-gray-200 text-gray-500"}`}
          >
            {s.id}
          </div>

          {/* Step label */}
          <span
            className={`text-center sm:text-left text-xs sm:text-sm font-medium
            ${step >= s.id ? "text-green-600" : "text-gray-400"}`}
          >
            {s.label}
          </span>

          {/* Progress bar except last step */}
          {idx < steps.length - 1 && (
            <div className="flex-1 h-1 bg-gray-200 rounded mt-1 sm:mt-0">
              <div
                className={`h-1 rounded transition-all
                ${step > s.id ? "bg-[#36F293] w-full" : "bg-[#36F293] w-0"}`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
