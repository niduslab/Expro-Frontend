import DatePicker from "@/components/ui/date-picker";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProjectFormDataInterface } from "./new-project-modal";
import { projectBudgetSchema } from "@/components/zodschema/projectSchema";
import { toast } from "sonner";

const tabs: ("info" | "budget" | "teams")[] = ["info", "budget", "teams"];

interface NewProjectModalProps {
  activeTab: "info" | "budget" | "teams";
  formData: ProjectFormDataInterface;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormDataInterface>>;
  setActiveTab: React.Dispatch<
    React.SetStateAction<"info" | "budget" | "teams">
  >;
}

export default function ProjectBudgetTimeline({
  formData,
  setFormData,
  activeTab,
  setActiveTab,
}: NewProjectModalProps) {
  const handleNext = () => {
    const budgetData = {
      ...formData,
      totalBudget: Number(formData.totalBudget),
      initialFund: Number(formData.initialFund),
    };

    const result = projectBudgetSchema.safeParse(budgetData);

    if (!result.success) {
      const errorMessages = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      toast.error(errorMessages);
      return;
    }

    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };
  const handleBack = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };
  return (
    <>
      <div className="flex flex-col relative pt-4 w-full gap-[16px]">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative w-full sm:w-1/2">
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
                value={formData.totalBudget}
                onChange={(e) =>
                  setFormData({ ...formData, totalBudget: e.target.value })
                }
                className="h-[48px] text-[#6A7282] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500"
                placeholder="e.g. 250000"
              />
            </div>
          </div>
          <div className="relative w-full sm:w-1/2">
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
                value={formData.initialFund}
                onChange={(e) =>
                  setFormData({ ...formData, initialFund: e.target.value })
                }
                className="h-[48px] w-full text-[#6A7282] border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500"
                placeholder="e.g. 50000"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 ">
          <div className="relative w-full sm:w-1/2">
            <DatePicker
              label="Start Date"
              required
              onChange={(date) => console.log("Selected:", date)}
            />
          </div>
          <div className="relative w-full sm:w-1/2">
            <DatePicker
              label="End Date"
              required
              onChange={(date) => console.log("Selected:", date)}
            />
          </div>
        </div>
        <div className="flex relative justify-between w-full pt-40 gap-[16px] ">
          <button
            onClick={handleNext}
            className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px]"
          >
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <button
            onClick={handleBack}
            className="bg-[#068847] h-[48px] w-[158px] rounded-xl  px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px]"
          >
            Next <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
}
