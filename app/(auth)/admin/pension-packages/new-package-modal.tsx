import { ArrowDown, ChevronDown, Plus } from "lucide-react";
import React from "react";

interface NewPackageModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NewPackageModal({
  setOpenModal,
}: NewPackageModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="flex flex-col w-full max-w-[600px] h-[85vh] p-2 md:p-6 bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black relative">
        <div className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden p-2">
          <div className=" flex flex-col gap-2">
            {" "}
            <div className="flex justify-between items-center ">
              <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                Create New Pension Package
              </p>
              <button
                onClick={() => setOpenModal(false)}
                className=" text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="">
              <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
                Define the package details, duration, and commission
                structure.{" "}
              </p>
            </div>
          </div>

          <div className=" w-full top-[16px]  border border-[#E5E7EB] relative"></div>
          {/*Package details*/}
          <div className="flex flex-col relative top-[24px]   gap-[16px]">
            <div>
              <p className="font-dm-sans font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]  h-[27px] opacity-100">
                Package Details
              </p>
            </div>
            <div className=" justify-between">
              <div className="pb-2">
                <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                  Package Name
                </span>
                <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                  *
                </span>
              </div>

              <input
                className="w-full h-[48px] gap-[129px] opacity-100 border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]"
                placeholder="e.g. standard pension"
              />
            </div>{" "}
            <div className="flex gap-2 w-full">
              <div className="relative w-1/2">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Monthly Fee (৳)
                    </span>
                    <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                      *
                    </span>
                  </div>
                  <input
                    className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]"
                    placeholder="e.g. 1000"
                  />
                </div>
              </div>
              <div className="relative w-1/2">
                <div className="flex flex-col  w-full">
                  <span className="font-semibold pb-2 text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                    Status
                  </span>
                  <button className="flex items-center justify-between h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]">
                    <span className="text-[#6A7282] font-normal text-[14px] leading-[150%] tracking-[-0.01em]">
                      Running
                    </span>
                    <ChevronDown className="text-[#6A7282]" size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div className=" container top-2  border border-[#E5E7EB] relative "></div>
          </div>

          {/*duration & maturity*/}
          <div className="flex flex-col relative top-[48px]   gap-[16px]">
            <div>
              <p className="font-dm-sans font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]  h-[27px] opacity-100">
                Duration & Maturity
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="relative md:w-1/3">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Duration (Years)
                    </span>
                    <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                      *
                    </span>
                  </div>
                  <input
                    className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]"
                    placeholder="e.g. 9"
                  />
                </div>
              </div>
              <div className="relative md:w-1/3">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Total Installments
                    </span>
                    <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                      *
                    </span>
                  </div>
                  <input
                    className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]"
                    placeholder="e.g. 108"
                  />
                </div>
              </div>
              <div className="relative md:w-1/3">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Maturity (৳)
                    </span>
                    <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                      *
                    </span>
                  </div>
                  <input
                    className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]"
                    placeholder="e.g. 180000"
                  />
                </div>
              </div>
            </div>
            <div className=" container top-[16px]  border border-[#E5E7EB] relative "></div>
          </div>
          {/*Commission Structure*/}
          <div className="flex flex-col relative top-[86px]    gap-[16px]">
            <div>
              <p className="font-dm-sans font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]  h-[27px] opacity-100">
                Commission Structure
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="relative md:w-1/2">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Joining Commission (৳)
                    </span>
                    <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                      *
                    </span>
                  </div>
                  <input
                    className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]"
                    placeholder="e.g. 500"
                  />
                  <span className="text-[#6A7282] font-normal text-[12px] leading-[160%] tracking-[-0.01em]">
                    One-time on new enrollment
                  </span>
                </div>
              </div>
              <div className="relative md:w-1/2">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Installment Commission (৳)
                    </span>
                    <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                      *
                    </span>
                  </div>
                  <input
                    className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]"
                    placeholder="e.g. 30"
                  />
                  <span className="text-[#6A7282] font-normal text-[12px] leading-[160%] tracking-[-0.01em]">
                    Per monthly installment
                  </span>
                </div>
              </div>
            </div>

            <div className="flex relative w-[257px]  gap-[16px] ">
              <button
                onClick={() => setOpenModal(false)}
                className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] leading-[150%] tracking-[-0.01em]"
              >
                Cancel
              </button>
              <button className="bg-[#068847] h-[48px] w-[158px] rounded-xl  px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em]">
                <Plus className="h-5 w-5 " /> <span>Add Package</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
