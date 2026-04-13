"use client";

// components/projectMember/MemberForm.tsx

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  useCreateProjectMember,
  useUpdateProjectMember,
} from "@/lib/hooks/admin/UseProjectMemberHook";
import type {
  ProjectMember,
  ProjectMemberRole,
  ProjectMemberStatus,
  CreateProjectMemberPayload,
} from "@/lib/types/admin/projectMemberType";
import { EMPTY_FORM, ROLE_OPTIONS, STATUS_OPTIONS } from "./constent";
import { Field, CustomSelect, UserCombobox } from "./Projectmemberui";
import DatePicker from "@/components/ui/date-picker";

// ─── Props ────────────────────────────────────────────────────────────────────

interface MemberFormProps {
  projectId: number;
  initial?: ProjectMember;
  onClose: () => void;
  assignedUserIds?: number[];
}

// ─── Backend error shape ──────────────────────────────────────────────────────

interface BackendError {
  message?: string;
  errors?: Record<string, string[]>;
}

// ─── Known form fields for inline error mapping ───────────────────────────────

const KNOWN_FIELDS: (keyof CreateProjectMemberPayload)[] = [
  "user_id",
  "project_role",
  "status",
  "joining_date",
  "expiry_date",
  "joining_fee_paid",
  "hierarchy_level",
  "max_downline_members",
  "current_downline_count",
  "notes",
  "payment_id",
  "parent_member_id",
];

// ─── Component ────────────────────────────────────────────────────────────────

export function MemberForm({
  projectId,
  initial,
  onClose,
  assignedUserIds,
}: MemberFormProps) {
  const isEdit = !!initial;
  const createMutation = useCreateProjectMember();
  const updateMutation = useUpdateProjectMember();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const [form, setForm] = useState<CreateProjectMemberPayload>(() =>
    initial
      ? {
          project_id: initial.project_id,
          user_id: initial.user_id,
          project_role: initial.project_role,
          parent_member_id: initial.parent_member_id,
          hierarchy_level: initial.hierarchy_level,
          joining_fee_paid: parseFloat(initial.joining_fee_paid),
          joining_date: initial.joining_date ?? "",
          expiry_date: initial.expiry_date ?? null,
          status: initial.status,
          payment_id: initial.payment_id,
          max_downline_members: initial.max_downline_members,
          current_downline_count: initial.current_downline_count,
          notes: initial.notes,
        }
      : { ...EMPTY_FORM, project_id: projectId },
  );

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const set = <K extends keyof CreateProjectMemberPayload>(
    key: K,
    val: CreateProjectMemberPayload[K],
  ) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // ── Client-side validation ────────────────────────────────────────────────

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.user_id) e.user_id = "Please select a user.";
    if (!form.project_role) e.project_role = "Role is required.";
    if (!form.joining_date) e.joining_date = "Joining date is required.";
    if (!form.status) e.status = "Status is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Backend error handler ─────────────────────────────────────────────────

  const handleBackendError = (error: unknown) => {
    const responseData = (error as any)?.response?.data as
      | BackendError
      | undefined;

    if (!responseData) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    const fieldErrors: Record<string, string> = {};

    if (responseData.errors) {
      for (const [field, messages] of Object.entries(responseData.errors)) {
        const first = messages[0];
        if (KNOWN_FIELDS.includes(field as keyof CreateProjectMemberPayload)) {
          // Show inline under the field
          fieldErrors[field] = first;
        } else {
          // Unknown field — toast only
          toast.error(first);
        }
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      // Summary toast so the user knows to check the form
      toast.error(responseData.message ?? "Please fix the errors below.");
    } else if (responseData.message) {
      toast.error(responseData.message);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEdit) {
      updateMutation.mutate(
        { id: initial!.id, payload: form },
        {
          onSuccess: () => {
            toast.success("Member updated successfully.");
            onClose();
          },
          onError: handleBackendError,
        },
      );
    } else {
      createMutation.mutate(form, {
        onSuccess: () => {
          toast.success("Member assigned successfully.");
          onClose();
        },
        onError: handleBackendError,
      });
    }
  };

  return (
    <>
      <div className="px-6 py-5 grid grid-cols-2 gap-4">
        {/* User */}
        <div className="col-span-2">
          <Field label="User" required error={errors.user_id}>
            <UserCombobox
              value={form.user_id || null}
              onChange={(id) => set("user_id", id)}
              error={!!errors.user_id}
              assignedUserIds={assignedUserIds ?? []}
            />
          </Field>
        </div>

        {/* Role */}
        <div className="col-span-2">
          <Field label="Role" required error={errors.project_role}>
            <CustomSelect
              value={form.project_role}
              onChange={(v) => set("project_role", v as ProjectMemberRole)}
              options={ROLE_OPTIONS}
              error={!!errors.project_role}
            />
          </Field>
        </div>

        {/* Status */}
        <div className="col-span-2">
          <Field label="Status" required error={errors.status}>
            <CustomSelect
              value={form.status}
              onChange={(v) => set("status", v as ProjectMemberStatus)}
              options={STATUS_OPTIONS}
              error={!!errors.status}
            />
          </Field>
        </div>

        {/* Joining Date */}
        <div className="col-span-1">
          <DatePicker
            label="Joining Date"
            required
            value={form.joining_date}
            onChange={(val) => set("joining_date", val)}
          />
          {errors.joining_date && (
            <p className="mt-1 text-xs text-red-500">{errors.joining_date}</p>
          )}
        </div>

        {/* Expiry Date */}
        <div className="col-span-1">
          <DatePicker
            label="Expiry Date"
            value={form.expiry_date ?? ""}
            onChange={(val) => set("expiry_date", val || null)}
          />
          {errors.expiry_date && (
            <p className="mt-1 text-xs text-red-500">{errors.expiry_date}</p>
          )}
        </div>

        {/* Joining Fee */}
        <Field label="Joining Fee (BDT)" error={errors.joining_fee_paid}>
          <input
            type="number"
            min={0}
            value={form.joining_fee_paid}
            onChange={(e) =>
              set("joining_fee_paid", parseFloat(e.target.value) || 0)
            }
            className={`h-[42px] border rounded-lg px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 transition ${
              errors.joining_fee_paid
                ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            }`}
          />
        </Field>

        {/* Hierarchy Level */}
        <Field label="Hierarchy Level" error={errors.hierarchy_level}>
          <input
            type="number"
            min={0}
            max={5}
            value={form.hierarchy_level}
            onChange={(e) =>
              set("hierarchy_level", parseInt(e.target.value) || 0)
            }
            className={`h-[42px] border rounded-lg px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 transition ${
              errors.hierarchy_level
                ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            }`}
          />
        </Field>

        {/* Max Downline */}
        <Field label="Max Downline" error={errors.max_downline_members}>
          <input
            type="number"
            min={0}
            value={form.max_downline_members ?? ""}
            onChange={(e) =>
              set(
                "max_downline_members",
                e.target.value ? parseInt(e.target.value) : null,
              )
            }
            placeholder="Unlimited"
            className={`h-[42px] border rounded-lg px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition ${
              errors.max_downline_members
                ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            }`}
          />
        </Field>

        {/* Current Downline */}
        <Field label="Current Downline" error={errors.current_downline_count}>
          <input
            type="number"
            min={0}
            value={form.current_downline_count}
            onChange={(e) =>
              set("current_downline_count", parseInt(e.target.value) || 0)
            }
            className={`h-[42px] border rounded-lg px-3 text-sm text-slate-800 focus:outline-none focus:ring-1 transition ${
              errors.current_downline_count
                ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            }`}
          />
        </Field>

        {/* Notes */}
        <div className="col-span-2">
          <Field label="Notes" error={errors.notes}>
            <textarea
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value || null)}
              rows={2}
              placeholder="Optional notes..."
              className={`border rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 resize-none w-full transition ${
                errors.notes
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              }`}
            />
          </Field>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition flex items-center gap-2"
        >
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isEdit ? "Save Changes" : "Assign Member"}
        </button>
      </div>
    </>
  );
}
