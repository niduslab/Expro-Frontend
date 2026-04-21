"use client";

import { useEffect, useState } from "react";
import { Branch, BranchPayload } from "@/lib/types/branchType";
import {
  useCreateBranch,
  useUpdateBranch,
} from "@/lib/hooks/admin/useBranchesHook";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BranchModalProps {
  open: boolean;
  onClose: () => void;
  branch?: Branch | null;
}

const defaultForm: BranchPayload = {
  code: "",
  name: "",
  name_bangla: "",
  district: "",
  division: "",
  address: "",
  contact_number: "",
  email: "",
  is_active: true,
};

const inputClass =
  "w-full h-[48px] border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px]";

const textareaClass =
  "w-full border border-[#D1D5DC] rounded-[8px] px-[16px] py-[12px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px] resize-none";

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

export default function BranchModal({
  open,
  onClose,
  branch,
}: BranchModalProps) {
  const isEdit = !!branch;

  const [formData, setFormData] = useState<BranchPayload>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && branch) {
      setFormData({
        code: branch.code,
        name: branch.name,
        name_bangla: branch.name_bangla ?? "",
        district: branch.district ?? "",
        division: branch.division ?? "",
        address: branch.address ?? "",
        contact_number: branch.contact_number ?? "",
        email: branch.email ?? "",
        is_active: branch.is_active,
      });
    } else if (open && !branch) {
      setFormData(defaultForm);
    }
    setErrors({});
  }, [open, branch]);

  const set = (field: keyof BranchPayload, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!String(formData.code ?? "").trim())
      newErrors.code = "Branch code is required";
    if (!String(formData.name ?? "").trim())
      newErrors.name = "Branch name is required";
    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(formData.email))
    ) {
      newErrors.email = "Enter a valid email address";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors).slice(-1)[0]);
      return false;
    }
    return true;
  };

  const { mutate: create, isPending: creating } = useCreateBranch({
    onSuccess: () => {
      toast.success("Branch created successfully");
      onClose();
    },
    onError: () => toast.error("Failed to create branch"),
  });

  const { mutate: update, isPending: updating } = useUpdateBranch(
    branch?.id ?? 0,
    {
      onSuccess: () => {
        toast.success("Branch updated successfully");
        onClose();
      },
      onError: () => toast.error("Failed to update branch"),
    },
  );

  const isPending = creating || updating;

  const handleSubmit = () => {
    if (!validate()) return;
    if (isEdit) update(formData);
    else create(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto p-2">
      <div className="flex flex-col w-full max-w-4xl h-[85vh] p-2 md:p-6 bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black relative my-4">
        <div className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden p-2">
          {/* ── Header ── */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                {isEdit ? "Edit Branch" : "Create New Branch"}
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
                ? "Update the branch information below."
                : "Fill in the branch details, location, and contact information."}
            </p>
          </div>

          <div className="w-full border border-[#E5E7EB]" />

          {/* ── Section 1: Branch Details ── */}
          <div className="flex flex-col relative top-[24px] gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Branch Details
            </p>

            {/* Code + Name */}
            <div className="flex gap-2 w-full">
              <div className="w-1/2">
                <FieldLabel label="Branch Code" required />
                <input
                  className={inputClass}
                  placeholder="e.g. BR001"
                  value={String(formData.code ?? "")}
                  onChange={(e) => set("code", e.target.value)}
                />
                <FieldError message={errors.code} />
              </div>
              <div className="w-1/2">
                <FieldLabel label="Branch Name" required />
                <input
                  className={inputClass}
                  placeholder="e.g. Dhaka Main Branch"
                  value={String(formData.name ?? "")}
                  onChange={(e) => set("name", e.target.value)}
                />
                <FieldError message={errors.name} />
              </div>
            </div>

            {/* Bangla Name */}
            <div>
              <FieldLabel label="Name (Bangla)" />
              <input
                className={inputClass}
                placeholder="e.g. ঢাকা প্রধান শাখা"
                value={String(formData.name_bangla ?? "")}
                onChange={(e) => set("name_bangla", e.target.value)}
              />
            </div>

            {/* Status */}
            <div>
              <FieldLabel label="Status" />
              <div className="flex items-center gap-3 h-[48px]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={Boolean(formData.is_active)}
                    onChange={(e) => set("is_active", e.target.checked)}
                  />
                  <div className="w-10 h-5 bg-[#D1D5DC] rounded-full peer peer-checked:bg-[#068847] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
                <span className="text-[14px] text-[#4A5565]">
                  {formData.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="w-full border border-[#E5E7EB]" />
          </div>

          {/* ── Section 2: Location ── */}
          <div className="flex flex-col relative top-[48px] gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Location
            </p>

            {/* District + Division */}
            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="md:w-1/2">
                <FieldLabel label="District" />
                <input
                  className={inputClass}
                  placeholder="e.g. Dhaka"
                  value={String(formData.district ?? "")}
                  onChange={(e) => set("district", e.target.value)}
                />
              </div>
              <div className="md:w-1/2">
                <FieldLabel label="Division" />
                <input
                  className={inputClass}
                  placeholder="e.g. Dhaka"
                  value={String(formData.division ?? "")}
                  onChange={(e) => set("division", e.target.value)}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <FieldLabel label="Address" />
              <textarea
                className={textareaClass}
                rows={2}
                placeholder="e.g. 123 Main Street, Dhaka"
                value={String(formData.address ?? "")}
                onChange={(e) => set("address", e.target.value)}
              />
            </div>

            <div className="w-full border border-[#E5E7EB]" />
          </div>

          {/* ── Section 3: Contact ── */}
          <div className="flex flex-col relative top-[86px] gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Contact Information
            </p>

            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="md:w-1/2">
                <FieldLabel label="Contact Number" />
                <input
                  className={inputClass}
                  placeholder="e.g. 01712345678"
                  value={String(formData.contact_number ?? "")}
                  onChange={(e) => set("contact_number", e.target.value)}
                />
                <span className="text-[#6A7282] font-normal text-[12px] leading-[160%] tracking-[-0.01em]">
                  Primary contact for this branch
                </span>
                <FieldError message={errors.contact_number} />
              </div>
              <div className="md:w-1/2">
                <FieldLabel label="Email Address" />
                <input
                  type="email"
                  className={inputClass}
                  placeholder="e.g. branch@example.com"
                  value={String(formData.email ?? "")}
                  onChange={(e) => set("email", e.target.value)}
                />
                <span className="text-[#6A7282] font-normal text-[12px] leading-[160%] tracking-[-0.01em]">
                  Official branch email address
                </span>
                <FieldError message={errors.email} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex  ml-auto  gap-[16px] w-fit">
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
                className="bg-[#068847] h-[48px] w-[180px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em] disabled:opacity-60 gap-1"
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
                    <span>Add Branch</span>
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
