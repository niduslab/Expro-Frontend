import Dropdown from "@/components/ui/dropdown";

import { ArrowLeft, CircleCheck } from "lucide-react";
import { useState } from "react";
import { ProjectFormDataInterface } from "./new-project-modal";
import { projectTeamSchema } from "@/components/zodschema/projectSchema";
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
export default function ProjectTeamsRoles({
  activeTab,
  formData,
  setFormData,
  setActiveTab,
}: NewProjectModalProps) {
  const [role, setRole] = useState("");

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      teamSize: Number(formData.teamSize),
      contribution: Number(formData.contribution),
    };

    const result = projectTeamSchema.safeParse(finalData);
    if (!result.success) {
      toast.error("");
      return;
    }

    alert("Project Created Successfully");
  };
  const handleBack = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };
  return (
    <>
      <div className="flex flex-col relative  w-full gap-[16px] pt-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative w-full sm:w-1/2">
            <div className="  justify-between w-full">
              <div className="pb-2">
                <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                  Project Lead
                </span>
                <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                  *
                </span>
              </div>
              <div className=" h-24">
                <input
                  value={formData.projectLead}
                  onChange={(e) =>
                    setFormData({ ...formData, projectLead: e.target.value })
                  }
                  className="h-[48px] text-[#6A7282] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500"
                  placeholder="Kamal Hossen"
                />
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
                setRole(value);
                setFormData({ ...formData, role: value });
              }}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative w-full sm:w-1/2">
            <div className="  justify-between w-full">
              <div className="pb-2">
                <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                  Team Size (estimated)
                </span>
                <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                  *
                </span>
              </div>
              <div className=" h-24">
                {" "}
                <input
                  value={formData.teamSize}
                  onChange={(e) =>
                    setFormData({ ...formData, teamSize: e.target.value })
                  }
                  className="h-[48px] text-[#6A7282] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500"
                  placeholder="e.g. 15"
                />
              </div>
            </div>
          </div>
          <div className="relative w-full sm:w-1/2">
            <div className="  justify-between w-full">
              <div className="pb-2">
                <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                  Member Contribution (৳/mo)
                </span>
                <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                  *
                </span>
              </div>
              <div className=" h-24">
                {" "}
                <input
                  value={formData.contribution}
                  onChange={(e) =>
                    setFormData({ ...formData, contribution: e.target.value })
                  }
                  className="h-[48px] text-[#6A7282] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500"
                  placeholder="e.g. 500"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex relative justify-between w-full pt-[57px] gap-[16px] ">
          <button
            onClick={handleBack}
            className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px]"
          >
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#068847] gap-2 h-[48px] w-[158px] rounded-xl  px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em]"
          >
            <span>Complete</span>
            <CircleCheck className="h-5 w-5 " />
          </button>
        </div>
      </div>
    </>
  );
}
