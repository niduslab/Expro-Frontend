"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BlogCategory, BlogCategoryPayload } from "@/lib/types/admin/blogType";
import { useCreateBlogCategory, useUpdateBlogCategory, useBlogCategories } from "@/lib/hooks/admin/useBlogCategory";
import { defaultForm, slugify } from "./blogCategoryModalShared";
import { CategoryDetailsSection, SettingsSection } from "./blogCategoryModalSections";

interface BlogCategoryModalProps {
  open: boolean;
  onClose: () => void;
  category?: BlogCategory | null;
}

export default function BlogCategoryModal({ open, onClose, category }: BlogCategoryModalProps) {
  const isEdit = !!category;
  const [formData, setFormData] = useState<BlogCategoryPayload>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: allCategoriesData } = useBlogCategories();
  const parentOptions = (allCategoriesData?.data ?? []).filter((c) => c.id !== category?.id);

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

  const set = (field: keyof BlogCategoryPayload, value: string | boolean | number | null) => {
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
    onSuccess: () => { toast.success("Category created successfully"); onClose(); },
    onError: () => toast.error("Failed to create category"),
  });

  const { mutate: update, isPending: updating } = useUpdateBlogCategory(category?.id ?? 0, {
    onSuccess: () => { toast.success("Category updated successfully"); onClose(); },
    onError: () => toast.error("Failed to update category"),
  });

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
              <button onClick={onClose} disabled={isPending}
                className="text-gray-500 hover:text-black disabled:opacity-40">✕</button>
            </div>
            <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
              {isEdit ? "Update the category information below." : "Fill in the details to create a new blog category."}
            </p>
          </div>

          <div className="w-full border border-[#E5E7EB]" />

          <CategoryDetailsSection
            formData={formData}
            errors={errors}
            onNameChange={handleNameChange}
            set={set}
          />

          <SettingsSection
            formData={formData}
            parentOptions={parentOptions}
            set={set}
          />

          {/* Actions */}
          <div className="flex ml-auto gap-[16px] w-fit pt-4 relative top-[48px]">
            <button onClick={onClose} disabled={isPending}
              className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] disabled:opacity-40">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={isPending}
              className="bg-[#068847] h-[48px] w-[180px] rounded-xl px-[16px] text-white flex items-center justify-center font-semibold text-[16px] disabled:opacity-60 gap-1">
              {isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /><span>Saving...</span></>
              ) : isEdit ? (
                <span>Save Changes</span>
              ) : (
                <><Plus className="h-5 w-5" /><span>Add Category</span></>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
