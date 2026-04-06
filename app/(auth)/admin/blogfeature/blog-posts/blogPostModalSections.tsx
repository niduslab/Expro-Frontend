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
import { UserListItem } from "@/lib/types/admin/userType";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

// ─── Post Details Section ──────────────────────────────────────
interface PostDetailsSectionProps {
  formData: BlogPostPayload;
  errors: Record<string, string>;
  onTitleChange: (value: string) => void;
  set: (field: keyof BlogPostPayload, value: unknown) => void;
  existingImageUrl?: string | null;
}

export function PostDetailsSection({
  formData,
  errors,
  onTitleChange,
  set,
  existingImageUrl,
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
      {/* ── Featured Image ── */}
      <div>
        <FieldLabel label="Featured Image" />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => set("featured_image", e.target.files?.[0] ?? null)}
          className="w-full border border-[#D1D5DC] rounded-[8px] px-[16px] py-[10px] bg-[#FFFFFF] text-[#6A7282] text-sm"
        />

        {/* New file selected → blob preview */}
        {formData.featured_image instanceof File && (
          <div className="flex items-center gap-3 mt-2">
            <img
              src={URL.createObjectURL(formData.featured_image)}
              className="w-20 h-20 rounded-xl object-cover border border-[#E5E7EB]"
              alt="New upload preview"
            />
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium text-[#030712]">
                {formData.featured_image.name}
              </span>
              <span className="text-[12px] text-[#6A7282]">
                New image — replaces current
              </span>
              <button
                type="button"
                onClick={() => set("featured_image", null)}
                className="text-[12px] text-red-500 hover:text-red-600 text-left"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* No new file + existing image from server → show current */}
        {!(formData.featured_image instanceof File) && existingImageUrl && (
          <div className="flex items-center gap-3 mt-2">
            <img
              src={existingImageUrl}
              className="w-20 h-20 rounded-xl object-cover border border-[#E5E7EB]"
              alt="Current featured image"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-[#6A7282]">
                Current image (select file above to replace)
              </span>
            </div>
          </div>
        )}
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
  users: UserListItem[];
  errors?: Record<string, string>;
}

export function PublishingSettingsSection({
  formData,
  categories,
  set,
  users,
  errors,
}: PublishingSettingsSectionProps) {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = users.filter((u) =>
    (u.member?.name_english ?? u.email ?? "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const selectedUser = users.find(
    (u) => Number(u.id) === Number(formData.author_id),
  );

  // Helper to determine if a field has an error
  const hasError = (field: string) => !!errors?.[field];

  return (
    <div className="flex flex-col relative top-[48px] gap-[16px]">
      <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
        Publishing Settings
      </p>

      {/* --- CATEGORY SELECT --- */}
      <div>
        <FieldLabel label="Category" required />
        <select
          className={`${inputClass} ${hasError("category_id") ? "border-red-500 focus:ring-red-200" : ""}`}
          value={
            formData.category_id != null ? String(formData.category_id) : ""
          }
          onChange={(e) =>
            set("category_id", e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        {/* Error message MUST be outside the select tag */}
        <FieldError message={errors?.category_id} />
      </div>

      {/* --- STATUS SELECT --- */}
      <div>
        <FieldLabel label="Status" required />
        <select
          className={inputClass}
          value={formData.status}
          onChange={(e) =>
            set("status", e.target.value as BlogPostPayload["status"])
          }
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* --- PUBLISHED AT --- */}
      <div>
        <FieldLabel label="Published At" />
        <DateTimePicker
          value={formData.published_at ?? null}
          onChange={(val) => set("published_at", val)}
        />
      </div>

      {/* --- AUTHOR DROPDOWN --- */}
      <div>
        <FieldLabel label="Author" required />
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          className={`h-[48px] w-full flex items-center justify-between border rounded-[8px] px-[16px] bg-white focus:outline-none focus:ring text-left transition-colors ${
            hasError("author_id")
              ? "border-red-500 focus:ring-red-200"
              : "border-[#D1D5DC] focus:ring-green-500"
          }`}
        >
          <span
            className={`text-[14px] truncate ${
              selectedUser ? "text-[#030712]" : "text-[#6A7282]"
            }`}
          >
            {selectedUser?.member?.name_english ||
              selectedUser?.email ||
              "Select an author"}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-[#6A7282] shrink-0 transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Error message MUST be outside the button tag */}
        <FieldError message={errors?.author_id} />

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-[#D1D5DC] rounded-[8px] shadow-lg">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[#E5E7EB]">
              <Search className="h-4 w-4 text-[#6A7282] shrink-0" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name..."
                className="flex-1 text-[13px] text-[#030712] outline-none bg-transparent"
              />
            </div>
            <ul className="max-h-[160px] overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-4 py-2 text-[13px] text-[#6A7282]">
                  No users found
                </li>
              ) : (
                filtered.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => {
                      set("author_id", user.id);
                      setDropdownOpen(false);
                      setSearch("");
                    }}
                    className={`flex items-center justify-between px-4 py-2 text-[13px] cursor-pointer hover:bg-[#F3F4F6] ${
                      Number(formData.author_id) === Number(user.id)
                        ? "bg-[#DFF1E9] text-[#068847] font-semibold"
                        : "text-[#030712]"
                    }`}
                  >
                    <span className="truncate">
                      {user.member?.name_english || user.email}
                    </span>
                    <span className="text-[11px] text-[#6A7282] ml-2 shrink-0">
                      {user.roles?.[0] ?? ""}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* --- FEATURED POST --- */}
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
