"use client";

import { useEffect, useMemo, useState } from "react";
import { useCreateRole, useUpdateRole } from "@/lib/hooks/admin/useUsers";
import { Permission, Role } from "@/lib/types/admin/roleType";
import { toast } from "sonner";
import { Loader2, X, ShieldCheck, Search } from "lucide-react";

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Pass a role to edit; omit/null to create a new role. */
  role?: Role | null;
  permissions: Permission[];
}

// Group permissions by their prefix (the segment before the first underscore)
// e.g. "access_dashboard" -> "access", "view_users" -> "view".
function groupPermissions(permissions: Permission[]) {
  const groups: Record<string, Permission[]> = {};
  permissions.forEach((p) => {
    const key = p.name.includes("_") ? p.name.split("_")[0] : "other";
    (groups[key] ||= []).push(p);
  });
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

export default function RoleFormModal({
  isOpen,
  onClose,
  role,
  permissions,
}: RoleFormModalProps) {
  const isEdit = !!role;
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      setName(role?.name ?? "");
      setSelected(role?.permissions ?? []);
      setSearch("");
      setError("");
    }
  }, [isOpen, role]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? permissions.filter((p) => p.name.toLowerCase().includes(q))
      : permissions;
  }, [permissions, search]);

  const grouped = useMemo(() => groupPermissions(filtered), [filtered]);

  const togglePermission = (perm: string) => {
    setSelected((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  };

  const toggleGroup = (groupPerms: Permission[]) => {
    const names = groupPerms.map((p) => p.name);
    const allSelected = names.every((n) => selected.includes(n));
    setSelected((prev) =>
      allSelected
        ? prev.filter((p) => !names.includes(p))
        : Array.from(new Set([...prev, ...names])),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && !name.trim()) {
      setError("Role name is required");
      return;
    }

    try {
      if (isEdit && role) {
        await updateMutation.mutateAsync({
          id: role.id,
          name: role.is_protected ? undefined : name.trim(),
          permissions: selected,
        });
        toast.success("Role updated successfully");
      } else {
        await createMutation.mutateAsync({
          name: name.trim(),
          permissions: selected,
        });
        toast.success("Role created successfully");
      }
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.name?.[0] ||
        err?.response?.data?.message ||
        "Something went wrong";
      setError(msg);
      toast.error(msg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#068847]/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#068847]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#030712]">
                {isEdit ? "Edit Role" : "Create Role"}
              </h2>
              <p className="text-sm text-[#6B7280] mt-0.5">
                {isEdit
                  ? "Update the role and its permissions"
                  : "Define a new role and assign permissions"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-[#4A5565]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-1.5">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                disabled={isEdit && role?.is_protected}
                placeholder="e.g. moderator"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] disabled:bg-[#F3F4F6] disabled:text-[#6B7280]"
              />
              {isEdit && role?.is_protected && (
                <p className="text-xs text-[#6B7280] mt-1">
                  This is a protected role — its name can&apos;t be changed, but
                  you can adjust its permissions.
                </p>
              )}
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            {/* Permissions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#030712]">
                  Permissions ({selected.length})
                </label>
                <div className="relative w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filter..."
                    className="w-full pl-8 pr-2 py-1.5 border border-[#E5E7EB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847]"
                  />
                </div>
              </div>

              <div className="space-y-4 border border-[#E5E7EB] rounded-xl p-4 max-h-[40vh] overflow-y-auto">
                {grouped.length === 0 ? (
                  <p className="text-sm text-[#6B7280] text-center py-4">
                    No permissions found.
                  </p>
                ) : (
                  grouped.map(([group, perms]) => {
                    const allSelected = perms.every((p) =>
                      selected.includes(p.name),
                    );
                    return (
                      <div key={group}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                            {group}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleGroup(perms)}
                            className="text-xs text-[#068847] hover:underline"
                          >
                            {allSelected ? "Clear all" : "Select all"}
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {perms.map((perm) => {
                            const checked = selected.includes(perm.name);
                            return (
                              <button
                                key={perm.id}
                                type="button"
                                onClick={() => togglePermission(perm.name)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-xs transition-colors ${
                                  checked
                                    ? "border-[#068847] bg-[#068847]/5"
                                    : "border-[#E5E7EB] hover:border-[#068847]/30"
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                    checked
                                      ? "border-[#068847] bg-[#068847]"
                                      : "border-[#D1D5DB]"
                                  }`}
                                >
                                  {checked && (
                                    <svg
                                      className="w-2.5 h-2.5 text-white"
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="3"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </span>
                                <span className="text-[#4A5565] break-all">
                                  {perm.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#4A5565] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
