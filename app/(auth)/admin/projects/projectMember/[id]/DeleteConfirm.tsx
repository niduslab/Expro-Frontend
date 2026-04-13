"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteProjectMember } from "@/lib/hooks/admin/UseProjectMemberHook";
import type { ProjectMember } from "@/lib/types/admin/projectMemberType";

// ─── Props ────────────────────────────────────────────────────────────────────

interface DeleteConfirmProps {
  member: ProjectMember;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DeleteConfirm({ member, onClose }: DeleteConfirmProps) {
  const { mutate, isPending } = useDeleteProjectMember();

  return (
    <>
      <div className="px-6 py-6 flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <p className="font-medium text-slate-800">Remove member?</p>
          <p className="text-sm text-slate-500 mt-1">
            <span className="font-medium text-slate-700">
              {member.user?.name ?? `User #${member.user_id}`}
            </span>{" "}
            will be removed from this project. This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => mutate(member.id, { onSuccess: onClose })}
          disabled={isPending}
          className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 transition flex items-center gap-2"
        >
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Remove
        </button>
      </div>
    </>
  );
}
