"use client";

import { useState } from "react";
import {
  usePermissions,
  useCreatePermission,
  useDeletePermission,
} from "@/lib/hooks/admin/useUsers";
import { toast } from "sonner";
import { Loader2, X, KeyRound, Plus, Trash2 } from "lucide-react";

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PermissionsModal({
  isOpen,
  onClose,
}: PermissionsModalProps) {
  const [newName, setNewName] = useState("");
  const { data: permissions, isLoading } = usePermissions();
  const createMutation = useCreatePermission();
  const deleteMutation = useDeletePermission();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;

    try {
      await createMutation.mutateAsync({ name });
      toast.success("Permission created");
      setNewName("");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.errors?.name?.[0] ||
          err?.response?.data?.message ||
          "Failed to create permission",
      );
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete permission "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Permission deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete permission");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#068847]/10 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-[#068847]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#030712]">
                Manage Permissions
              </h2>
              <p className="text-sm text-[#6B7280] mt-0.5">
                Create or remove permissions used across roles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-[#4A5565]" />
          </button>
        </div>

        {/* Create */}
        <form
          onSubmit={handleCreate}
          className="p-6 border-b border-[#E5E7EB] flex items-end gap-3"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#030712] mb-1.5">
              New permission name
            </label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. access_reports"
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847]"
            />
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending || !newName.trim()}
            className="px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add
          </button>
        </form>

        {/* List */}
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#068847]" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(permissions ?? []).map((perm) => (
                <span
                  key={perm.id}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-[#F3F4F6] text-[#4A5565] rounded-lg"
                >
                  {perm.name}
                  <button
                    type="button"
                    onClick={() => handleDelete(perm.id, perm.name)}
                    disabled={deletingId === perm.id}
                    className="text-[#9CA3AF] hover:text-red-500 transition-colors"
                    title="Delete permission"
                  >
                    {deletingId === perm.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </button>
                </span>
              ))}
              {permissions?.length === 0 && (
                <p className="text-sm text-[#6B7280]">No permissions yet.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#4A5565] hover:bg-[#F3F4F6] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
