"use client";

import { useEffect, useState } from "react";
import { useAssignRole } from "@/lib/hooks/admin/useUsers";
import { SystemUser } from "@/lib/types/admin/userType";
import { Role } from "@/lib/types/admin/roleType";
import { toast } from "sonner";
import { Loader2, X, ShieldCheck } from "lucide-react";

interface ManageUserRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SystemUser | null;
  availableRoles: Role[];
}

export default function ManageUserRolesModal({
  isOpen,
  onClose,
  user,
  availableRoles,
}: ManageUserRolesModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const assignMutation = useAssignRole();

  useEffect(() => {
    if (user && isOpen) setSelected(user.roles ?? []);
  }, [user, isOpen]);

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name],
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    try {
      await assignMutation.mutateAsync({ user_id: user.id, roles: selected });
      toast.success("Roles updated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update roles");
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#068847]/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#068847]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#030712]">
                Manage Roles
              </h2>
              <p className="text-sm text-[#6B7280] mt-0.5">
                {user.name || user.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={assignMutation.isPending}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-[#4A5565]" />
          </button>
        </div>

        <div className="p-6 space-y-2 overflow-y-auto">
          {availableRoles.length === 0 ? (
            <p className="text-sm text-[#6B7280]">No roles available.</p>
          ) : (
            availableRoles.map((role) => {
              const checked = selected.includes(role.name);
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => toggle(role.name)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    checked
                      ? "border-[#068847] bg-[#068847]/5"
                      : "border-[#E5E7EB] hover:border-[#068847]/30"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                      checked
                        ? "border-[#068847] bg-[#068847]"
                        : "border-[#D1D5DB]"
                    }`}
                  >
                    {checked && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm font-medium uppercase text-[#030712]">
                    {role.name}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onClose}
            disabled={assignMutation.isPending}
            className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#4A5565] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={assignMutation.isPending}
            className="px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {assignMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Save Roles
          </button>
        </div>
      </div>
    </div>
  );
}
