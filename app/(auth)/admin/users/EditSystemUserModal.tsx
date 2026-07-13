"use client";

import { useEffect, useState } from "react";
import { useUpdateSystemUser } from "@/lib/hooks/admin/useUsers";
import { SystemUser } from "@/lib/types/admin/userType";
import { toast } from "sonner";
import { Loader2, X, Pencil } from "lucide-react";

interface EditSystemUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SystemUser | null;
}

const STATUS_OPTIONS = ["active", "inactive", "suspended", "pending"];

export default function EditSystemUserModal({
  isOpen,
  onClose,
  user,
}: EditSystemUserModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const updateMutation = useUpdateSystemUser();

  useEffect(() => {
    if (user && isOpen) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        status: user.status ?? "active",
      });
      setErrors({});
      setFormError("");
    }
  }, [user, isOpen]);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFormError("");

    if (!form.name.trim()) {
      setErrors({ name: "Name is required" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors({ email: "Enter a valid email" });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: user.id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        status: form.status,
      });
      toast.success("User updated successfully");
      onClose();
    } catch (err: any) {
      // Keep modal open; show backend validation errors inline.
      const data = err?.response?.data;
      const apiErrors = data?.errors as Record<string, string[]> | undefined;
      if (apiErrors) {
        const mapped: Record<string, string> = {};
        Object.entries(apiErrors).forEach(([k, v]) => (mapped[k] = v?.[0] ?? ""));
        setErrors(mapped);
      }
      const message =
        data?.message ||
        (apiErrors ? "Please fix the highlighted fields." : null) ||
        "Failed to update user";
      setFormError(message);
      toast.error(message);
    }
  };

  if (!isOpen || !user) return null;

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] ${
      errors[field] ? "border-red-400" : "border-[#E5E7EB]"
    }`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#068847]/10 flex items-center justify-center">
              <Pencil className="w-5 h-5 text-[#068847]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#030712]">Edit User</h2>
              <p className="text-sm text-[#6B7280] mt-0.5">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-[#4A5565]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#030712] mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className={inputClass("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#030712] mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className={inputClass("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-1.5">
                Phone
              </label>
              <input
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="01XXXXXXXXX"
                className={inputClass("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-1.5">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
                className={inputClass("status") + " capitalize"}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#4A5565] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {updateMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
