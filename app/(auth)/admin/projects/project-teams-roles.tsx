import Dropdown from "@/components/ui/dropdown";
import { ArrowLeft, CircleCheck } from "lucide-react";
import { ProjectFormDataInterface } from "./new-project-modal";
import { projectTeamSchema } from "@/components/zodschema/projectSchema";
import { toast } from "sonner";
import { useState } from "react";

const tabs: ("info" | "budget" | "teams")[] = ["info", "budget", "teams"];

interface NewProjectModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: "info" | "budget" | "teams";
  formData: ProjectFormDataInterface;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormDataInterface>>;
  setActiveTab: React.Dispatch<
    React.SetStateAction<"info" | "budget" | "teams">
  >;
}

export default function ProjectTeamsRoles({
  activeTab,
  formData,
  setFormData,
  setActiveTab,
  setOpenModal,
}: NewProjectModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleSubmit = () => {
    const finalData = {
      ...formData,
      teamSize: formData.teamSize ? Number(formData.teamSize) : undefined,
      contribution: formData.contribution
        ? Number(formData.contribution)
        : undefined,
    };

    const result = projectTeamSchema.safeParse(finalData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });

      setErrors(fieldErrors);

      const lastMessage = result.error.issues.slice(-1)[0]?.message;
      toast.error(lastMessage || "Validation failed");

      return;
    }

    setErrors({});
    toast.success("Project created successfully.");
    setOpenModal(false);
  };
  const handleBack = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <div className="flex flex-col relative w-full gap-[16px] pt-4">
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <div className="relative w-full sm:w-1/2">
          <div className="justify-between w-full">
            <div className="pb-2">
              <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                Project Lead
              </span>
              <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                *
              </span>
            </div>
            <div>
              <input
                type="text"
                value={formData.projectLead}
                onChange={(e) => {
                  setFormData({ ...formData, projectLead: e.target.value });

                  if (errors.projectLead) {
                    setErrors((prev) => ({ ...prev, projectLead: "" }));
                  }
                }}
                className="h-[48px] text-[#6A7282] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500"
                placeholder="Kamal Hossen"
              />
              {errors.projectLead && (
                <span className="text-sm text-red-500 py-0.5">
                  {errors.projectLead}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="relative w-full sm:w-1/2">
          <Dropdown
            label="Lead Role / Designation"
            required
            placeholder="Select Role"
            options={[
              "Executive",
              "Project Presenter",
              "Associate Project Presenter",
              "General Member",
            ]}
            value={formData.role}
            onChange={(value) => {
              setFormData({ ...formData, role: value });
              if (errors.role) {
                setErrors((prev) => ({ ...prev, role: "" }));
              }
            }}
          />
          {errors.role && (
            <span className="text-sm text-red-500 py-0.5">{errors.role}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <div className="relative w-full sm:w-1/2">
          <div className="justify-between w-full">
            <div className="pb-2">
              <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                Team Size (estimated)
              </span>
              <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                *
              </span>
            </div>
            <div>
              <input
                type="number"
                value={formData.teamSize}
                onChange={(e) => {
                  setFormData({ ...formData, teamSize: e.target.value });

                  if (errors.teamSize) {
                    setErrors((prev) => ({ ...prev, teamSize: "" }));
                  }
                }}
                className="h-[48px] text-[#6A7282] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500"
                placeholder="e.g. 15"
              />
              {errors.teamSize && (
                <span className="text-sm text-red-500 py-0.5">
                  {errors.teamSize}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative w-full sm:w-1/2">
          <div className="justify-between w-full">
            <div className="pb-2">
              <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                Member Contribution (৳/mo)
              </span>
              <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                *
              </span>
            </div>
            <div>
              <input
                type="number"
                value={formData.contribution}
                onChange={(e) => {
                  setFormData({ ...formData, contribution: e.target.value });

                  if (errors.contribution) {
                    setErrors((prev) => ({ ...prev, contribution: "" }));
                  }
                }}
                className="h-[48px] text-[#6A7282] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500"
                placeholder="e.g. 500"
              />
              {errors.contribution && (
                <span className="text-sm text-red-500 py-0.5">
                  {errors.contribution}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex relative justify-between w-full pt-36 gap-[16px]">
        <button
          onClick={handleBack}
          className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px]"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#068847] gap-2 h-[48px] w-[158px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em]"
        >
          <span>Complete</span>
          <CircleCheck className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
