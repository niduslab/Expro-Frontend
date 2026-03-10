import React from "react";

interface FundRaiseProgressProps {
  raised: number; // amount raised
  goal: number; // goal amount
  currencySymbol?: string;
}

const FundRaiseProgress: React.FC<FundRaiseProgressProps> = ({
  raised,
  goal,
  currencySymbol = "৳",
}) => {
  const percentage = Math.min(100, (raised / goal) * 100);

  return (
    <div className="w-[334px] ">
      {/* Title and percentage */}

      <div className="flex justify-between pb-2 w-[334px]">
        <span className="text-[#4A5565] font-medium text-[12px] leading-[150%] tracking-[-0.01em] align-middle">
          Fund Raise
        </span>
        <span className="text-[#4A5565] font-medium text-[12px] leading-[150%] tracking-[-0.01em] text-right align-middle">
          {percentage.toFixed(0)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-[6px] rounded-full bg-[#E5E7EB] gap-[10px] overflow-hidden">
        <div
          className="h-[6px] rounded-full bg-green-800 "
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Amounts */}
      <div className="text-[#4A5565] h-[19px] pt-1 flex justify-between ">
        <span className="w-[64px] text-[#4A5565] font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle">
          {currencySymbol}
          {raised.toFixed(1)}L
        </span>
        <span className="w-[64px] text-end text-[#4A5565] font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle">
          {currencySymbol}
          {goal.toFixed(1)}L
        </span>
      </div>
    </div>
  );
};

export default FundRaiseProgress;
