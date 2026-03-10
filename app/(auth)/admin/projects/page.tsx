"use client";
import { Calendar, Plus, Users } from "lucide-react";
import FundRaiseProgress from "./fund-raise-progress";
import { useState } from "react";
import NewProjectModal from "./new-project-modal";

const projects = [
  {
    title: "Health Initiative",
    category: "health",
    status: "Ongoing",
    description: "Comprehensive health program for rural communities",
    members: 340,
    date: "2024-01-15",
    raised: 18.5,
    goal: 25,
  },
  {
    title: "Education For All",
    category: "education",
    status: "Ongoing",
    description:
      "Scholarship and tutoring programs for underprivileged students",
    members: 210,
    date: "2024-03-01",
    raised: 12,
    goal: 25,
  },
  {
    title: "Green Agriculture",
    category: "agriculture",
    status: "Upcoming",
    description: "Sustainable farming practices and microfinance for farmers",
    members: 0,
    date: "2025-04-01",
    raised: 4.5,
    goal: 30,
  },
  {
    title: "Women Entrepreneurship",
    category: "women entrepreneurship",
    status: "Ongoing",
    description: "Skill development and seed funding for women entrepreneurs",
    members: 0,
    date: "2025-06-01",
    raised: 0,
    goal: 20,
  },
  {
    title: "Digital Media Hub",
    category: "media",
    status: "Ongoing",
    description: "Community media training and content creation center",
    members: 95,
    date: "2024-06-15",
    raised: 6.8,
    goal: 8,
  },
  {
    title: "Humanity First",
    category: "humanity",
    status: "Upcoming",
    description:
      "Emergency relief and rehabilitation for flood-affected regions",
    members: 520,
    date: "2023-01-01",
    raised: 50,
    goal: 50,
  },
];

export default function AdminProjects() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <div className="container">
        <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
              Projects
            </p>
            <p className="text-sm text-[#4A5565]">
              Manage welfare projects & initiatives
            </p>
          </div>

          <div className="flex justify-start sm:justify-end">
            <button
              onClick={() => {
                setOpenModal(true);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#068847] text-white whitespace-nowrap"
            >
              <Plus className="h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold">Add New Projects</span>
            </button>
          </div>
        </div>

        <div className=" grid grid-cols-1 xl:grid-cols-3 gap-4 mt-8">
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className="w-[367px] h-[265px] flex flex-col border border-[#E5E7EB] rounded-[12px] relative gap-4 top-10 p-5"
            >
              <div className="h-[43px] flex items-center justify-between">
                <div className="flex gap-[13px] items-start">
                  <div className="flex flex-col h-[43px] w-[265px]">
                    <p className=" text-[#030712] font-semibold text-[16px] leading-[150%] tracking-[-0.01em]">
                      {proj.title}
                    </p>
                    <p className=" text-[#4A5565] font-normal text-[12px] leading-[150%] tracking-[-0.01em]">
                      {proj.category}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center justify-center rounded-full font-semibold  ${
                    proj.status === "Upcoming"
                      ? "w-[80px] px-1 text-[11px] border bg-[#FEF1DA] text-[#F59F0A] border-[#FBD89C]"
                      : "w-[72px] bg-[#DFF1E9] text-[11px] border border-[#A8DAC3] text-[#29A36A]"
                  }`}
                  style={{ height: "22px" }}
                >
                  {proj.status}
                </div>
              </div>

              <div className="flex flex-col gap-4 h-[129px] w-full">
                <span className="text-[#4A5565] w-[334px] font-normal text-[12px] leading-[160%]">
                  {proj.description}
                </span>
                <FundRaiseProgress raised={proj.raised} goal={proj.goal} />

                <div className="w-[334px] border border-[#E5E7EB]"></div>

                <div className="flex w-[210px] h-[19px] gap-[24px]">
                  <div className="flex items-center gap-[7px] w-[100px]">
                    <Users className="text-[#4A5565] h-[14px] w-[14px]" />
                    <span className="text-[#4A5565] font-normal text-[12px]">
                      {proj.members} members
                    </span>
                  </div>
                  <div className="flex items-center gap-[7px] w-[86px]">
                    <Calendar className="text-[#4A5565] h-[14px] w-[14px]" />
                    <span className="text-[#4A5565] font-normal text-[11px]">
                      {proj.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {openModal && <NewProjectModal setOpenModal={setOpenModal} />}
      </div>
    </>
  );
}
