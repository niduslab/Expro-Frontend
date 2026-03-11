import MemberCommission from "./memberCommission";
import MonthlyFeeCommission from "./monthlyFeeCommission";

export default function CommissionOverview() {
  return (
    <div className="w-full bg-white rounded-xl p-6 border flex flex-col gap-[16px]">
      <div className="flex flex-col">
        <h2 className=" font-semibold text-[24px] leading-[120%] tracking-[-0.01em] align-middle mb-2 text-[#030712]">
          Commission Overview
        </h2>
        <span className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
          New member referral & monthly subscription commissions across the
          hierarchy
        </span>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-evenly gap-6">
        <div className="h-107 w-full ">
          <MemberCommission />
        </div>
        <div className="h-107   w-full">
          <MonthlyFeeCommission />
        </div>
      </div>
    </div>
  );
}
