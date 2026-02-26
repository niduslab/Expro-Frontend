import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function BlogItems5() {
  return (
    <>
      {/* card 1 */}
      <div className="w-[421px] h-[506px] opacity-100 gap-2.5 rounded-[8px] border border-[#E5E7EB] p-6 shadow-[0_4px_40px_0_#00000014]">
        <div className=" flex flex-col items-start justify-start w-[373px] h-[458px] opacity-100 gap-6">
          {/* Image Section */}
          <div className="w-[373px] h-[272px] opacity-100 rounded-[4px] overflow-hidden relative gap-6">
            <Image
              src="/images/blog-media/blog-item-five.jpg"
              alt="Blog Item first image"
              fill
              style={{ objectFit: "cover", objectPosition: "center right" }}
              priority
              className="w-full h-full"
            />
          </div>
          {/* Content Section */}
          <div className="flex flex-col h-[162px] w-[373px] gap-[24px] ">
            <div className="flex flex-col h-[122px] w-[373px] gap-[16px] ">
              <p className="w-[373px] h-[58px] font-['DM_Sans'] font-semibold text-[24px] leading-[120%] tracking-[-0.01em] text-[#030712] ">
                From Support to Self-Reliance: The Power of Skill Development
              </p>
              <p className="w-[373px] h-[48px] opacity-100 font-['DM_Sans'] font-normal text-[16px] leading-[150%] tracking-[-0.01em] text-[#4A5565]">
                Empowering through knowledge with scholarships, schools, and
                educational resources...
              </p>
            </div>
            <div className="flex items-center w-[113px] h-[24px] opacity-100 gap-2 rounded-full">
              <div className="w-[113px] h-[24px]">
                <button className="opacity-100 font-['DM_Sans'] font-semibold  text-[16px] leading-[150%] tracking-[-0.01em] text-[#068847]">
                  Learn More{" "}
                </button>
              </div>{" "}
              <ArrowUpRight className="text-[#068847] h-[20px] w-[20px] " />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
