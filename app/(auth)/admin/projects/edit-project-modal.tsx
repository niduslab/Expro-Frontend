"use client";
import React, { useState } from "react";
import ProjectInfo from "./project-info";
import ProjectBudgetTimeline from "./project-budget-timeline";
import ProjectTeamsRoles from "./project-teams-roles";
import { Lock } from "lucide-react";
import {
  Project,
  ProjectFormDataInterface,
  UpdateProjectPayload,
} from "@/lib/types/projectType";
import { useUpdateProject } from "@/lib/hooks/admin/useProjectHook";
import { useUsers } from "@/lib/hooks/admin/useUsers";

export type CompletedTabs = {
  info: boolean;
  budget: boolean;
  teams: boolean;
};

interface EditProjectModalProps {
  project: Project;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditProjectModal({
  project,
  setOpenModal,
}: EditProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "budget" | "teams">(
    "info",
  );
  const { mutate: updateProject, isPending } = useUpdateProject();
  const { data: usersData } = useUsers();

  const formatDate = (date?: string) => {
    if (!date) return "";
    return date.split("T")[0]; // converts ISO → YYYY-MM-DD
  };
  // Pre-fill form with existing project data
  const [formData, setFormData] = useState<ProjectFormDataInterface>({
    title: project.title ?? "",
    category: project.category ?? "",
    status: project.status ?? "",
    shortDescription: project.short_description ?? "",
    description: project.description ?? "",
    totalBudget: project.budget != null ? String(project.budget) : "",
    initialFund:
      project.funds_raised != null ? String(project.funds_raised) : "",
    fundsUtilized:
      project.funds_utilized != null ? String(project.funds_utilized) : "",
    startDate: formatDate(project.start_date),
    endDate: formatDate(project.end_date),
    projectLeadId: project.project_lead_id ?? null,
    isFeatured: project.is_featured ?? false,
    isPublished: project.is_published ?? false,
    featuredImage: null,
  });

  // All tabs unlocked when editing
  const [, setCompletedTabs] = useState<CompletedTabs>({
    info: true,
    budget: true,
    teams: true,
  });

  const handleFinalSubmit = () => {
    const payload: UpdateProjectPayload = {
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
      start_date: formData.startDate || undefined,
      end_date: formData.endDate || undefined,
      is_featured: formData.isFeatured,
      is_published: formData.isPublished,
      project_lead_id: formData.projectLeadId ?? undefined,
      featured_image: formData.featuredImage ?? undefined, // ← add
    };

    updateProject(
      { id: project.id, payload },
      { onSuccess: () => setOpenModal(false) },
    );
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
              Edit Project
            </p>
            <button
              onClick={() => setOpenModal(false)}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
            Update details for{" "}
            <span className="font-semibold text-[#030712]">
              {project.title}
            </span>
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
              onClick={() => setActiveTab("budget")}
              className={`p-3 rounded-[8px] whitespace-nowrap flex items-center gap-2 ${
                activeTab === "budget"
                  ? "bg-[#068847] font-semibold text-[13px] text-white"
                  : "text-[#068847] border underline border-[#E5E7EB] text-[14px]"
              }`}
            >
              2. Budget & Timeline
            </button>

            <button
              onClick={() => setActiveTab("teams")}
              className={`p-3 rounded-[8px] whitespace-nowrap flex items-center gap-2 ${
                activeTab === "teams"
                  ? "bg-[#068847] font-semibold text-[13px] text-white"
                  : "text-[#068847] border underline border-[#E5E7EB] text-[14px]"
              }`}
            >
              3. Team & Roles
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
