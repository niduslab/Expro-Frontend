"use client";

import { useState, useEffect } from "react";
import { useAssignRole } from "@/lib/hooks/admin/useUsers";
import { UserListItem } from "@/lib/types/admin/userType";
import { Role } from "@/lib/types/admin/roleType";
import { toast } from "sonner";
import { Loader2, X, ShieldCheck } from "lucide-react";

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserListItem | null;
  availableRoles: Role[];
}

export default function AssignRoleModal({
  isOpen,
  onClose,
  user,
  availableRoles,
}: AssignRoleModalProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const assignRoleMutation = useAssignRole();

  useEffect(() => {
    if (user) {
      setSelectedRoles(user.roles || []);
    }
  }, [user]);

  const handleRoleToggle = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await assignRoleMutation.mutateAsync({
        user_id: user.id,
        roles: selectedRoles,
      });

      toast.success("Roles assigned successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to assign roles");
    }
  };

  if (!isOpen || !user) return null;

  console.log("Available Roles:", availableRoles);
  console.log("User Roles:", user.roles);
  console.log("Selected Roles:", selectedRoles);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#068847]/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#068847]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#030712]">Assign Roles</h2>
              <p className="text-sm text-[#6B7280] mt-0.5">
                {user.member?.first_name} {user.member?.last_name} ({user.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            disabled={assignRoleMutation.isPending}
          >
            <X className="w-5 h-5 text-[#4A5565]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {availableRoles.length === 0 ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#068847] mx-auto mb-3" />
              <p className="text-[#6B7280]">Loading available roles...</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {availableRoles.map((role) => (
                  <div
                    key={role.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedRoles.includes(role.name)
                        ? "border-[#068847] bg-[#068847]/5"
                        : "border-[#E5E7EB] hover:border-[#068847]/30"
                    }`}
                    onClick={() => handleRoleToggle(role.name)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            selectedRoles.includes(role.name)
                              ? "border-[#068847] bg-[#068847]"
                              : "border-[#D1D5DB]"
                          }`}
                        >
                          {selectedRoles.includes(role.name) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-[#030712] uppercase">
                            {role.name}
                          </h3>
                          {selectedRoles.includes(role.name) && (
                            <span className="text-xs px-2 py-0.5 bg-[#068847] text-white rounded-full">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6B7280] mt-1">
                          Guard: {role.guard_name}
                        </p>
                        {role.description && (
                          <p className="text-xs text-[#6B7280] mt-1">{role.description}</p>
                        )}
                        {role.permissions && role.permissions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {role.permissions.map((permission, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-0.5 bg-[#F3F4F6] text-[#4A5565] rounded"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedRoles.length === 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    ⚠️ Warning: User will have no roles assigned
                  </p>
                </div>
              )}

              {selectedRoles.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    Selected Roles ({selectedRoles.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoles.map((roleName) => (
                      <span
                        key={roleName}
                        className="text-xs px-3 py-1 bg-[#068847] text-white rounded-full uppercase font-medium"
                      >
                        {roleName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB]">
          <button
            onClick={onClose}
            disabled={assignRoleMutation.isPending}
            className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#4A5565] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={assignRoleMutation.isPending}
            className="px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {assignRoleMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Assign Roles
          </button>
        </div>
      </div>
    </div>
  );
}
