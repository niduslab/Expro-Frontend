"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Gallery, CreateGalleryPayload } from "@/lib/types/admin/galleryType";
import {
  useCreateGallery,
  useUpdateGallery,
} from "@/lib/hooks/admin/useGalleryHook";
import { defaultGalleryForm, slugify } from "./galleryModalShared";
import {
  GalleryDetailsSection,
  GallerySettingsSection,
} from "./galleryModalSections";

interface GalleryModalProps {
  open: boolean;
  onClose: () => void;
  gallery?: Gallery | null;
}

export default function GalleryModal({
  open,
  onClose,
  gallery,
}: GalleryModalProps) {
  const isEdit = !!gallery;
  const [formData, setFormData] =
    useState<CreateGalleryPayload>(defaultGalleryForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && gallery) {
      setFormData({
        title: gallery.title,
        slug: gallery.slug,
        description: gallery.description ?? "",
        cover_image: null,
        is_featured: gallery.is_featured,
        status: gallery.status,
      });
    } else if (open && !gallery) {
      setFormData(defaultGalleryForm);
    }
    setErrors({});
  }, [open, gallery]);

  const set = (field: keyof CreateGalleryPayload, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: isEdit ? prev.slug : slugify(value),
    }));
    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.slug?.trim()) newErrors.slug = "Slug is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return false;
    }
    return true;
  };

  const { mutate: create, isPending: creating } = useCreateGallery({
    onSuccess: () => {
      toast.success("Gallery created successfully");
      onClose();
    },
    onError: () => toast.error("Failed to create gallery"),
  });

  // ✅ Pass gallery id as first arg to the hook
  const { mutate: update, isPending: updating } = useUpdateGallery(
    gallery?.id ?? 0,
    {
      onSuccess: () => {
        toast.success("Gallery updated successfully");
        onClose();
      },
      onError: () => toast.error("Failed to update gallery"),
    },
  );

  const isPending = creating || updating;

  // ✅ Single clean handleSubmit — just pass formData, no { id, payload }
  const handleSubmit = () => {
    if (!validate()) return;
    if (isEdit) {
      update(formData);
    } else {
      create(formData);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="flex flex-col w-full max-w-3xl h-[90vh] p-2 md:p-6 bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black relative my-4">
        <div className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden p-2">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                {isEdit ? "Edit Gallery" : "Create New Gallery"}
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
                ? "Update the gallery details below."
                : "Fill in the details to create a new gallery."}
            </p>
          </div>

          <div className="w-full border border-[#E5E7EB]" />

          <GalleryDetailsSection
            formData={formData}
            errors={errors}
            onTitleChange={handleTitleChange}
            set={set}
            existingCoverUrl={gallery?.cover_image ?? null}
          />

          <GallerySettingsSection formData={formData} set={set} />

          {/* Actions */}
          <div className="flex ml-auto gap-[16px] w-fit pt-4 relative top-[72px]">
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
                  <span>Create Gallery</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
