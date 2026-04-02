"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BlogCategory, BlogCategoryPayload } from "@/lib/types/admin/blogType";
import {
  useCreateBlogCategory,
  useUpdateBlogCategory,
} from "@/lib/hooks/admin/useBlogCategory";
import { useBlogCategories } from "@/lib/hooks/admin/useBlogCategory";

interface BlogCategoryModalProps {
  open: boolean;
  onClose: () => void;
  category?: BlogCategory | null;
}

const defaultForm: BlogCategoryPayload = {
  name: "",
  name_bangla: "",
  slug: "",
  description: "",
  parent_id: null,
  order: 0,
  is_active: true,
};

const inputClass =
  "w-full h-[48px] border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px]";

const textareaClass =
  "w-full border border-[#D1D5DC] rounded-[8px] px-[16px] py-[12px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px] resize-none";

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
        <span className="text-[#FB2C36] font-medium text-[16px]">*</span>
      )}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-sm text-red-500">{message}</span>;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export default function BlogCategoryModal({
  open,
  onClose,
  category,
}: BlogCategoryModalProps) {
  const isEdit = !!category;
  const [formData, setFormData] = useState<BlogCategoryPayload>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch all categories for parent dropdown (exclude self when editing)
  const { data: allCategoriesData } = useBlogCategories();
  const parentOptions = (allCategoriesData?.data ?? []).filter(
    (c) => c.id !== category?.id,
  );

  useEffect(() => {
    if (open && category) {
      setFormData({
        name: category.name,
        name_bangla: category.name_bangla ?? "",
        slug: category.slug,
        description: category.description ?? "",
        parent_id: category.parent_id ?? null,
        order: category.order,
        is_active: category.is_active,
      });
    } else if (open && !category) {
      setFormData(defaultForm);
    }
    setErrors({});
  }, [open, category]);

  const set = (
    field: keyof BlogCategoryPayload,
    value: string | boolean | number | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: isEdit ? prev.slug : slugify(value),
    }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return false;
    }
    return true;
  };

  const { mutate: create, isPending: creating } = useCreateBlogCategory({
    onSuccess: () => {
      toast.success("Category created successfully");
      onClose();
    },
    onError: () => toast.error("Failed to create category"),
  });

  const { mutate: update, isPending: updating } = useUpdateBlogCategory(
    category?.id ?? 0,
    {
      onSuccess: () => {
        toast.success("Category updated successfully");
        onClose();
      },
      onError: () => toast.error("Failed to update category"),
    },
  );

  const isPending = creating || updating;

  const handleSubmit = () => {
    if (!validate()) return;
    if (isEdit) update(formData);
    else create(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="flex flex-col w-full max-w-[600px] h-[85vh] p-2 md:p-6 bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black relative my-4">
        <div className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden p-2">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                {isEdit ? "Edit Category" : "Create New Category"}
              </p>
              <button
                onClick={onClose}
                disabled={isPending}
                className="text-gray-500 hover:text-black disabled:opacity-40"
              >
                ✕
              </button>
            </div>
            <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
              {isEdit
                ? "Update the category information below."
                : "Fill in the details to create a new blog category."}
            </p>
          </div>

          <div className="w-full border border-[#E5E7EB]" />

          {/* Section 1: Category Details */}
          <div className="flex flex-col relative top-[24px] gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Category Details
            </p>

            {/* Name + Bangla Name */}
            <div className="flex gap-2 w-full">
              <div className="w-1/2">
                <FieldLabel label="Category Name" required />
                <input
                  className={inputClass}
                  placeholder="e.g. Technology"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
                <FieldError message={errors.name} />
              </div>
              <div className="w-1/2">
                <FieldLabel label="Name (Bangla)" />
                <input
                  className={inputClass}
                  placeholder="e.g. প্রযুক্তি"
                  value={String(formData.name_bangla ?? "")}
                  onChange={(e) => set("name_bangla", e.target.value)}
                />
              </div>
            </div>

            {/* Slug */}
            <div>
              <FieldLabel label="Slug" required />
              <input
                className={inputClass}
                placeholder="e.g. technology"
                value={formData.slug}
                onChange={(e) => set("slug", slugify(e.target.value))}
              />
              <FieldError message={errors.slug} />
            </div>

            {/* Description */}
            <div>
              <FieldLabel label="Description" />
              <textarea
                className={textareaClass}
                rows={2}
                placeholder="Brief description of this category..."
                value={String(formData.description ?? "")}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>

            <div className="w-full border border-[#E5E7EB]" />
          </div>

          {/* Section 2: Settings */}
          <div className="flex flex-col relative top-[48px] gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Settings
            </p>

            {/* Parent + Order */}
            <div className="flex gap-2 w-full">
              <div className="w-2/3">
                <FieldLabel label="Parent Category" />
                <select
                  className={inputClass}
                  value={formData.parent_id ?? ""}
                  onChange={(e) =>
                    set(
                      "parent_id",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                >
                  <option value="">None (Top Level)</option>
                  {parentOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/3">
                <FieldLabel label="Order" />
                <input
                  type="number"
                  className={inputClass}
                  placeholder="0"
                  value={formData.order ?? 0}
                  onChange={(e) => set("order", Number(e.target.value))}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <FieldLabel label="Status" />
              <div className="flex items-center gap-3 h-[48px]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={Boolean(formData.is_active)}
                    onChange={(e) => set("is_active", e.target.checked)}
                  />
                  <div className="w-10 h-5 bg-[#D1D5DC] rounded-full peer peer-checked:bg-[#068847] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
                <span className="text-[14px] text-[#4A5565]">
                  {formData.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex ml-auto gap-[16px] w-fit pt-4">
              <button
                onClick={onClose}
                disabled={isPending}
                className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-[#068847] h-[48px] w-[180px] rounded-xl px-[16px] text-white flex items-center justify-center font-semibold text-[16px] disabled:opacity-60 gap-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : isEdit ? (
                  <span>Save Changes</span>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Add Category</span>
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
