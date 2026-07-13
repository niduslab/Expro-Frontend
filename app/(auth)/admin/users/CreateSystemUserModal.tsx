"use client";

import { useState } from "react";
import { useCreateSystemUser } from "@/lib/hooks/admin/useUsers";
import { Role } from "@/lib/types/admin/roleType";
import { toast } from "sonner";
import { Loader2, X, UserPlus, Eye, EyeOff, ShieldCheck } from "lucide-react";

interface CreateSystemUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableRoles: Role[];
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  roles: string[];
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",
  roles: [],
};

export default function CreateSystemUserModal({
  isOpen,
  onClose,
  availableRoles,
}: CreateSystemUserModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const createMutation = useCreateSystemUser();

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setFormError("");
  };

  const toggleRole = (roleName: string) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleName)
        ? prev.roles.filter((r) => r !== roleName)
        : [...prev.roles, roleName],
    }));
    setErrors((prev) => ({ ...prev, roles: "" }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};

    if (!form.name.trim()) next.name = "Full name is required";
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address";
    }
    if (form.phone && !/^[0-9+\-\s]{6,20}$/.test(form.phone)) {
      next.phone = "Enter a valid phone number";
    }
    if (!form.password) {
      next.password = "Password is required";
    } else if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }
    if (form.password !== form.password_confirmation) {
      next.password_confirmation = "Passwords do not match";
    }
    if (form.roles.length === 0) {
      next.roles = "Select at least one role";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const close = () => {
    if (createMutation.isPending) return;
    setForm(EMPTY_FORM);
    setErrors({});
    setFormError("");
    setShowPassword(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    try {
      const res = await createMutation.mutateAsync({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
        password_confirmation: form.password_confirmation,
        roles: form.roles,
      });

      toast.success(res.message || "System user created successfully");
      // Only reset + close on success.
      setForm(EMPTY_FORM);
      setErrors({});
      onClose();
    } catch (error: any) {
      // Keep the modal open and surface Laravel validation errors inline.
      const data = error?.response?.data;
      const apiErrors = data?.errors as Record<string, string[]> | undefined;
      if (apiErrors) {
        const mapped: Record<string, string> = {};
        Object.entries(apiErrors).forEach(([key, msgs]) => {
          mapped[key] = msgs?.[0] ?? "Invalid value";
        });
        setErrors(mapped);
      }
      const message =
        data?.message ||
        (apiErrors ? "Please fix the highlighted fields." : null) ||
        "Failed to create system user";
      setFormError(message);
      toast.error(message);
    }
  };

  if (!isOpen) return null;

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] ${
      errors[field] ? "border-red-400" : "border-[#E5E7EB]"
    }`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#068847]/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#068847]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#030712]">
                Add System User
              </h2>
              <p className="text-sm text-[#6B7280] mt-0.5">
                Create an admin / staff account and assign roles
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            disabled={createMutation.isPending}
            type="button"
          >
            <X className="w-5 h-5 text-[#4A5565]" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto"
        >
          {formError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. John Doe"
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
                placeholder="name@example.com"
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#030712] mb-1.5">
                Phone <span className="text-[#9CA3AF]">(optional)</span>
              </label>
              <input
                type="text"
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
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  className={`${inputClass("password")} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#6B7280] hover:text-[#030712]"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#030712] mb-1.5">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={form.password_confirmation}
                onChange={(e) =>
                  setField("password_confirmation", e.target.value)
                }
                placeholder="Re-enter password"
                className={inputClass("password_confirmation")}
              />
              {errors.password_confirmation && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password_confirmation}
                </p>
              )}
            </div>
          </div>

          {/* Roles */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#068847]" />
              <label className="block text-sm font-medium text-[#030712]">
                Roles <span className="text-red-500">*</span>
              </label>
            </div>
            {availableRoles.length === 0 ? (
              <p className="text-sm text-[#6B7280]">No roles available.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableRoles.map((role) => {
                  const selected = form.roles.includes(role.name);
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => toggleRole(role.name)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm font-medium uppercase transition-all text-left ${
                        selected
                          ? "border-[#068847] bg-[#068847]/5 text-[#068847]"
                          : "border-[#E5E7EB] text-[#4A5565] hover:border-[#068847]/30"
                      }`}
                    >
                      {role.name}
                    </button>
                  );
                })}
              </div>
            )}
            {errors.roles && (
              <p className="text-xs text-red-500 mt-1">{errors.roles}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={close}
              disabled={createMutation.isPending}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#4A5565] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {createMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
