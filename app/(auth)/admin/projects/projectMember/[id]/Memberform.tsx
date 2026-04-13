"use client";

// components/projectMember/MemberForm.tsx
// Used inside the Assign and Edit modals.

import { useState } from "react";
import { Loader2 } from "lucide-react";

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

// ─── Props ────────────────────────────────────────────────────────────────────

interface MemberFormProps {
  projectId: number;
  /** Pass to switch the form into edit mode */
  initial?: ProjectMember;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MemberForm({ projectId, initial, onClose }: MemberFormProps) {
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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.user_id) e.user_id = "Please select a user.";
    if (!form.project_role) e.project_role = "Role is required.";
    if (!form.joining_date) e.joining_date = "Joining date is required.";
    if (!form.status) e.status = "Status is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (isEdit) {
      updateMutation.mutate(
        { id: initial!.id, payload: form },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(form, { onSuccess: onClose });
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
        <Field label="Joining Date" required error={errors.joining_date}>
          <input
            type="date"
            value={form.joining_date}
            onChange={(e) => set("joining_date", e.target.value)}
            className="h-[42px] border border-slate-200 rounded-lg px-3 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </Field>

        {/* Expiry Date */}
        <Field label="Expiry Date">
          <input
            type="date"
            value={form.expiry_date ?? ""}
            onChange={(e) => set("expiry_date", e.target.value || null)}
            className="h-[42px] border border-slate-200 rounded-lg px-3 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </Field>

        {/* Joining Fee */}
        <Field label="Joining Fee (BDT)">
          <input
            type="number"
            min={0}
            value={form.joining_fee_paid}
            onChange={(e) =>
              set("joining_fee_paid", parseFloat(e.target.value) || 0)
            }
            className="h-[42px] border border-slate-200 rounded-lg px-3 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </Field>

        {/* Hierarchy Level */}
        <Field label="Hierarchy Level">
          <input
            type="number"
            min={0}
            max={5}
            value={form.hierarchy_level}
            onChange={(e) =>
              set("hierarchy_level", parseInt(e.target.value) || 0)
            }
            className="h-[42px] border border-slate-200 rounded-lg px-3 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </Field>

        {/* Max Downline */}
        <Field label="Max Downline">
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
            className="h-[42px] border border-slate-200 rounded-lg px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </Field>

        {/* Current Downline */}
        <Field label="Current Downline">
          <input
            type="number"
            min={0}
            value={form.current_downline_count}
            onChange={(e) =>
              set("current_downline_count", parseInt(e.target.value) || 0)
            }
            className="h-[42px] border border-slate-200 rounded-lg px-3 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </Field>

        {/* Notes */}
        <div className="col-span-2">
          <Field label="Notes">
            <textarea
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value || null)}
              rows={2}
              placeholder="Optional notes..."
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none w-full"
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
