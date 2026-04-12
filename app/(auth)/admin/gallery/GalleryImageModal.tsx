"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  GalleryImage,
  CreateGalleryImagePayload,
  UpdateGalleryImagePayload,
} from "@/lib/types/admin/galleryType";
import {
  useCreateGalleryImage,
  useUpdateGalleryImage,
} from "@/lib/hooks/admin/useGalleryHook";
import {
  FieldLabel,
  FieldError,
  Divider,
  inputClass,
  textareaClass,
} from "./galleryModalShared";

interface GalleryImageModalProps {
  open: boolean;
  onClose: () => void;
  galleryId: number;
  image?: GalleryImage | null;
}

const defaultForm: CreateGalleryImagePayload = {
  image: undefined as unknown as File,
  title: "",
  description: "",
  display_order: 0,
};

export default function GalleryImageModal({
  open,
  onClose,
  galleryId,
  image,
}: GalleryImageModalProps) {
  const isEdit = !!image;

  // Use key to force re-render of form when switching between add/edit or different images
  const [formKey, setFormKey] = useState(0);

  const [formData, setFormData] =
    useState<Partial<CreateGalleryImagePayload>>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (image) {
        setFormData({
          image: undefined as unknown as File,
          title: image.title ?? "",
          description: image.description ?? "",
          display_order: image.display_order,
        });
      } else {
        setFormData(defaultForm);
      }
      setErrors({});
      setFormKey((prev) => prev + 1); // Reset form state visually
    }
  }, [open, image]);

  const set = (field: keyof CreateGalleryImagePayload, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!isEdit && !formData.image) newErrors.image = "Image file is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return false;
    }
    return true;
  };

  // ✅ CREATE HOOK: Only needs galleryId
  const { mutate: create, isPending: creating } = useCreateGalleryImage(
    galleryId,
    {
      onSuccess: () => {
        toast.success("Image added to gallery");
        onClose();
      },
      onError: () => toast.error("Failed to add image"),
    },
  );

  // ✅ UPDATE HOOK: Needs galleryId AND image.id
  // We use image?.id || 0 because the hook requires a number,
  // but we only call this mutation when isEdit is true (so image exists).
  const { mutate: update, isPending: updating } = useUpdateGalleryImage(
    galleryId,
    image?.id || 0,
    {
      onSuccess: () => {
        toast.success("Image updated successfully");
        onClose();
      },
      onError: () => toast.error("Failed to update image"),
    },
  );

  const isPending = creating || updating;

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEdit) {
      // ✅ CORRECT CALL: Pass ONLY the payload object
      update({
        image: formData.image ?? undefined,
        title: formData.title,
        description: formData.description,
        display_order: formData.display_order,
      } as UpdateGalleryImagePayload);
    } else {
      // Create expects the full payload including the file
      create(formData as CreateGalleryImagePayload);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="flex flex-col w-full max-w-3xl h-fit max-h-[90vh] p-2 md:p-6 bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black relative my-4">
        <div className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden p-2">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                {isEdit ? "Edit Image" : "Add Image"}
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
                ? "Update the image details."
                : "Upload an image to add to this gallery."}
            </p>
          </div>

          <Divider />

          {/* Image upload */}
          <div>
            <FieldLabel label="Image File" required={!isEdit} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => set("image", e.target.files?.[0] ?? null)}
              className="w-full border border-[#D1D5DC] rounded-[8px] px-[16px] py-[10px] bg-[#FFFFFF] text-[#6A7282] text-sm"
            />
            <FieldError message={errors.image} />

            {/* New file preview */}
            {formData.image instanceof File && (
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={URL.createObjectURL(formData.image)}
                  className="w-20 h-20 rounded-xl object-cover border border-[#E5E7EB]"
                  alt="Preview"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-medium text-[#030712]">
                    {formData.image.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => set("image", null)}
                    className="text-[12px] text-red-500 hover:text-red-600 text-left"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Existing image when editing */}
            {isEdit &&
              !(formData.image instanceof File) &&
              image?.image_path && (
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={image.image_path}
                    className="w-20 h-20 rounded-xl object-cover border border-[#E5E7EB]"
                    alt="Current"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span className="text-[12px] text-[#6A7282]">
                    Current image (select file above to replace)
                  </span>
                </div>
              )}
          </div>

          {/* Title */}
          <div>
            <FieldLabel label="Title" />
            <input
              className={inputClass}
              placeholder="Image title (optional)"
              value={String(formData.title ?? "")}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <FieldLabel label="Description" />
            <textarea
              className={textareaClass}
              rows={2}
              placeholder="Image description (optional)"
              value={String(formData.description ?? "")}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          {/* Display order */}
          <div>
            <FieldLabel label="Display Order" />
            <input
              type="number"
              className={inputClass}
              placeholder="0"
              value={formData.display_order ?? 0}
              onChange={(e) => set("display_order", Number(e.target.value))}
            />
          </div>

          {/* Actions */}
          <div className="flex ml-auto gap-[16px] w-fit pt-2">
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
              className="bg-[#068847] h-[48px] w-[160px] rounded-xl px-[16px] text-white flex items-center justify-center font-semibold text-[16px] disabled:opacity-60 gap-1"
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
                  <span>Add Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
