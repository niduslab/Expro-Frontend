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
} from "lucide-react";
import FundRaiseProgress from "./fund-raise-progress";
import { useState, useCallback } from "react";
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

  // --- Pagination & Filter State ---
  const [page, setPage] = useState(1);
  const [perPage] = useState(9);
  const [search, setSearch] = useState(""); // "q" param — searches title, category, status, etc.
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  // Debounced search input (local) vs committed search (sent to API)
  const [searchInput, setSearchInput] = useState("");

  // const handleSearchSubmit = useCallback(
  //   (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setSearch(searchInput);
  //     setPage(1); // reset to page 1 on new search
  //   },
  //   [searchInput],
  // );

  // const handleClearSearch = () => {
  //   setSearchInput("");
  //   setSearch("");
  //   setPage(1);
  // };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setPage(1);
  };

  // --- Query ---
  const { data, isLoading, isError } = useProjects({
    page,
    per_page: perPage,
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
    ...(search ? { q: search } : {}), // backend uses "q" for global search
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

  return (
    <>
      <div className="w-full items-center">
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
          {/* Search */}
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
            {/* Clear button — only shown when there's input */}
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

          {/* Search button */}
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

          {/* Status filter */}
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

          {/* Category filter */}
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

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#068847]" />
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex items-center justify-center gap-2 py-20 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">
              Failed to load projects. Please try again.
            </span>
          </div>
        )}

        {/* Empty state */}
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
                className="flex flex-col border border-[#E5E7EB] rounded-[12px] relative gap-4 p-5 h-auto"
              >
                <div className="flex items-center justify-between h-[43px]">
                  <div className="flex gap-3 items-start flex-1">
                    <div className="flex flex-col">
                      <p className="text-[#030712] font-semibold text-[16px] leading-[150%] tracking-[-0.01em]">
                        {proj.title}
                      </p>
                      <p className="text-[#4A5565] font-normal text-[12px] leading-[150%] tracking-[-0.01em]">
                        {proj.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center justify-center rounded-full font-semibold px-2 text-[11px] ${
                        proj.status === "upcoming"
                          ? "bg-[#FEF1DA] text-[#F59F0A] border border-[#FBD89C]"
                          : "bg-[#DFF1E9] text-[#29A36A] border border-[#A8DAC3]"
                      }`}
                      style={{ height: "22px" }}
                    >
                      {proj.status}
                    </div>

                    <button
                      onClick={() => setEditingProject(proj)}
                      className="flex items-center justify-center h-[28px] w-[28px] rounded-md border border-[#E5E7EB] text-[#4A5565] hover:border-[#068847] hover:text-[#068847] transition-colors"
                      title="Edit project"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => setDeletingProject(proj)}
                      className="flex items-center justify-center h-[28px] w-[28px] rounded-md border border-[#E5E7EB] text-[#4A5565] hover:border-[#FB2C36] hover:text-[#FB2C36] transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 h-auto w-full">
                  <span className="text-[#4A5565] font-normal text-[12px] leading-[160%]">
                    {proj.short_description ?? proj.description}
                  </span>

                  <FundRaiseProgress
                    raised={Number(proj.funds_raised ?? 0)}
                    goal={Number(proj.budget ?? 1)}
                  />

                  <div className="w-full border border-[#E5E7EB]" />

                  <div className="flex flex-col lg:flex-row items-start xl:items-center sm:justify-between gap-2 w-full">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-md py-1 sm:justify-start">
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

                    <div className="flex items-center gap-2 bg-gray-50 rounded-md py-1 sm:justify-end">
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
      </div>
    </>
  );
}
