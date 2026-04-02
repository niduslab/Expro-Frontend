import { BlogPostPayload } from "@/lib/types/admin/blogType";
import { BlogPostStatus } from "@/lib/types/admin/blogType";
import {
  FieldLabel,
  FieldError,
  Divider,
  inputClass,
  textareaClass,
  STATUS_OPTIONS,
} from "./blogPostModalShared";
import { DateTimePicker } from "@/components/DateTimePicker";

// ─── Post Details Section ──────────────────────────────────────
interface PostDetailsSectionProps {
  formData: BlogPostPayload;
  errors: Record<string, string>;
  onTitleChange: (value: string) => void;
  set: (field: keyof BlogPostPayload, value: unknown) => void;
}

export function PostDetailsSection({
  formData,
  errors,
  onTitleChange,
  set,
}: PostDetailsSectionProps) {
  return (
    <div className="flex flex-col relative top-[24px] gap-[16px]">
      <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
        Post Details
      </p>

      <div className="flex gap-2 w-full">
        <div className="w-1/2">
          <FieldLabel label="Title" required />
          <input
            className={inputClass}
            placeholder="Post title"
            value={formData.title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
          <FieldError message={errors.title} />
        </div>
        <div className="w-1/2">
          <FieldLabel label="Title (Bangla)" />
          <input
            className={inputClass}
            placeholder="পোস্টের শিরোনাম"
            value={String(formData.title_bangla ?? "")}
            onChange={(e) => set("title_bangla", e.target.value)}
          />
        </div>
      </div>

      <div>
        <FieldLabel label="Slug" required />
        <input
          className={inputClass}
          placeholder="post-slug"
          value={formData.slug}
          onChange={(e) => set("slug", e.target.value)}
        />
        <FieldError message={errors.slug} />
      </div>

      <div>
        <FieldLabel label="Excerpt" />
        <textarea
          className={textareaClass}
          rows={2}
          placeholder="Short summary..."
          value={String(formData.excerpt ?? "")}
          onChange={(e) => set("excerpt", e.target.value)}
        />
      </div>

      <div>
        <FieldLabel label="Content" required />
        <textarea
          className={textareaClass}
          rows={6}
          placeholder="Write your post content here..."
          value={formData.content}
          onChange={(e) => set("content", e.target.value)}
        />
        <FieldError message={errors.content} />
      </div>

      <div>
        <FieldLabel label="Featured Image URL" />
        <input
          className={inputClass}
          placeholder="https://example.com/image.jpg"
          value={String(formData.featured_image ?? "")}
          onChange={(e) => set("featured_image", e.target.value)}
        />
      </div>

      <Divider />
    </div>
  );
}

// ─── Publishing Settings Section ──────────────────────────────
interface PublishingSettingsSectionProps {
  formData: BlogPostPayload;
  categories: { id: number; name: string }[];
  set: (field: keyof BlogPostPayload, value: unknown) => void;
}

export function PublishingSettingsSection({
  formData,
  categories,
  set,
}: PublishingSettingsSectionProps) {
  return (
    <div className="flex flex-col relative top-[48px] gap-[16px]">
      <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
        Publishing Settings
      </p>

      <div className="flex gap-2 w-full">
        <div className="w-1/2">
          <FieldLabel label="Category" />
          <select
            className={inputClass}
            value={formData.category_id ?? ""}
            onChange={(e) =>
              set("category_id", e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/2">
          <FieldLabel label="Status" />
          <select
            className={inputClass}
            value={String(formData.status)}
            onChange={(e) => set("status", e.target.value as BlogPostStatus)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ Replaced datetime-local with DateTimePicker */}
      <div>
        <FieldLabel label="Published At" />
        <DateTimePicker
          value={formData.published_at ?? null}
          onChange={(val) => set("published_at", val)}
        />
      </div>

      <div>
        <FieldLabel label="Featured Post" />
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

      <Divider />
    </div>
  );
}

// ─── Tags Section ──────────────────────────────────────────────
interface TagsSectionProps {
  tags: string[];
  tagInput: string;
  onTagInputChange: (v: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export function TagsSection({
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
}: TagsSectionProps) {
  return (
    <div className="flex flex-col relative top-[72px] gap-[16px]">
      <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
        Tags
      </p>

      <div>
        <FieldLabel label="Add Tags" />
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Type a tag and press Add"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), onAddTag())
            }
          />
          <button
            type="button"
            onClick={onAddTag}
            className="h-[48px] px-4 rounded-[8px] bg-[#d7efdc] text-[#068847] font-medium text-sm whitespace-nowrap hover:bg-[#c3e8ca] transition-colors"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d7efdc] text-[#068847] text-xs font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  className="text-[#068847] hover:text-red-500 font-bold ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
