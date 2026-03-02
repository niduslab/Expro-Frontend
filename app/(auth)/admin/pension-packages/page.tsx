import { Calendar, Package, Plus, TrendingUp, Users } from "lucide-react";

export default function AdminPensionPackages() {
  return (
    <>
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
            Pension Packages
          </p>
          <p className="text-sm text-[#4A5565]">
            Manage pension schemes and enrollment packages
          </p>
        </div>

        <div className="flex justify-start sm:justify-end">
          <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#068847] text-white whitespace-nowrap">
            <Plus className="h-5 w-5 shrink-0" />
            <span className="text-sm font-semibold">Add new Package</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        {" "}
        <div className="w-[554px] h-[265px] flex flex-col opacity-100 border border-[#E5E7EB] rounded-[12px] relative top-10 p-5">
          <div className="h-[43px] flex items-center justify-between ">
            <div className="flex gap-[13px] items-start justify-between">
              <div className="h-[40px] w-[40px] rounded-[8px] bg-[#F3F4F6] flex items-center justify-center">
                <Package className="h-5 w-5 text-[#068847]" />
              </div>
              <div className="flex flex-col h-[43px] w-[265px]">
                <p className="font-['DM_Sans'] text-[#030712] font-semibold text-[16px] leading-[150%] tracking-[-0.01em] align-middle">
                  Basic Pension
                </p>
                <p className="font-['DM_Sans'] text-[#068847] font-semibold text-[12px] leading-[150%] tracking-[-0.01em] align-middle">
                  ৳300
                  <span className="font-['DM_Sans'] text-[#4A5565] font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle">
                    /month
                  </span>
                </p>
              </div>
            </div>
            <div className="w-[71px] h-[22px] bg-[#DFF1E9] border border-[#A8DAC3] absolute top-[34.5px] left-[459px] opacity-100  rounded-full gap-[10px] pt-[2px] pr-[12px] pb-[2px] pl-[12px]">
              <p className="font-['DM_Sans'] font-semibold text-[12px] leading-[150%] tracking-[-0.01em] align-middle text-[#29A36A]">
                Running
              </p>
            </div>
          </div>
          <div className="h-[1px] w-full bg-[#E5E7EB] relative top-3"></div>

          <div className="h-[134px] grid grid-cols-2 w-full gap-2 relative top-10 ">
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <Users className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Enrolled Members
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  245
                </div>
              </div>
            </div>
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <Calendar className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Duration
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  9 Years (100 inst.)
                </div>
              </div>
            </div>
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <TrendingUp className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Maturity
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  ৳50,000
                </div>
              </div>
            </div>
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <Package className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Commission
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  ৳30/inst
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[554px] h-[265px] flex flex-col opacity-100 border border-[#E5E7EB] rounded-[12px] relative top-10 p-5">
          <div className="h-[43px] flex items-center justify-between ">
            <div className="flex gap-[13px] items-start justify-between">
              <div className="h-[40px] w-[40px] rounded-[8px] bg-[#F3F4F6] flex items-center justify-center">
                <Package className="h-5 w-5 text-[#068847]" />
              </div>
              <div className="flex flex-col h-[43px] w-[265px]">
                <p className="font-['DM_Sans'] text-[#030712] font-semibold text-[16px] leading-[150%] tracking-[-0.01em] align-middle">
                  Standard Pension
                </p>
                <p className="font-['DM_Sans'] text-[#068847] font-semibold text-[12px] leading-[150%] tracking-[-0.01em] align-middle">
                  ৳700
                  <span className="font-['DM_Sans'] text-[#4A5565] font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle">
                    /month
                  </span>
                </p>
              </div>
            </div>
            <div className="w-[71px] h-[22px] bg-[#DFF1E9] border border-[#A8DAC3] absolute top-[34.5px] left-[459px] opacity-100  rounded-full gap-[10px] pt-[2px] pr-[12px] pb-[2px] pl-[12px]">
              <p className="font-['DM_Sans'] font-semibold text-[12px] leading-[150%] tracking-[-0.01em] align-middle text-[#29A36A]">
                Running
              </p>
            </div>
          </div>
          <div className="h-[1px] w-full bg-[#E5E7EB] relative top-3"></div>

          <div className="h-[134px] grid grid-cols-2 w-full gap-2 relative top-10 ">
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <Users className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Enrolled Members
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  480
                </div>
              </div>
            </div>
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <Calendar className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Duration
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  9 Years (100 inst.)
                </div>
              </div>
            </div>
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <TrendingUp className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Maturity
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  ৳120,000
                </div>
              </div>
            </div>
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <Package className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Commission
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  ৳30/inst
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[554px] h-[265px] flex flex-col opacity-100 border border-[#E5E7EB] rounded-[12px] relative top-10 p-5">
          <div className="h-[43px] flex items-center justify-between ">
            <div className="flex gap-[13px] items-start justify-between">
              <div className="h-[40px] w-[40px] rounded-[8px] bg-[#F3F4F6] flex items-center justify-center">
                <Package className="h-5 w-5 text-[#068847]" />
              </div>
              <div className="flex flex-col h-[43px] w-[265px]">
                <p className="font-['DM_Sans'] text-[#030712] font-semibold text-[16px] leading-[150%] tracking-[-0.01em] align-middle">
                  Premium Pension
                </p>
                <p className="font-['DM_Sans'] text-[#068847] font-semibold text-[12px] leading-[150%] tracking-[-0.01em] align-middle">
                  ৳1000
                  <span className="font-['DM_Sans'] text-[#4A5565] font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle">
                    /month
                  </span>
                </p>
              </div>
            </div>
            <div className="w-[71px] h-[22px] bg-[#DFF1E9] border border-[#A8DAC3] absolute top-[34.5px] left-[459px] opacity-100  rounded-full gap-[10px] pt-[2px] pr-[12px] pb-[2px] pl-[12px]">
              <p className="font-['DM_Sans'] font-semibold text-[12px] leading-[150%] tracking-[-0.01em] align-middle text-[#29A36A]">
                Running
              </p>
            </div>
          </div>
          <div className="h-[1px] w-full bg-[#E5E7EB] relative top-3"></div>

          <div className="h-[134px] grid grid-cols-2 w-full gap-2 relative top-10 ">
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <Users className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Enrolled Members
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  290
                </div>
              </div>
            </div>
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <Calendar className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Duration
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  9 Years (100 inst.)
                </div>
              </div>
            </div>
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <TrendingUp className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Maturity
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  ৳180,000
                </div>
              </div>
            </div>
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <Package className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Commission
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  ৳30/inst
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[554px] h-[265px] flex flex-col opacity-100 border border-[#E5E7EB] rounded-[12px] relative top-10 p-5">
          <div className="h-[43px] flex items-center justify-between ">
            <div className="flex gap-[13px] items-start justify-between">
              <div className="h-[40px] w-[40px] rounded-[8px] bg-[#F3F4F6] flex items-center justify-center">
                <Package className="h-5 w-5 text-[#068847]" />
              </div>
              <div className="flex flex-col h-[43px] w-[265px]">
                <p className="font-['DM_Sans'] text-[#030712] font-semibold text-[16px] leading-[150%] tracking-[-0.01em] align-middle">
                  Executive Pension
                </p>
                <p className="font-['DM_Sans'] text-[#068847] font-semibold text-[12px] leading-[150%] tracking-[-0.01em] align-middle">
                  ৳700
                  <span className="font-['DM_Sans'] text-[#4A5565] font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle">
                    /month
                  </span>
                </p>
              </div>
            </div>
            <div className="w-[71px] h-[22px] bg-[#DFF1E9] border border-[#A8DAC3] absolute top-[34.5px] left-[459px] opacity-100  rounded-full gap-[10px] pt-[2px] pr-[12px] pb-[2px] pl-[12px]">
              <p className="font-['DM_Sans'] font-semibold text-[12px] leading-[150%] tracking-[-0.01em] align-middle text-[#29A36A]">
                Running
              </p>
            </div>
          </div>
          <div className="h-[1px] w-full bg-[#E5E7EB] relative top-3"></div>

          <div className="h-[134px] grid grid-cols-2 w-full gap-2 relative top-10 ">
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <Users className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Enrolled Members
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  150
                </div>
              </div>
            </div>
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <Calendar className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Duration
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  9 Years (100 inst.)
                </div>
              </div>
            </div>
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <TrendingUp className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Maturity
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  ৳275,000
                </div>
              </div>
            </div>
            <div className="w-[245px] h-[59px] rounded-[12px] gap-[10px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] bg-[#F3F4F6] opacity-100">
              <div className="h-[43px] ">
                <div className="h-[19px] flex  items-center justify-start gap-[8px]">
                  <Package className="h-[14px] w-[14px] text-[#6A7282]" />
                  <p className="font-['DM_Sans'] font-normal text-[11px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
                    Commission
                  </p>
                </div>
                <div className="font-['DM_Sans'] font-medium text-[14px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
                  ৳30/inst
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
