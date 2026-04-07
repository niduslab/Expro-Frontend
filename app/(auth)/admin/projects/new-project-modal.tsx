import React, { useState } from "react";
import ProjectInfo from "./project-info";
import ProjectBudgetTimeline from "./project-budget-timeline";
import ProjectTeamsRoles from "./project-teams-roles";
import { Lock } from "lucide-react";
import { ProjectFormDataInterface } from "@/lib/types/projectType";
import { CreateProjectPayload } from "@/lib/types/projectType";
import { useCreateProject } from "@/lib/hooks/admin/useProjectHook";
import { useUsers } from "@/lib/hooks/admin/useUsers";

interface NewProjectModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export type CompletedTabs = {
  info: boolean;
  budget: boolean;
  teams: boolean;
};

export default function NewProjectModal({
  setOpenModal,
}: NewProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "budget" | "teams">(
    "info",
  );
  const { mutate: createProject, isPending } = useCreateProject();
  const { data: usersData } = useUsers();
  const [formData, setFormData] = useState<ProjectFormDataInterface>({
    title: "",
    category: "",
    status: "",
    shortDescription: "",
    description: "",
    totalBudget: "",
    initialFund: "",
    fundsUtilized: "", // ← new
    startDate: "",
    endDate: "",
    projectLeadId: null,
    isFeatured: false, // ← new
    isPublished: false, // ← new
    featuredImage: null,
  });

  const [completedTabs, setCompletedTabs] = useState<CompletedTabs>({
    info: false,
    budget: false,
    teams: false,
  });

  const handleFinalSubmit = () => {
    const payload: CreateProjectPayload = {
      title: formData.title,
      category: formData.category,
      status: formData.status,
      short_description: formData.shortDescription || undefined,
      description: formData.description || undefined,
      budget: formData.totalBudget ? Number(formData.totalBudget) : undefined,
      funds_raised: formData.initialFund
        ? Number(formData.initialFund)
        : undefined,
      funds_utilized: formData.fundsUtilized
        ? Number(formData.fundsUtilized)
        : undefined,
      featured_image: formData.featuredImage ?? undefined,
      start_date: formData.startDate || undefined,
      end_date: formData.endDate || undefined,
      is_featured: formData.isFeatured,
      is_published: formData.isPublished,
      project_lead_id: formData.projectLeadId ?? undefined, // ← now sends real ID
    };
    createProject(payload, { onSuccess: () => setOpenModal(false) });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <ProjectInfo
            setOpenModal={setOpenModal}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formData={formData}
            setFormData={setFormData}
            setCompletedTabs={setCompletedTabs}
          />
        );
      case "budget":
        return (
          <ProjectBudgetTimeline
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formData={formData}
            setFormData={setFormData}
            setCompletedTabs={setCompletedTabs}
          />
        );
      case "teams":
        return (
          <ProjectTeamsRoles
            setOpenModal={setOpenModal}
            activeTab={activeTab}
            formData={formData}
            setFormData={setFormData}
            setActiveTab={setActiveTab}
            onSubmit={handleFinalSubmit}
            isPending={isPending}
            users={usersData?.data ?? []}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2">
      <div className="flex flex-col w-full max-w-[600px] h-[85vh] p-2 md:p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-lg text-black">
        <div className="p-2 flex flex-col gap-[6px]">
          <div className="flex justify-between items-center">
            <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
              Create New Project
            </p>
            <button
              onClick={() => setOpenModal(false)}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
            Set up a new welfare initiative project for the foundation
          </p>
        </div>

        <div className="container border border-[#E5E7EB] my-4"></div>

        <div className="p-2 overflow-y-auto">
          <div className="h-[45px] gap-[12px] md:gap-[24px] flex overflow-x-auto md:overflow-visible">
            <button
              onClick={() => setActiveTab("info")}
              className={`p-3 rounded-[8px] whitespace-nowrap flex items-center gap-2 ${
                activeTab === "info"
                  ? "bg-[#068847] font-semibold text-[13px] text-white"
                  : "text-[#068847] border underline border-[#E5E7EB] text-[14px]"
              }`}
            >
              1. Project Info
            </button>

            <button
              disabled={!completedTabs.info}
              onClick={() => completedTabs.info && setActiveTab("budget")}
              className={`p-3 rounded-[8px] whitespace-nowrap flex items-center gap-2 ${
                !completedTabs.info
                  ? "opacity-30 cursor-not-allowed border border-[#6c6d6e]"
                  : activeTab === "budget"
                    ? "bg-[#068847] font-semibold text-[13px] text-white"
                    : "text-[#068847] border underline border-[#E5E7EB] text-[14px]"
              }`}
            >
              2. Budget & Timeline
              {!completedTabs.info && (
                <Lock className="text-gray-500 h-4 w-4" />
              )}
            </button>

            <button
              disabled={!completedTabs.budget}
              onClick={() => completedTabs.budget && setActiveTab("teams")}
              className={`p-3 rounded-[8px] whitespace-nowrap flex items-center gap-2 ${
                !completedTabs.budget
                  ? "opacity-30 cursor-not-allowed border border-[#6c6d6e]"
                  : activeTab === "teams"
                    ? "bg-[#068847] font-semibold text-[13px] text-white"
                    : "text-[#068847] border underline border-[#E5E7EB] text-[14px]"
              }`}
            >
              3. Team & Roles
              {!completedTabs.budget && (
                <Lock className="text-gray-500 h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
