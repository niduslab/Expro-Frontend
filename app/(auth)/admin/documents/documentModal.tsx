"use client";

import { useEffect, useState } from "react";
import {
  Document,
  DocumentStorePayload,
  DocumentUpdatePayload,
  DocumentType,
  DocumentStatus,
} from "@/lib/types/admin/documentType";
import { SaveResult } from "@/lib/hooks/admin/useDocumentsHook";
import { Plus, Loader2, Upload, X, FileText } from "lucide-react";
import DatePicker from "@/components/ui/date-picker";

interface DocumentModalProps {
  open: boolean;
  onClose: () => void;
  document?: Document | null;
  /**
   * Owned by page.tsx so the shared hook's refetch fires.
   * Returns SaveResult — on failure, fieldErrors are mapped
   * into inline red messages under each form field.
   */
  onSave: (
    payload: DocumentStorePayload | DocumentUpdatePayload,
    isEdit: boolean,
    id?: number,
  ) => Promise<SaveResult>;
  isSaving?: boolean;
}

const DOCUMENT_TYPES: { label: string; value: DocumentType }[] = [
  { label: "Profile", value: "profile" },
  { label: "Awards", value: "awards" },
  { label: "Annual Reports", value: "annual_reports" },
  { label: "Rules", value: "rules" },
  { label: "Organogram", value: "organogram" },
  { label: "Magazine", value: "magazine" },
  { label: "Calendar", value: "calendar" },
  { label: "Notice", value: "notice" },
  { label: "Other", value: "other" },
];

const DOCUMENT_STATUSES: { label: string; value: DocumentStatus }[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived" },
];

const defaultForm = {
  name: "",
  description: "",
  type: "other" as DocumentType,
  file: undefined as File | undefined,
  publish_date: "",
  is_featured: false,
  display_order: 0,
  status: "active" as DocumentStatus,
};

const inputClass =
  "w-full h-[48px] border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px]";

const inputErrorClass =
  "w-full h-[48px] border border-red-400 rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-red-300 text-[#6A7282] text-[14px]";

const textareaClass =
  "w-full border border-[#D1D5DC] rounded-[8px] px-[16px] py-[12px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px] resize-none";

const selectClass =
  "w-full h-[48px] border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px] appearance-none cursor-pointer";

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
  return (
    <span className="block mt-1 text-sm text-red-500 font-medium">
      {message}
    </span>
  );
}

export default function DocumentModal({
  open,
  onClose,
  document,
  onSave,
  isSaving = false,
}: DocumentModalProps) {
  const isEdit = !!document;
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (open && document) {
      setFormData({
        name: document.name,
        description: document.description ?? "",
        type: document.type,
        file: undefined,
        publish_date: document.publish_date ?? "",
        is_featured: document.is_featured,
        display_order: document.display_order,
        status: document.status,
      });
    } else if (open && !document) {
      setFormData(defaultForm);
    }
    setErrors({});
  }, [open, document]);

  const set = <K extends keyof typeof defaultForm>(
    field: K,
    value: (typeof defaultForm)[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear inline error as user corrects the field
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ── Client-side validation (runs before hitting the network) ───────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Document name is required";
    if (!formData.type) newErrors.type = "Document type is required";
    if (!isEdit && !formData.file) newErrors.file = "A file is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = isEdit
      ? ({
          name: formData.name,
          description: formData.description || undefined,
          type: formData.type,
          file: formData.file,
          publish_date: formData.publish_date || undefined,
          is_featured: formData.is_featured,
          display_order: formData.display_order,
          status: formData.status,
        } as DocumentUpdatePayload)
      : ({
          name: formData.name,
          description: formData.description || undefined,
          type: formData.type,
          file: formData.file!,
          publish_date: formData.publish_date || undefined,
          is_featured: formData.is_featured,
          display_order: formData.display_order,
          status: formData.status,
        } as DocumentStorePayload);

    const result = await onSave(payload, isEdit, document?.id);

    if (result.ok) {
      onClose();
      return;
    }

    // ── Map backend field errors → inline messages ─────────────────────────

    if (result.fieldErrors && typeof result.fieldErrors === "object") {
      const mapped: Record<string, string> = {};
      for (const [field, msgs] of Object.entries(result.fieldErrors)) {
        if (Array.isArray(msgs) && msgs.length > 0) {
          mapped[field] = msgs[0];
        }
      }
      setErrors(mapped);
    }
    // Toast is already fired by page.tsx handleSave — no duplicate here.
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) set("file", file);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="flex flex-col w-full max-w-[600px] h-[85vh] p-2 md:p-6 bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black relative my-4">
        <div className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden p-2">
          {/* ── Header ── */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                {isEdit ? "Edit Document" : "Upload New Document"}
              </p>
              <button
                onClick={onClose}
                disabled={isSaving}
                className="text-gray-500 hover:text-black disabled:opacity-40"
              >
                ✕
              </button>
            </div>
            <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
              {isEdit
                ? "Update the document information below."
                : "Fill in the details and upload a file."}
            </p>
          </div>

          <div className="w-full border border-[#E5E7EB]" />

          {/* ── Section 1: Document Info ── */}
          <div className="flex flex-col gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Document Info
            </p>

            {/* Name */}
            <div>
              <FieldLabel label="Document Name" required />
              <input
                type="text"
                className={errors.name ? inputErrorClass : inputClass}
                placeholder="e.g. Annual Report 2024"
                value={formData.name}
                onChange={(e) => set("name", e.target.value)}
              />
              <FieldError message={errors.name} />
            </div>

            {/* Type + Status */}
            <div className="flex gap-2 w-full">
              <div className="w-1/2">
                <FieldLabel label="Document Type" required />
                <div className="relative">
                  <select
                    className={selectClass}
                    value={formData.type}
                    onChange={(e) =>
                      set("type", e.target.value as DocumentType)
                    }
                  >
                    {DOCUMENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6A7282]">
                    ▾
                  </div>
                </div>
                <FieldError message={errors.type} />
              </div>
              <div className="w-1/2">
                <FieldLabel label="Status" />
                <div className="relative">
                  <select
                    className={selectClass}
                    value={formData.status}
                    onChange={(e) =>
                      set("status", e.target.value as DocumentStatus)
                    }
                  >
                    {DOCUMENT_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6A7282]">
                    ▾
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <FieldLabel label="Description" />
              <textarea
                className={textareaClass}
                rows={2}
                placeholder="Brief description of this document..."
                value={formData.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>

            <div className="w-full border border-[#E5E7EB]" />
          </div>

          {/* ── Section 2: File Upload ── */}
          <div className="flex flex-col relative top-[48px] gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              File Upload
            </p>

            {/* Drop zone — red border when there's a file error */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-6 transition-colors cursor-pointer ${
                errors.file
                  ? "border-red-400 bg-red-50"
                  : dragOver
                    ? "border-[#068847] bg-[#DCFCE7]/30"
                    : "border-[#D1D5DC] bg-[#F9FAFB] hover:border-[#068847] hover:bg-[#DCFCE7]/10"
              }`}
              onClick={() =>
                globalThis.document.getElementById("doc-file-input")?.click()
              }
            >
              <input
                id="doc-file-input"
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) set("file", file);
                }}
              />
              {formData.file ? (
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#068847]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#030712] truncate">
                      {formData.file.name}
                    </p>
                    <p className="text-[12px] text-[#6A7282]">
                      {(formData.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      set("file", undefined as unknown as File);
                    }}
                    className="p-1 rounded-lg hover:bg-[#FEE2E2] text-[#6A7282] hover:text-[#DC2626] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${errors.file ? "bg-red-100" : "bg-[#E5E7EB]"}`}
                  >
                    <Upload
                      className={`w-5 h-5 ${errors.file ? "text-red-400" : "text-[#6A7282]"}`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] font-medium text-[#030712]">
                      Drop file here or{" "}
                      <span
                        className={
                          errors.file ? "text-red-500" : "text-[#068847]"
                        }
                      >
                        browse
                      </span>
                    </p>
                    <p className="text-[12px] text-[#6A7282] mt-1">
                      PDF, DOC, DOCX, XLS, XLSX, PNG, JPG (max 20MB)
                    </p>
                  </div>
                </>
              )}
              {isEdit && !formData.file && (
                <p className="text-[12px] text-[#6A7282]">
                  Leave empty to keep the existing file
                </p>
              )}
            </div>

            {/* Inline file error — shows both client and backend messages */}
            <FieldError message={errors.file} />

            <div className="w-full border border-[#E5E7EB]" />
          </div>

          {/* ── Section 3: Meta ── */}
          <div className="flex flex-col relative top-[86px] gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Metadata
            </p>

            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="md:w-1/2">
                <FieldLabel label="Publish Date" />
                <DatePicker
                  value={formData.publish_date}
                  onChange={(value) => set("publish_date", value)}
                />

                <FieldError message={errors.publish_date} />
              </div>
              <div className="md:w-1/2">
                <FieldLabel label="Display Order" />
                <input
                  type="number"
                  className={inputClass}
                  placeholder="e.g. 1"
                  value={formData.display_order}
                  onChange={(e) => set("display_order", Number(e.target.value))}
                />
              </div>
            </div>

            {/* Featured toggle */}
            <div>
              <FieldLabel label="Featured" />
              <div className="flex items-center gap-3 h-[48px]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.is_featured}
                    onChange={(e) => set("is_featured", e.target.checked)}
                  />
                  <div className="w-10 h-5 bg-[#D1D5DC] rounded-full peer peer-checked:bg-[#068847] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
                <span className="text-[14px] text-[#4A5565]">
                  {formData.is_featured ? "Featured" : "Not Featured"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex ml-auto gap-[16px] w-fit">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] leading-[150%] tracking-[-0.01em] disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="bg-[#068847] h-[48px] whitespace-nowrap w-[180px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em] disabled:opacity-60 gap-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : isEdit ? (
                  <span>Save Changes</span>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Upload Document</span>
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
