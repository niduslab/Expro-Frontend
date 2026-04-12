"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { VideoStatus, YouTubeVideo } from "@/lib/types/admin/Ytvideostype";
import { CreateYouTubeVideoPayload } from "@/lib/api/functions/admin/youtubevideosApi";
import {
  useCreateYouTubeVideo,
  useUpdateYouTubeVideo,
} from "@/lib/hooks/admin/useYoutubeVideosHook";

interface YouTubeVideoModalProps {
  open: boolean;
  onClose: () => void;
  video?: YouTubeVideo | null;
}

const defaultForm: CreateYouTubeVideoPayload = {
  title: "",
  slug: "",
  description: "",
  youtube_url: "",
  is_featured: false,
  status: "draft",
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
        <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
          *
        </span>
      )}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-sm text-red-500">{message}</span>;
}

/** Converts a title to a URL-friendly slug */
function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const STATUS_OPTIONS: { label: string; value: VideoStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

export default function YouTubeVideoModal({
  open,
  onClose,
  video,
}: YouTubeVideoModalProps) {
  const isEdit = !!video;

  const [formData, setFormData] =
    useState<CreateYouTubeVideoPayload>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (open && video) {
      setFormData({
        title: video.title,
        slug: video.slug,
        description: video.description ?? "",
        youtube_url: video.youtube_url,
        is_featured: video.is_featured,
        status: video.status,
      });
      setSlugTouched(true);
    } else if (open && !video) {
      setFormData(defaultForm);
      setSlugTouched(false);
    }
    setErrors({});
  }, [open, video]);

  const set = (
    field: keyof CreateYouTubeVideoPayload,
    value: string | boolean,
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from title if slug hasn't been manually touched
      if (field === "title" && !slugTouched) {
        updated.slug = toSlug(value as string);
      }
      return updated;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.youtube_url.trim())
      newErrors.youtube_url = "YouTube URL is required";
    else if (
      !/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(
        formData.youtube_url,
      )
    ) {
      newErrors.youtube_url = "Please provide a valid YouTube video URL";
    }
    if (!formData.status) newErrors.status = "Status is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return false;
    }
    return true;
  };

  const { mutate: create, isPending: creating } = useCreateYouTubeVideo();
  const { mutate: update, isPending: updating } = useUpdateYouTubeVideo();

  const isPending = creating || updating;

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEdit && video) {
      update(
        { id: video.id, payload: formData },
        {
          onSuccess: () => {
            toast.success("Video updated successfully");
            onClose();
          },
          onError: () => toast.error("Failed to update video"),
        },
      );
    } else {
      create(formData, {
        onSuccess: () => {
          toast.success("Video created successfully");
          onClose();
        },
        onError: () => toast.error("Failed to create video"),
      });
    }
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
                {isEdit ? "Edit Video" : "Add YouTube Video"}
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
                ? "Update the video information below."
                : "Fill in the video details to add it to the gallery."}
            </p>
          </div>

          <div className="w-full border border-[#E5E7EB]" />

          {/* ── Section 1: Video Details ── */}
          <div className="flex flex-col gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Video Details
            </p>

            {/* Title */}
            <div>
              <FieldLabel label="Title" required />
              <input
                className={inputClass}
                placeholder="e.g. Annual Report 2024 Overview"
                value={formData.title}
                onChange={(e) => set("title", e.target.value)}
              />
              <FieldError message={errors.title} />
            </div>

            {/* Slug */}
            <div>
              <FieldLabel label="Slug" required />
              <input
                className={inputClass}
                placeholder="e.g. annual-report-2024-overview"
                value={formData.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
              />
              <span className="text-[#6A7282] font-normal text-[12px] leading-[160%] tracking-[-0.01em]">
                Auto-generated from title. You can customize it.
              </span>
              <FieldError message={errors.slug} />
            </div>

            {/* YouTube URL */}
            <div>
              <FieldLabel label="YouTube URL" required />
              <input
                className={inputClass}
                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                value={formData.youtube_url}
                onChange={(e) => set("youtube_url", e.target.value)}
              />
              <FieldError message={errors.youtube_url} />
            </div>

            {/* Description */}
            <div>
              <FieldLabel label="Description" />
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="Brief description of the video..."
                value={formData.description ?? ""}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>

            <div className="w-full border border-[#E5E7EB]" />
          </div>

          {/* ── Section 2: Settings ── */}
          <div className="flex flex-col gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Settings
            </p>

            {/* Status */}
            <div>
              <FieldLabel label="Status" required />
              <div className="flex gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("status", opt.value)}
                    className={`flex-1 h-[44px] rounded-[8px] border text-[14px] font-medium transition-colors ${
                      formData.status === opt.value
                        ? "border-[#068847] bg-[#DCFCE7] text-[#068847]"
                        : "border-[#D1D5DC] bg-white text-[#6A7282] hover:border-[#068847]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <FieldError message={errors.status} />
            </div>

            {/* Featured toggle */}
            <div>
              <FieldLabel label="Featured" />
              <div className="flex items-center gap-3 h-[48px]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={Boolean(formData.is_featured)}
                    onChange={(e) => set("is_featured", e.target.checked)}
                  />
                  <div className="w-10 h-5 bg-[#D1D5DC] rounded-full peer peer-checked:bg-[#068847] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
                <span className="text-[14px] text-[#4A5565]">
                  {formData.is_featured
                    ? "Featured on homepage"
                    : "Not featured"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex ml-auto gap-[16px] w-fit pt-2">
              <button
                onClick={onClose}
                disabled={isPending}
                className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] leading-[150%] tracking-[-0.01em] disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-[#068847] h-[48px] w-[180px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em] disabled:opacity-60 gap-1"
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
                    <span>Add Video</span>
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
