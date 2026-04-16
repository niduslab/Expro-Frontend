import { CreateGalleryPayload } from "@/lib/types/admin/galleryType";
import {
  FieldLabel,
  FieldError,
  Divider,
  inputClass,
  textareaClass,
  GALLERY_STATUS_OPTIONS,
} from "./galleryModalShared";
import CustomSelect from "@/components/admin/CustomSelect";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Setter = (field: keyof CreateGalleryPayload, value: unknown) => void;

// ─── Gallery Details Section ───────────────────────────────────
interface GalleryDetailsSectionProps {
  formData: CreateGalleryPayload;
  errors: Record<string, string>;
  onTitleChange: (value: string) => void;
  set: Setter;
  existingCoverUrl?: string | null;
}

export function GalleryDetailsSection({
  formData,
  errors,
  onTitleChange,
  set,
  existingCoverUrl,
}: GalleryDetailsSectionProps) {
  return (
    <div className="flex flex-col relative top-[24px] gap-[16px]">
      <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
        Gallery Details
      </p>

      <div>
        <FieldLabel label="Title" required />
        <input
          className={inputClass}
          placeholder="Gallery title"
          value={formData.title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <FieldError message={errors.title} />
      </div>

      <div>
        <FieldLabel label="Slug" required />
        <input
          className={inputClass}
          placeholder="gallery-slug"
          value={formData.slug}
          onChange={(e) => set("slug", e.target.value)}
        />
        <FieldError message={errors.slug} />
      </div>

      <div>
        <FieldLabel label="Description" />
        <RichTextEditor
          value={String(formData.description ?? "")}
          onChange={(html) => set("description", html)}
          placeholder="Short description of this gallery..."
        />
      </div>

      {/* Cover Image */}
      <div>
        <FieldLabel label="Cover Image" />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => set("cover_image", e.target.files?.[0] ?? null)}
          className="w-full border border-[#D1D5DC] rounded-[8px] px-[16px] py-[10px] bg-[#FFFFFF] text-[#6A7282] text-sm"
        />

        {/* New file selected → blob preview */}
        {formData.cover_image instanceof File && (
          <div className="flex items-center gap-3 mt-2">
            <img
              src={URL.createObjectURL(formData.cover_image)}
              className="w-20 h-20 rounded-xl object-cover border border-[#E5E7EB]"
              alt="New upload preview"
            />
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium text-[#030712]">
                {formData.cover_image.name}
              </span>
              <span className="text-[12px] text-[#6A7282]">
                New image — replaces current
              </span>
              <button
                type="button"
                onClick={() => set("cover_image", null)}
                className="text-[12px] text-red-500 hover:text-red-600 text-left"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* No new file + existing image from server */}
        {!(formData.cover_image instanceof File) && existingCoverUrl && (
          <div className="flex items-center gap-3 mt-2">
            <img
              src={existingCoverUrl}
              className="w-20 h-20 rounded-xl object-cover border border-[#E5E7EB]"
              alt="Current cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-[12px] text-[#6A7282]">
              Current cover (select file above to replace)
            </span>
          </div>
        )}
      </div>

      <Divider />
    </div>
  );
}

// ─── Gallery Settings Section ──────────────────────────────────
interface GallerySettingsSectionProps {
  formData: CreateGalleryPayload;
  set: Setter;
}

export function GallerySettingsSection({
  formData,
  set,
}: GallerySettingsSectionProps) {
  return (
    <div className="flex flex-col relative top-[48px] gap-[16px]">
      <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
        Settings
      </p>

      {/* Status */}
      <div>
        <FieldLabel label="Status" required />
        <CustomSelect
          value={formData.status}
          options={GALLERY_STATUS_OPTIONS}
          onChange={(value) =>
            set("status", value as CreateGalleryPayload["status"])
          }
        />
      </div>

      {/* Featured Toggle */}
      <div>
        <FieldLabel label="Featured Gallery" />
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
            {formData.is_featured ? "Featured" : "Not featured"}
          </span>
        </div>
      </div>
    </div>
  );
}
