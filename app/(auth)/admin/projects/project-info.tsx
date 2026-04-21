"use client";
import Dropdown from "@/components/ui/dropdown";
import { ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { CompletedTabs } from "./new-project-modal";
import { projectInfoSchema } from "@/components/zodschema/projectSchema";
import { toast } from "sonner";
import { ProjectFormDataInterface } from "@/lib/types/projectType";
// 1. Import the RichTextEditor
import RichTextEditor from "@/components/admin/RichTextEditor";

interface ProjectInfoProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: "info" | "budget" | "teams";
  formData: ProjectFormDataInterface;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormDataInterface>>;
  setActiveTab: React.Dispatch<
    React.SetStateAction<"info" | "budget" | "teams">
  >;
  setCompletedTabs: React.Dispatch<React.SetStateAction<CompletedTabs>>;
}

export default function ProjectInfo({
  setOpenModal,
  activeTab,
  setActiveTab,
  formData,
  setFormData,
  setCompletedTabs,
}: ProjectInfoProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string | null>(() => {
    if (formData.featuredImage) {
      return URL.createObjectURL(formData.featuredImage);
    }
    return formData.featured_image ?? null;
  });

  const handleNext = () => {
    const result = projectInfoSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      const lastMessage = result.error.issues.slice(-1)[0]?.message;
      toast.error(lastMessage || "Validation failed");
      return;
    }

    setErrors({});
    setCompletedTabs((prev) => ({ ...prev, info: true }));
    setActiveTab("budget");
  };

  const handleFeaturedImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, featuredImage: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(formData.featured_image ?? null);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []);
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages ?? []), ...newFiles],
    }));
    e.target.value = "";
  };

  const removeNewGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: (prev.galleryImages ?? []).filter((_, i) => i !== index),
    }));
  };

  const removeExistingGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: (prev.gallery ?? []).filter((_, i) => i !== index),
    }));
  };

  return (
    // Fills the height given by the modal — split into scrollable body + fixed footer
    <div className="flex flex-col h-full">
      {/* Scrollable form area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-[12px] pt-4 pr-1">
        {/* Project Title */}
        <div>
          <div className="pb-2">
            <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
              Project Title
            </span>
            <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
              *
            </span>
          </div>
          <input
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
            }}
            className="w-full h-[48px] text-[#6A7282] opacity-100 border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500"
            placeholder="Healthcare Program"
          />
          {errors.title && (
            <span className="text-sm text-red-500 py-0.5">{errors.title}</span>
          )}
        </div>

        {/* Category + Status */}
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative w-full sm:w-1/2">
            <Dropdown
              label="Category"
              required
              placeholder="Select Category"
              options={[
                "health",
                "education",
                "agriculture",
                "media",
                "women_entrepreneurship",
                "other",
                "humanity",
              ]}
              value={formData.category}
              onChange={(value) => {
                setFormData({ ...formData, category: value });
                if (errors.category)
                  setErrors((prev) => ({ ...prev, category: "" }));
              }}
            />
            {errors.category && (
              <span className="text-sm text-red-500 py-0.5">
                {errors.category}
              </span>
            )}
          </div>
          <div className="relative w-full sm:w-1/2">
            <Dropdown
              label="Status"
              required
              placeholder="Select Status"
              options={[
                "planned",
                "upcoming",
                "ongoing",
                "completed",
                "cancelled",
              ]}
              value={formData.status}
              onChange={(value) => {
                setFormData({ ...formData, status: value });
                if (errors.status)
                  setErrors((prev) => ({ ...prev, status: "" }));
              }}
            />
            {errors.status && (
              <span className="text-sm text-red-500 py-0.5">
                {errors.status}
              </span>
            )}
          </div>
        </div>

        {/* Short Description (Plain Text) */}
        <div>
          <div className="pb-2">
            <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
              Short Description
            </span>
            <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
              *
            </span>
          </div>

          <RichTextEditor
            value={formData.shortDescription || ""}
            onChange={(html) => {
              setFormData({ ...formData, shortDescription: html });
              if (errors.shortDescription)
                setErrors((prev) => ({ ...prev, shortDescription: "" }));
            }}
            placeholder="Detailed description of the project..."
          />

          <div className="flex justify-between items-start">
            {errors.shortDescription && (
              <span className="text-sm text-red-500 py-0.5">
                {errors.shortDescription}
              </span>
            )}
            <span className="text-xs text-[#9CA3AF] ml-auto">
              {formData.shortDescription.length}/500
            </span>
          </div>
        </div>

        {/* Description (Rich Text) */}
        <div>
          <div className="pb-2">
            <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
              Description
            </span>
            <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
              *
            </span>
          </div>

          {/* 2. Replaced Textarea with RichTextEditor */}
          <RichTextEditor
            value={formData.description || ""}
            onChange={(html) => {
              setFormData({ ...formData, description: html });
              if (errors.description)
                setErrors((prev) => ({ ...prev, description: "" }));
            }}
            placeholder="Detailed description of the project..."
          />

          {errors.description && (
            <span className="text-sm text-red-500 py-0.5">
              {errors.description}
            </span>
          )}
        </div>

        {/* Featured Image */}
        <div>
          <div className="pb-2">
            <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
              Featured Image
            </span>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
            onChange={handleFeaturedImageChange}
            className="w-full border border-[#D1D5DC] rounded-[8px] px-[16px] py-[10px] bg-[#FFFFFF] text-[#6A7282] text-sm"
          />
          {preview && (
            <div className="relative mt-2 inline-block group">
              <img
                src={preview}
                alt="Featured preview"
                className="h-[80px] w-auto rounded-md object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(formData.featured_image ?? null);
                  setFormData((prev) => ({ ...prev, featuredImage: null }));
                }}
                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              {formData.featuredImage && (
                <span className="block text-[11px] text-green-600 mt-1">
                  New file selected: {formData.featuredImage.name}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Gallery Images */}
        <div className="pb-2">
          <div className="pb-2 flex items-center justify-between">
            <div>
              <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                Gallery Images
              </span>
              <span className="text-[#9CA3AF] text-[12px] ml-1">
                (optional, multiple)
              </span>
            </div>
            <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#068847] text-white text-[12px] font-medium hover:bg-green-700 transition-colors">
              <span>+ Add Images</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
                multiple
                onChange={handleGalleryChange}
                className="hidden"
              />
            </label>
          </div>

          {(formData.gallery ?? []).length > 0 ||
          (formData.galleryImages ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {(formData.gallery ?? []).map((url, i) => (
                <div key={`existing-${i}`} className="relative group">
                  <img
                    src={url}
                    alt={`Gallery ${i + 1}`}
                    className="h-20 w-20 object-cover rounded-lg border-2 border-[#E5E7EB]"
                  />
                  <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-black/40 text-white rounded-b-lg py-0.5">
                    Saved
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExistingGalleryImage(i)}
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {(formData.galleryImages ?? []).map((file, i) => (
                <div key={`new-${i}`} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New ${i + 1}`}
                    className="h-20 w-20 object-cover rounded-lg border-2 border-[#068847]"
                  />
                  <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-[#068847]/80 text-white rounded-b-lg py-0.5">
                    New
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewGalleryImage(i)}
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-1 h-20 border-2 border-dashed border-[#D1D5DC] rounded-lg flex items-center justify-center text-[#9CA3AF] text-[13px]">
              No gallery images yet
            </div>
          )}
        </div>
      </div>

      {/* Footer — pinned to bottom, always visible */}
      <div className="shrink-0 flex justify-between w-full pt-3 border-t border-[#E5E7EB] bg-white">
        <button
          onClick={() => setOpenModal(false)}
          className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] leading-[150%] tracking-[-0.01em]"
        >
          Cancel
        </button>
        <button
          onClick={handleNext}
          className="bg-[#068847] h-[48px] w-[158px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px]"
        >
          Next <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
