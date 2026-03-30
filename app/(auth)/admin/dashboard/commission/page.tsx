import MemberCommissionCard from "./memberCommission";
import MonthlyFeeCommissionCard from "./monthlyFeeCommission";

export default function CommissionOverview() {
  return (
    <div className=" bg-white rounded-xl p-6 shadow border border-gray-200 flex flex-col gap-[16px]">
      <div className="flex flex-col">
        <h2 className=" font-semibold text-[24px] leading-[120%] tracking-[-0.01em] align-middle mb-2 text-[#030712]">
          Commission Overview
        </h2>
        <span className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
          New member referral & monthly subscription commissions across the
          hierarchy
        </span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        <MemberCommissionCard />
        <MonthlyFeeCommissionCard />
      </div>
    </div>
  );
}
