import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function KeyObjectives() {
  return (
    <>
      <div className="flex  w-full h-[703px] py-[120px] px-[64px] gap-[10px] bg-[#F0F4F2]">
        <div className="flex items-center justify-start h-full w-1/2 p-6">
          <div className=" h-full w-full space-y-[40px]">
            {" "}
            <div className="flex flex-col items-start justify-start gap-[10px]">
              <div className="inline-flex items-center w-[150px] gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]"></span>
                Key Objectives
              </div>

              <h2 className="text-5xl md:text-5xl lg:text-[48px] font-bold text-gray-900 leading-[1.2]">
                What We Aim to Achieve
              </h2>
            </div>
            {""}
            <div className="flex flex-col h-[268px] gap-[16px] ">
              <div className="bg-white flex h-[72px] items-center rounded-[8px] py-[16px] px-[12px] border border-[#E5E7EB] gap-[8px]">
                <CheckCircle className="h-5 w-5 text-[#068847]" />
                <div className="h-[48px]">
                  <p className="font-dmSans font-normal text-[17px] text-[#4A5565] leading-[1.5] tracking-[-0.01em]">
                    Ensure financial independence in old age for
                    lower-middle-class communities.
                  </p>
                </div>
              </div>

              <div className="bg-white flex h-[72px] items-center rounded-[8px] py-[16px] px-[12px] border border-[#E5E7EB] gap-[8px]">
                <CheckCircle className="h-5 w-5 text-[#068847]" />
                <div className="h-[48px]">
                  <p className="font-dmSans font-normal text-[17px] text-[#4A5565] leading-[1.5] tracking-[-0.01em]">
                    Provide sustainable and long-term income streams through
                    strategic investments.
                  </p>
                </div>
              </div>
              <div className="bg-white flex h-[48px] items-center rounded-[8px] py-[16px] px-[12px] border border-[#E5E7EB] gap-[8px]">
                <CheckCircle className="h-5 w-5 text-[#068847]" />
                <div className="h-[24px]">
                  <p className="font-dmSans font-normal text-[17px] text-[#4A5565] leading-[1.5] tracking-[-0.01em]">
                    Promote disciplined savings culture among members.
                  </p>
                </div>
              </div>
              <div className="bg-white flex h-[48px] items-center rounded-[8px] py-[16px] px-[12px] border border-[#E5E7EB] gap-[8px]">
                <CheckCircle className="h-5 w-5 text-[#068847]" />
                <div className="h-[24px]">
                  <p className="font-dmSans font-normal text-[17px] text-[#4A5565] leading-[1.5] tracking-[-0.01em]">
                    Promote disciplined savings culture among members.
                  </p>
                </div>
              </div>
            </div>{" "}
          </div>
        </div>
        <div className="flex relative items-center justify-start  h-full w-1/2">
          <Image
            src="/images/projectScheme/keyobjectposter.jpg"
            alt="Key object poster"
            fill
            sizes="573px"
            className="ml-auto w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  );
}
