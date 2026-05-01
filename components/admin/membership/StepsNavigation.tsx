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
    <div className="bg-gray-50 rounded-lg p-3 mb-6 overflow-x-auto">
      <div className="flex items-center min-w-max space-x-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isAccessible = index <= maxStepReached;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => isAccessible && onStepClick(index)}
              disabled={!isAccessible}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#068847] ${
                isActive
                  ? 'bg-[#068847] text-white shadow-sm'
                  : isAccessible
                  ? 'bg-white text-gray-700 hover:bg-gray-100 cursor-pointer'
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
