import { ArrowLeft, ArrowRight, Calendar, ChevronDown } from "lucide-react";
const tabs: ("info" | "budget" | "teams")[] = ["info", "budget", "teams"];
interface NewProjectModalProps {
  activeTab: "info" | "budget" | "teams";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"info" | "budget" | "teams">
  >;
}

export default function ProjectBudgetTimeline({
  activeTab,
  setActiveTab,
}: NewProjectModalProps) {
  return (
    <>
      <div className="flex flex-col relative pt-4 w-full gap-[16px]">
        <div className="flex gap-2 w-full">
          <div className="relative w-1/2">
            <div className="  justify-between w-full">
              <div className="pb-2">
                <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                  Total Budget (৳)
                </span>
                <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                  *
                </span>
              </div>
              <input
                className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]"
                placeholder="e.g. 250000"
              />
            </div>
          </div>
          <div className="relative w-1/2">
            <div className="  justify-between w-full">
              <div className="pb-2">
                <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                  Initial Fund (৳)
                </span>
                <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                  *
                </span>
              </div>
              <input
                className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]"
                placeholder="e.g. 50000"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <div className="relative w-1/2">
            <div className="  justify-between w-full">
              <div className="pb-2">
                <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                  Start Date
                </span>
                <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                  *
                </span>
              </div>
              <button className="flex items-center justify-between h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]">
                <span className="text-[#6A7282] font-normal text-[14px] leading-[150%] tracking-[-0.01em]">
                  mm/dd/yyy
                </span>
                <Calendar className="text-[#6A7282]" size={14} />
              </button>
            </div>
          </div>
          <div className="relative w-1/2">
            <div className="flex flex-col  w-full">
              <span className="font-semibold pb-2 text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                Expected End Date
              </span>
              <button className="flex items-center justify-between h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]">
                <span className="text-[#6A7282] font-normal text-[14px] leading-[150%] tracking-[-0.01em]">
                  mm/dd/yyy
                </span>
                <Calendar className="text-[#6A7282]" size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex relative justify-between w-full  gap-[16px] ">
          <button
            onClick={() => {
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1]);
              }
            }}
            className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px]"
          >
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <button
            onClick={() => {
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1]);
              }
            }}
            className="bg-[#068847] h-[48px] w-[158px] rounded-xl  px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px]"
          >
            Next <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
}
