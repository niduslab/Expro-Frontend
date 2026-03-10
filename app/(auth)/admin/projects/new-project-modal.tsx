import React, { useState } from "react";
import ProjectInfo from "./project-info";
import ProjectBudgetTimeline from "./project-budget-timeline";
import ProjectTeamsRoles from "./project-teams-roles";

interface NewProjectModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NewProjectModal({
  setOpenModal,
}: NewProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "budget" | "teams">(
    "info",
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <ProjectInfo
            setOpenModal={setOpenModal}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
      case "budget":
        return (
          <ProjectBudgetTimeline
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
      case "teams":
        return (
          <ProjectTeamsRoles
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col w-[600px] h-[90vh] p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black relative">
        {/* Header */}
        <div className="p-2 flex flex-col gap-[6px] ">
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

        {/* Divider */}
        <div className="w-full border border-[#E5E7EB] mt-4 mb-4"></div>
        <div className=" overflow-y-auto">
          {/* Tabs */}
          <div className="h-[45px] gap-[24px] flex ">
            <button
              onClick={() => setActiveTab("info")}
              className={`p-3 rounded-[8px] gap-[8px] ${
                activeTab === "info"
                  ? "bg-[#068847] font-semibold text-[13px] leading-[150%] tracking-[-0.01em] text-[#FFFFFF]"
                  : "text-[#4A5565] border border-[#E5E7EB] font-normal text-[14px] leading-[150%] tracking-[-0.01em]"
              }`}
            >
              Project Info
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className={`p-3 rounded-[8px] gap-[8px] ${
                activeTab === "budget"
                  ? "bg-[#068847] font-semibold text-[13px] leading-[150%] tracking-[-0.01em] text-[#FFFFFF]"
                  : "text-[#4A5565] border border-[#E5E7EB] font-normal text-[14px] leading-[150%] tracking-[-0.01em]"
              }`}
            >
              Budget & Timeline
            </button>
            <button
              onClick={() => setActiveTab("teams")}
              className={`p-3 rounded-[8px] gap-[8px] ${
                activeTab === "teams"
                  ? "bg-[#068847] font-semibold text-[13px] leading-[150%] tracking-[-0.01em] text-[#FFFFFF]"
                  : "text-[#4A5565] border border-[#E5E7EB] font-normal text-[14px] leading-[150%] tracking-[-0.01em]"
              }`}
            >
              Team & Roles
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-2">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
