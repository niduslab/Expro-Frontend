import { Eye, Target } from "lucide-react";

export default function MissionVision() {
  return (
    <>
      <div className="h-[654px] px-[64px] py-[64px] gap-[10px] flex flex-col items-center justify-center bg-[#F0F4F2]">
        <div className="inline-flex items-center w-[170px] gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]"></span>
          Mission and Vision
        </div>

        <h2 className="text-5xl md:text-5xl lg:text-[48px] font-bold text-gray-900 leading-[1.2]">
          Mission and Vision
        </h2>
        <div className=" h-[344px]  p-[24px] rounded-[8px] grid grid-cols-2 gap-x-[24px]">
          <div className="flex flex-col items-start gap-6 bg-[#F9FAFB] p-6">
            <div className="flex items-center justify-center h-[56px] w-[56px] rounded-[6px] bg-[#068847]">
              <Target />
            </div>
            <div className="h-[99px] space-y-3">
              <p className="text-[#030712] font-dmSans font-semibold text-[20px] leading-[1.2] tracking-[-0.01em]">
                Our Mission
              </p>
              <p className="font-dmSans font-normal text-[16px] leading-[1.5] tracking-[-0.01em] text-[#4A5565]">
                To provide comprehensive financial security through our pension
                scheme, ensuring that every participant receives guaranteed
                lifetime benefits, monthly dividends, and a secure future
                regardless of their employment status or educational background.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-6 bg-[#F9FAFB] h-[344px] p-6">
            <div className="flex items-center justify-center h-[56px] w-[56px] rounded-[6px] bg-[#068847]">
              <Eye />
            </div>
            <div className="h-[99px] space-y-3">
              <p className="text-[#030712] font-dmSans font-semibold text-[20px] leading-[1.2] tracking-[-0.01em]">
                Our Vision
              </p>
              <p className="font-dmSans font-normal text-[16px] leading-[1.5] tracking-[-0.01em] text-[#4A5565]">
                The mission of this project is to achieve specific government
                policies—such as poverty alleviation, biodiversity conservation,
                expanding access to universal education and healthcare, and
                building a Digital Bangladesh. Through these initiatives, we aim
                to ensure financial stability for the people of Bangladesh and
                transform the nation into a modern, prosperous, and happy
                society.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
