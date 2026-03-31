"use client";
import Dropdown from "@/components/ui/dropdown";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { CompletedTabs, ProjectFormDataInterface } from "./new-project-modal";
import { projectInfoSchema } from "@/components/zodschema/projectSchema";
import { toast } from "sonner";

interface ProjectInfoProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: "info" | "budget" | "teams";
  formData: ProjectFormDataInterface;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormDataInterface>>;
  setActiveTab: React.Dispatch<
    React.SetStateAction<"info" | "budget" | "teams">
  >;
  setCompletedTabs: React.Dispatch<React.SetStateAction<CompletedTabs>>;
}

export default function ProjectInfo({
  setOpenModal,
  activeTab,
  setActiveTab,
  formData,
  setFormData,
  setCompletedTabs,
}: ProjectInfoProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const result = projectInfoSchema.safeParse(formData);

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

    setErrors({});

    setCompletedTabs((prev) => ({
      ...prev,
      info: true,
    }));

    setActiveTab("budget");
  };

  return (
    <>
      <div className="flex flex-col relative pt-4 gap-[12px]">
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
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              // Clear the title error immediately when the user types
              if (errors.title) {
                setErrors((prev) => ({ ...prev, title: "" }));
              }
            }}
            className="w-full h-[48px] gap-[129px] text-[#6A7282] opacity-100 border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500"
            placeholder="Healthcare Program"
          />
          {errors.title && (
            <span className="text-sm text-red-500 py-0.5">{errors.title}</span>
          )}
        </div>{" "}
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative w-full sm:w-1/2 ">
            <Dropdown
              label="Category"
              required
              placeholder="Select Category"
              options={[
                "health",
                "education",
                "agriculture",
                "media",
                "women_entrepreneurship",
                "other",
                "humanity",
              ]}
              value={formData.category}
              onChange={(value) => {
                setFormData({ ...formData, category: value });
                if (errors.category)
                  setErrors((prev) => ({ ...prev, category: "" }));
              }}
            />
            {errors.category && (
              <span className="text-sm text-red-500 py-0.5">
                {errors.category}
              </span>
            )}
          </div>
          <div className="relative w-full sm:w-1/2">
            <Dropdown
              label="Status" // was "Priority"
              required
              placeholder="Select Status"
              options={[
                "planned",
                "upcoming",
                "ongoing",
                "completed",
                "cancelled",
              ]}
              // ↑ must match your ProjectStatusEnum values on the backend
              value={formData.status} // was formData.priority
              onChange={(value) => {
                setFormData({ ...formData, status: value }); // was priority
                if (errors.status)
                  setErrors((prev) => ({ ...prev, status: "" }));
              }}
            />
            {errors.status && (
              <span className="text-sm text-red-500 py-0.5">
                {errors.status}
              </span>
            )}
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
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });

              if (errors.description) {
                setErrors((prev) => ({ ...prev, description: "" }));
              }
            }}
            className=" w-full h-[102px] text-[#6A7282] opacity-100 border border-[#D1D5DC] rounded-[8px] px-[16px] py-[16px] bg-[#FFFFFF] resize-none focus:outline-none focus:ring focus:ring-green-500"
            placeholder="About Healthcare Program"
          />
          {errors.description && (
            <span className="text-sm text-red-500 py-0.5">
              {errors.description}
            </span>
          )}
        </div>{" "}
        <div className="flex relative justify-between w-full  ">
          <button
            onClick={() => setOpenModal(false)}
            className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] leading-[150%] tracking-[-0.01em]"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            className="bg-[#068847] h-[48px] w-[158px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px]"
          >
            Next <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
}
