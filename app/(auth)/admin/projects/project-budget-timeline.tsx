"use client";

import DatePicker from "@/components/ui/date-picker";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { CompletedTabs, ProjectFormDataInterface } from "./new-project-modal";
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
  setCompletedTabs: React.Dispatch<React.SetStateAction<CompletedTabs>>;
}

export default function ProjectBudgetTimeline({
  formData,
  setFormData,
  activeTab,
  setActiveTab,
  setCompletedTabs,
}: NewProjectModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const budgetData = {
      ...formData,
      totalBudget: Number(formData.totalBudget),
      initialFund: Number(formData.initialFund),
    };

    const result = projectBudgetSchema.safeParse(budgetData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });

      setErrors(fieldErrors);

      const lastMessage = result.error.issues.slice(-1)[0]?.message;
      toast.error(lastMessage || "Validation failed");

      return;
    }

    // ✅ validation success
    setErrors({});

    setCompletedTabs((prev) => ({
      ...prev,
      budget: true,
    }));

    setActiveTab("teams");
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
          {/* Total Budget */}
          <div className="relative w-full sm:w-1/2">
            <div className="pb-2">
              <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                Total Budget (৳)
              </span>
              <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                *
              </span>
            </div>
            <div className=" h-24">
              {" "}
              <input
                value={formData.totalBudget}
                onChange={(e) => {
                  setFormData({ ...formData, totalBudget: e.target.value });
                  if (errors.totalBudget) {
                    setErrors((prev) => ({ ...prev, totalBudget: "" }));
                  }
                }}
                className="h-[48px] text-[#6A7282] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500"
                placeholder="e.g. 250000"
              />
              {errors.totalBudget && (
                <span className="text-sm text-red-500 py-0.5">
                  {errors.totalBudget}
                </span>
              )}
            </div>
          </div>

          {/* Initial Fund */}
          <div className="relative w-full sm:w-1/2">
            <div className="pb-2">
              <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                Initial Fund (৳)
              </span>
              <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                *
              </span>
            </div>
            <div className=" h-24">
              <input
                value={formData.initialFund}
                onChange={(e) => {
                  setFormData({ ...formData, initialFund: e.target.value });
                  if (errors.initialFund) {
                    setErrors((prev) => ({ ...prev, initialFund: "" }));
                  }
                }}
                className="h-[48px]  w-full text-[#6A7282] border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500"
                placeholder="e.g. 50000"
              />
              {errors.initialFund && (
                <span className="text-sm text-red-500 py-0.5">
                  {errors.initialFund}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 ">
          {/* Start Date */}
          <div className="relative w-full sm:w-1/2">
            <DatePicker
              label="Start Date"
              required
              value={formData.startDate || ""} // ensure it's a valid 'yyyy-mm-dd'
              onChange={(date) => {
                // store the date in 'yyyy-mm-dd' format
                setFormData({ ...formData, startDate: date });
                if (errors.startDate) {
                  setErrors((prev) => ({ ...prev, startDate: "" }));
                }
              }}
            />
            {errors.startDate && (
              <span className="text-sm text-red-500 py-0.5">
                {errors.startDate}
              </span>
            )}
          </div>

          {/* End Date */}
          <div className="relative w-full sm:w-1/2">
            <DatePicker
              label="End Date"
              required
              value={formData.endDate || ""} // ensure it's a valid 'yyyy-mm-dd'
              onChange={(date) => {
                // store the date in 'yyyy-mm-dd' format
                setFormData({ ...formData, endDate: date });
                if (errors.endDate) {
                  setErrors((prev) => ({ ...prev, endDate: "" }));
                }
              }}
            />
            {errors.endDate && (
              <span className="text-sm text-red-500 py-0.5">
                {errors.endDate}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex relative justify-between w-full pt-[122px] gap-[16px] ">
        <button
          onClick={handleBack}
          className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px]"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </button>
        <button
          onClick={handleNext}
          className="bg-[#068847] h-[48px] w-[158px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px]"
        >
          Next <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
