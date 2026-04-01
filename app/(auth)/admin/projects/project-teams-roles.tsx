import { ArrowLeft, CircleCheck, ChevronDown, Search } from "lucide-react";
import { projectTeamSchema } from "@/components/zodschema/projectSchema";
import { toast } from "sonner";
import { useState } from "react";
import { ProjectFormDataInterface } from "@/lib/types/projectType";
import { UserListItem } from "@/lib/types/admin/userType";

const tabs: ("info" | "budget" | "teams")[] = ["info", "budget", "teams"];

interface NewProjectModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: "info" | "budget" | "teams";
  formData: ProjectFormDataInterface;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormDataInterface>>;
  setActiveTab: React.Dispatch<
    React.SetStateAction<"info" | "budget" | "teams">
  >;
  onSubmit: () => void; // ← new
  isPending: boolean; // ← new
  users: UserListItem[];
}

export default function ProjectTeamsRoles({
  activeTab,
  formData,
  setFormData,
  setActiveTab,
  onSubmit,
  isPending,
  users,
}: NewProjectModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = users.filter((u) =>
    u.member?.name_english.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedUser = users.find((u) => u.id === formData.projectLeadId);

  const handleSubmit = () => {
    const result = projectTeamSchema.safeParse({
      projectLeadId: formData.projectLeadId,
      fundsUtilized: formData.fundsUtilized,
      isFeatured: formData.isFeatured,
      isPublished: formData.isPublished,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error(
        result.error.issues.slice(-1)[0]?.message || "Validation failed",
      );
      return;
    }

    setErrors({});
    onSubmit();
  };

  const handleBack = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
  };

  return (
    <div className="flex flex-col relative w-full gap-[16px] pt-4">
      {/* Row 1: Project Lead dropdown + Funds Utilized */}
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        {/* Project Lead — searchable dropdown */}
        <div className="relative w-full sm:w-1/2">
          <div className="pb-2">
            <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
              Project Lead
            </span>
          </div>

          {/* Trigger */}
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="h-[48px] w-full flex items-center justify-between border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-left"
          >
            <span
              className={`text-[14px] truncate ${selectedUser ? "text-[#030712]" : "text-[#6A7282]"}`}
            >
              {selectedUser?.member?.name_english ||
                selectedUser?.email ||
                "Select a member"}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-[#6A7282] shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown panel */}
          {dropdownOpen && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-[#D1D5DC] rounded-[8px] shadow-lg">
              {/* Search */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-[#E5E7EB]">
                <Search className="h-4 w-4 text-[#6A7282] shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name/email..."
                  className="flex-1 text-[13px] text-[#030712] outline-none bg-transparent"
                />
              </div>

              {/* Options */}
              <ul className="max-h-[160px] overflow-y-auto py-1">
                {filtered.length === 0 ? (
                  <li className="px-4 py-2 text-[13px] text-[#6A7282]">
                    No members found
                  </li>
                ) : (
                  filtered.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => {
                        setFormData({ ...formData, projectLeadId: user.id });
                        setDropdownOpen(false);
                        setSearch("");
                        if (errors.projectLeadId)
                          setErrors((prev) => ({ ...prev, projectLeadId: "" }));
                      }}
                      className={`flex items-center justify-between px-4 py-2 text-[13px] cursor-pointer hover:bg-[#F3F4F6] ${
                        formData.projectLeadId === user.id
                          ? "bg-[#DFF1E9] text-[#068847] font-semibold"
                          : "text-[#030712]"
                      }`}
                    >
                      <span className="truncate">
                        {user.member?.name_english || user.email}
                      </span>
                      <span className="text-[11px] text-[#6A7282] ml-2 shrink-0">
                        {user.roles[0] ?? ""}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {errors.projectLeadId && (
            <span className="text-sm text-red-500 py-0.5">
              {errors.projectLeadId}
            </span>
          )}
        </div>

        {/* Funds Utilized */}
        <div className="relative w-full sm:w-1/2">
          <div className="pb-2">
            <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
              Funds Utilized (৳)
            </span>
          </div>
          <input
            type="number"
            value={formData.fundsUtilized}
            onChange={(e) => {
              setFormData({ ...formData, fundsUtilized: e.target.value });
              if (errors.fundsUtilized)
                setErrors((prev) => ({ ...prev, fundsUtilized: "" }));
            }}
            className="h-[48px] text-[#6A7282] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500"
            placeholder="e.g. 5000"
          />
          {errors.fundsUtilized && (
            <span className="text-sm text-red-500 py-0.5">
              {errors.fundsUtilized}
            </span>
          )}
        </div>
      </div>

      {/* Row 2: is_featured + is_published toggles */}
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        {/* is_featured */}
        <div className="w-full sm:w-1/2 flex items-center justify-between h-[48px] border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]">
          <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] text-[#030712]">
            Featured Project
          </span>
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, isFeatured: !formData.isFeatured })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              formData.isFeatured ? "bg-[#068847]" : "bg-[#D1D5DC]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                formData.isFeatured ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* is_published */}
        <div className="w-full sm:w-1/2 flex items-center justify-between h-[48px] border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF]">
          <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] text-[#030712]">
            Publish Project
          </span>
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, isPublished: !formData.isPublished })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              formData.isPublished ? "bg-[#068847]" : "bg-[#D1D5DC]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                formData.isPublished ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex relative justify-between w-full pt-8 gap-[16px]">
        <button
          onClick={handleBack}
          className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px]"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-[#068847] gap-2 h-[48px] w-[158px] rounded-xl px-[16px] text-white flex items-center justify-center font-semibold text-[16px] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{isPending ? "Saving..." : "Complete"}</span>
          <CircleCheck className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
