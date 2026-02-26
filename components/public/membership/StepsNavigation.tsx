import React from 'react';

interface StepsNavigationProps {
  steps: { label: string; id: string }[];
  currentStep: number;
  maxStepReached: number;
  onStepClick: (index: number) => void;
}

const StepsNavigation: React.FC<StepsNavigationProps> = ({
  steps,
  currentStep,
  maxStepReached,
  onStepClick,
}) => {
  return (
    <div className="bg-[#F0F4F2] rounded-lg p-4 mb-10 overflow-x-auto">
      <div className="flex items-center min-w-max space-x-5">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isAccessible = index <= maxStepReached;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => isAccessible && onStepClick(index)}
              disabled={!isAccessible}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#008543] ${
                isActive
                  ? 'bg-[#008543] text-white shadow-sm'
                  : isAccessible
                  ? 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                  : 'bg-white/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              {step.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepsNavigation;
