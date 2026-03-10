import { ArrowRight, ChevronDown } from "lucide-react";

interface NewProjectModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: "info" | "budget" | "teams";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"info" | "budget" | "teams">
  >;
}
const tabs: ("info" | "budget" | "teams")[] = ["info", "budget", "teams"];

export default function ProjectInfo({
  setOpenModal,
  activeTab,
  setActiveTab,
}: NewProjectModalProps) {
  return (
    <>
      <div className="flex flex-col relative pt-4 gap-[16px]">
        <div className=" justify-between">
          <div className="pb-2">
            <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
              Project Title
            </span>
            <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
              *
            </span>
          </div>

          <input
            className="w-full h-[48px] gap-[129px] opacity-100 border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]"
            placeholder="Healthcare Program"
          />
        </div>{" "}
        <div className="flex gap-2 w-full">
          <div className="relative w-1/2">
            <div className="  justify-between w-full">
              <div className="pb-2">
                <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                  Category
                </span>
                <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                  *
                </span>
              </div>
              <button className="flex items-center justify-between h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]">
                <span className="text-[#6A7282] font-normal text-[14px] leading-[150%] tracking-[-0.01em]">
                  Select Category
                </span>
                <ChevronDown className="text-[#6A7282]" size={14} />
              </button>
            </div>
          </div>
          <div className="relative w-1/2">
            <div className="flex flex-col  w-full">
              <span className="font-semibold pb-2 text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                Priority
              </span>
              <button className="flex items-center justify-between h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]">
                <span className="text-[#6A7282] font-normal text-[14px] leading-[150%] tracking-[-0.01em]">
                  Select Priority
                </span>
                <ChevronDown className="text-[#6A7282]" size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className=" justify-between">
          <div className="pb-2">
            <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
              Description
            </span>
            <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
              *
            </span>
          </div>

          <textarea
            className=" w-full h-[102px] opacity-100 border border-[#D1D5DC] rounded-[8px] px-[16px] py-[16px] bg-[#FFFFFF] resize-none"
            placeholder="About Healthcare Program"
          />
        </div>{" "}
        <div className="flex relative justify-between w-full  gap-[16px] ">
          <button
            onClick={() => setOpenModal(false)}
            className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] leading-[150%] tracking-[-0.01em]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1]);
              }
            }}
            className="bg-[#068847] h-[48px] w-[158px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px]"
          >
            Next <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
}
