import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function OverviewScheme() {
  return (
    <>
      <div className="flex h-[758px]  pt-[120px] pb-[120px] gap-[10px]">
        <div className=" h-[758px] pr-[64px] pl-[64px] gap-[10px] w-full">
          <div className="flex items-start justify-between h-[518px]  gap-[40px]">
            <div className="flex relative w-[644px] h-[518px]  rounded-lg overflow-hidden">
              <Image
                src="/images/about/our-story-img.jpg"
                alt="Community collaboration"
                fill
                className="object-cover"
                sizes="w-auto "
              />
            </div>
            <div className=" w-1/2 flex flex-col gap-[36px] py-[4px]">
              {/* Tag */}
              <div className="inline-flex items-center w-[105px] gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]"></span>
                Overview
              </div>

              <h2 className="text-5xl md:text-5xl lg:text-[48px] font-bold text-gray-900 leading-[1.2]">
                Empowering Today, Envisioning Tomorrow
              </h2>

              <div className="space-y-4 text-gray-600 font-dm-sans leading-relaxed text-[14px] md:text-[16px] text-justify">
                Financial stability is the foundation of a peaceful retirement.
                To empower the lower-middle-class community and ensure financial
                independence in old age, Expro Welfare Foundation introduces a
                specialized Pension Scheme. This is more than just a savings
                plan—it is a commitment to your lifelong security.
              </div>

              <div className="flex flex-col gap-[16px]">
                <div className="flex items-center gap-[8px] ">
                  <div>
                    <CheckCircle className="h-4 w-4 text-[#068847]" />
                  </div>
                  <div>
                    <p className="font-['DM_Sans'] font-normal text-[16px] leading-[150%] tracking-[-0.01em] text-[#4A5565]">
                      {" "}
                      Your contributions are strategically invested in
                      productive and service-oriented sectors.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-[8px] ">
                  <div>
                    <CheckCircle className="h-4 w-4 text-[#068847]" />
                  </div>
                  <div>
                    <p className="font-['DM_Sans'] font-normal text-[16px] leading-[150%] tracking-[-0.01em] text-[#4A5565]">
                      {" "}
                      30% of total profits generated from investments are
                      distributed among members as regular pension.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-[8px] ">
                  <div>
                    <CheckCircle className="h-4 w-4 text-[#068847]" />
                  </div>
                  <div>
                    <p className="font-['DM_Sans'] font-normal text-[16px] leading-[150%] tracking-[-0.01em] text-[#4A5565]">
                      Sustainable and long-term income stream guaranteed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
