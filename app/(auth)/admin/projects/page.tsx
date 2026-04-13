"use client";
import {
  AlertCircle,
  Calendar,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  MoreVertical,
  Users,
} from "lucide-react";
import FundRaiseProgress from "./fund-raise-progress";
import { useState, useEffect } from "react";
import NewProjectModal from "./new-project-modal";

import {
  useProjects,
  useDeleteProject,
} from "@/lib/hooks/admin/useProjectHook";
import { Project } from "@/lib/types/projectType";
import FormateDateTime from "@/components/formateDateTime/page";
import EditProjectModal from "./edit-project-modal";
import DeleteConfirmDialog from "./delete-confirmation";
import Pagination from "@/components/pagination/page";
import ProjectViewModal from "./project-view-modal";
import Link from "next/link";

const STATUS_OPTIONS = [
  "",
  "planned",
  "upcoming",
  "ongoing",
  "cancelled",
  "completed",
] as const;
const CATEGORY_OPTIONS = [
  "",
  "health",
  "education",
  "agriculture",
  "media",
  "women_entrepreneurship",
  "other",
  "humanity",
];

export default function AdminProjects() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [page, setPage] = useState(1);
  const [perPage] = useState(9);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Close dropdown when clicking anywhere that is NOT inside a [data-menu-container]
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-menu-container]")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setPage(1);
  };

  const { data, isLoading, isError } = useProjects({
    page,
    per_page: perPage,
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
    ...(search ? { q: search } : {}),
  });

  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const projects = data?.data ?? [];
  const pagination = data?.pagination;

  const handleDeleteConfirm = () => {
    if (!deletingProject) return;
    deleteProject(deletingProject.id, {
      onSuccess: () => setDeletingProject(null),
    });
  };

  // Change the argument type to 'string | undefined' and default to empty string
  const getStatusStyle = (s: string | undefined) => {
    switch (s) {
      case "upcoming":
        return "bg-[#FEF1DA] text-[#F59F0A] border border-[#FBD89C]";
      case "ongoing":
        return "bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]";
      case "planned":
        return "bg-[#F3F4F6] text-[#6A7282] border border-[#D1D5DC]";
      case "cancelled":
        return "bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]";
      default:
        // Handles 'completed', undefined, or any other unexpected value
        return "bg-[#DFF1E9] text-[#29A36A] border border-[#A8DAC3]";
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto items-center">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              onClick={() => setOpenCreateModal(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#068847] text-white whitespace-nowrap"
            >
              <Plus className="h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold">Add New Projects</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <div className="flex items-center gap-2 flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white">
            <Search className="h-4 w-4 text-[#9CA3AF] shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(searchInput);
                  setPage(1);
                }
              }}
              placeholder="Search projects by title, category..."
              className="flex-1 text-sm outline-none text-[#030712] placeholder:text-[#9CA3AF] bg-transparent"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setPage(1);
                }}
                className="text-[#968e8e] hover:text-[#ed4545] transition-colors"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch(searchInput);
              setPage(1);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#068847] text-white text-sm font-semibold whitespace-nowrap hover:bg-[#056b38] transition-colors"
          >
            <Search className="h-4 w-4" />
            Search
          </button>

          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#4A5565] bg-white outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.filter(Boolean).map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#4A5565] bg-white outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.filter(Boolean).map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#068847]" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex items-center justify-center gap-2 py-20 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">
              Failed to load projects. Please try again.
            </span>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && projects.length === 0 && (
          <div className="flex items-center justify-center py-20 text-[#4A5565]">
            <span className="text-sm">No projects found.</span>
          </div>
        )}

        {/* Projects grid */}
        {!isLoading && !isError && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-2 gap-4 mt-4">
            {projects.map((proj: Project) => (
              <div
                key={proj.id}
                className="flex flex-col border border-[#E5E7EB] rounded-[12px] gap-4 p-5"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <p className="text-[#030712] font-semibold text-[16px] leading-[150%] tracking-[-0.01em]">
                      {proj.title}
                    </p>
                    <p className="text-[#4A5565] font-normal text-[12px] leading-[150%] tracking-[-0.01em]">
                      {proj.category}
                    </p>
                  </div>
                  <div
                    className={`flex items-center justify-center rounded-full font-semibold px-3 text-[11px] shrink-0 h-[22px] ${getStatusStyle(proj.status)}`}
                  >
                    {proj.status}
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-4 flex-1">
                  <span className="text-[#4A5565] font-normal text-[12px] leading-[160%]">
                    {proj.short_description ?? proj.description}
                  </span>

                  <FundRaiseProgress
                    raised={Number(proj.funds_raised ?? 0)}
                    goal={Number(proj.budget ?? 1)}
                  />

                  <div className="w-full border border-[#E5E7EB]" />

                  <div className="flex flex-col lg:flex-row items-start xl:items-center sm:justify-between gap-2 w-full">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-md py-1">
                      <Calendar className="text-gray-500 h-4 w-4" />
                      <span className="text-gray-600 text-xs font-medium">
                        Start:
                      </span>
                      <span className="text-gray-800 text-xs">
                        <FormateDateTime
                          datetime={proj.start_date ?? ""}
                          type="date"
                        />
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-md py-1">
                      <Calendar className="text-gray-500 h-4 w-4" />
                      <span className="text-gray-600 text-xs font-medium">
                        End:
                      </span>
                      <span className="text-gray-800 text-xs">
                        <FormateDateTime
                          datetime={proj.end_date ?? ""}
                          type="date"
                        />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom action row */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingProject(proj)}
                    className="flex-1 h-[44px] rounded-[10px] bg-[#068847] text-white text-sm font-semibold hover:bg-[#056b38] transition-colors flex items-center justify-center"
                  >
                    View Project
                  </button>

                  {/*
                    Key fix: data-menu-container on the wrapper so the
                    document mousedown listener knows not to close this menu.
                    Edit/Delete use onMouseDown + stopPropagation so the
                    document listener never fires before the button action.
                  */}
                  <div className="relative" data-menu-container="true">
                    <button
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === proj.id ? null : proj.id);
                      }}
                      className="h-[44px] w-[44px] rounded-[10px] border border-[#E5E7EB] text-[#4A5565] hover:border-[#068847] hover:text-[#068847] transition-colors flex items-center justify-center cursor-pointer"
                      title="More options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {openMenuId === proj.id && (
                      <div className="absolute bottom-[50px] right-0 z-30 bg-white border border-[#E5E7EB] rounded-[10px] shadow-lg min-w-[130px] overflow-hidden">
                        <Link href={`/admin/projects/projectMember/${proj.id}`}>
                          <button className="w-full text-left px-4 py-2.5 text-[13px] text-[#030712] hover:bg-gray-100 flex items-center gap-2 transition-colors cursor-pointer">
                            <Users className="h-3.5 w-3.5 text-[#4A5565]" />
                            Project Members
                          </button>
                        </Link>
                        <button
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setEditingProject(proj);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-[13px] text-[#030712] hover:bg-gray-100 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5 text-[#4A5565]" />
                          Edit
                        </button>
                        <div className="border-t border-[#E5E7EB]" />
                        <button
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setDeletingProject(proj);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-[13px] text-[#FB2C36] hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && pagination && projects.length > 0 && (
          <Pagination
            page={page}
            perPage={perPage}
            total={pagination.total}
            dataLength={projects.length}
            onNext={() => setPage((p) => p + 1)}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onPageChange={(p) => setPage(p)}
          />
        )}

        {/* Modals */}
        {openCreateModal && (
          <NewProjectModal setOpenModal={setOpenCreateModal} />
        )}

        {editingProject && (
          <EditProjectModal
            project={editingProject}
            setOpenModal={(open) => {
              if (!open) setEditingProject(null);
            }}
          />
        )}

        {deletingProject && (
          <DeleteConfirmDialog
            projectTitle={deletingProject.title}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeletingProject(null)}
            isPending={isDeleting}
          />
        )}
        {viewingProject && (
          <ProjectViewModal
            project={viewingProject}
            onClose={() => setViewingProject(null)}
          />
        )}
      </div>
    </>
  );
}
