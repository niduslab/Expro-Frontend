"use client";

import { useEffect, useState } from "react";
import {
  ExproTeamMember,
  ExproTeamMemberPayload,
} from "@/lib/types/admin/exproTeamMemberType";
import {
  useCreateExproTeamMember,
  useUpdateExproTeamMember,
} from "@/lib/hooks/admin/useexproTeamMembersHook";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import DesignationDropdown from "./designationDropdown";

interface ExproTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
  member?: ExproTeamMember | null;
}

const defaultForm: ExproTeamMemberPayload = {
  name: "",
  designation: "",
};

const inputClass =
  "w-full h-[48px] border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px]";

function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <div className="pb-2">
      <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
        {label}
      </span>
      {required && (
        <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
          *
        </span>
      )}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-sm text-red-500">{message}</span>;
}

export default function ExproTeamMemberModal({
  open,
  onClose,
  member,
}: ExproTeamMemberModalProps) {
  const isEdit = !!member;

  const [formData, setFormData] = useState<ExproTeamMemberPayload>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (open && member) {
      setFormData({
        name: member.name,
        designation: member.designation,
        // ✅ Don't set image_url — it's a file upload, not a URL string field
      });
    } else if (open && !member) {
      setFormData(defaultForm);
    }
    setImageFile(null); // ✅ Reset file on every open
    setErrors({});
  }, [open, member]);

  const set = (field: keyof ExproTeamMemberPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!String(formData.name ?? "").trim())
      newErrors.name = "Name is required";
    if (!String(formData.designation ?? "").trim())
      newErrors.designation = "Designation is required";
    // ✅ No image_url URL validation — it's a file, not a URL
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors).slice(-1)[0]);
      return false;
    }
    return true;
  };

  const { mutate: create, isPending: creating } = useCreateExproTeamMember({
    onSuccess: () => {
      toast.success("Team member created successfully");
      onClose();
    },
    onError: () => toast.error("Failed to create team member"),
  });

  const { mutate: update, isPending: updating } = useUpdateExproTeamMember(
    member?.id ?? 0,
    {
      onSuccess: () => {
        toast.success("Team member updated successfully");
        onClose();
      },
      onError: () => toast.error("Failed to update team member"),
    },
  );

  const isPending = creating || updating;

  const handleSubmit = () => {
    if (!validate()) return;

    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("designation", formData.designation);

    if (imageFile) {
      formDataObj.append("image_url", imageFile);
    }

    if (isEdit) update(formDataObj);
    else create(formDataObj);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="flex flex-col w-full max-w-[600px] h-[85vh] p-2 md:p-6 bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black relative my-4">
        <div className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden p-2">
          {/* ── Header ── */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                {isEdit ? "Edit Team Member" : "Add New Team Member"}
              </p>
              <button
                onClick={onClose}
                disabled={isPending}
                className="text-gray-500 hover:text-black disabled:opacity-40"
              >
                ✕
              </button>
            </div>
            <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
              {isEdit
                ? "Update the team member information below."
                : "Fill in the team member details below."}
            </p>
          </div>

          <div className="w-full border border-[#E5E7EB]" />

          {/* ── Section 1: Member Details ── */}
          <div className="flex flex-col relative top-[24px] gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Member Details
            </p>

            <div className="flex flex-col gap-1">
              <FieldLabel label="Full Name" required />
              <input
                className={inputClass}
                placeholder="e.g. John Doe"
                value={String(formData.name ?? "")}
                onChange={(e) => set("name", e.target.value)}
              />
              <FieldError message={errors.name} />
            </div>

            <div className="flex flex-col gap-1">
              <FieldLabel label="Designation" required />
              <DesignationDropdown
                value={String(formData.designation ?? "")}
                onChange={(val) => set("designation", val)}
                error={errors.designation}
              />
              <FieldError message={errors.designation} />
            </div>

            <div className="w-full border border-[#E5E7EB]" />
          </div>

          {/* ── Section 2: Profile Image ── */}
          <div className="flex flex-col relative top-[48px] gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Profile Image
            </p>

            <div className="flex flex-col gap-2">
              <FieldLabel label="Upload Image" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setImageFile(file);
                }}
                className="w-full border border-[#D1D5DC] rounded-[8px] px-[16px] py-[10px] bg-[#FFFFFF] text-[#6A7282] text-sm"
              />
              {/* ✅ Preview new file selection */}
              {imageFile && (
                <div className="flex items-center gap-3">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    className="w-16 h-16 rounded-xl object-cover border border-[#E5E7EB]"
                    alt="New upload preview"
                  />
                  <span className="text-[12px] text-[#6A7282]">
                    New image selected
                  </span>
                </div>
              )}
              {/* ✅ Show existing image on edit when no new file selected */}
              {!imageFile && member?.image_url && (
                <div className="flex items-center gap-3">
                  <img
                    src={member.image_url}
                    className="w-16 h-16 rounded-xl object-cover border border-[#E5E7EB]"
                    alt="Current image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span className="text-[12px] text-[#6A7282]">
                    Current image (unchanged)
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex ml-auto gap-[16px] w-fit pt-4">
              <button
                onClick={onClose}
                disabled={isPending}
                className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] leading-[150%] tracking-[-0.01em] disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-[#068847] h-[48px] w-[200px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em] disabled:opacity-60 gap-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : isEdit ? (
                  <span>Save Changes</span>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Add Member</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
