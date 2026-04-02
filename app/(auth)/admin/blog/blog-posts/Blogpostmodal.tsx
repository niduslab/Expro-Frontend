"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  BlogPost,
  BlogPostPayload,
  BlogPostStatus,
} from "@/lib/types/admin/blogType";
import {
  useCreateBlogPost,
  useUpdateBlogPost,
} from "@/lib/hooks/admin/useBlogPostHook";
import { useBlogCategories } from "@/lib/hooks/admin/useBlogCategory";

interface BlogPostModalProps {
  open: boolean;
  onClose: () => void;
  post?: BlogPost | null;
}

const defaultForm: BlogPostPayload = {
  title: "",
  title_bangla: "",
  slug: "",
  excerpt: "",
  content: "",
  featured_image: "",
  author_id: 0,
  category_id: null,
  status: "draft",
  published_at: null,
  is_featured: false,
  tags: [],
  meta: null,
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

const STATUS_OPTIONS: { label: string; value: BlogPostStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

export default function BlogPostModal({
  open,
  onClose,
  post,
}: BlogPostModalProps) {
  const isEdit = !!post;
  const [formData, setFormData] = useState<BlogPostPayload>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState("");

  const { data: categoriesData } = useBlogCategories();
  const categories = categoriesData?.data ?? [];

  useEffect(() => {
    if (open && post) {
      setFormData({
        title: post.title,
        title_bangla: post.title_bangla ?? "",
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        content: post.content,
        featured_image: post.featured_image ?? "",
        author_id: post.author_id,
        category_id: post.category_id ?? null,
        status: String(post.status) as BlogPostStatus,
        published_at: post.published_at ?? null,
        is_featured: post.is_featured,
        tags: post.tags ?? [],
        meta: post.meta ?? null,
      });
    } else if (open && !post) {
      setFormData(defaultForm);
      setTagInput("");
    }
    setErrors({});
  }, [open, post]);

  const set = (field: keyof BlogPostPayload, value: unknown) => {
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

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    const current = formData.tags ?? [];
    if (!current.includes(tag)) set("tags", [...current, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    set(
      "tags",
      (formData.tags ?? []).filter((t) => t !== tag),
    );
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return false;
    }
    return true;
  };

  const { mutate: create, isPending: creating } = useCreateBlogPost({
    onSuccess: () => {
      toast.success("Post created successfully");
      onClose();
    },
    onError: () => toast.error("Failed to create post"),
  });

  const { mutate: update, isPending: updating } = useUpdateBlogPost(
    post?.id ?? 0,
    {
      onSuccess: () => {
        toast.success("Post updated successfully");
        onClose();
      },
      onError: () => toast.error("Failed to update post"),
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
      <div className="flex flex-col w-full max-w-[680px] h-[90vh] p-2 md:p-6 bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black relative my-4">
        <div className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden p-2">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                {isEdit ? "Edit Post" : "Create New Post"}
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
                ? "Update the blog post details below."
                : "Fill in the post details, content, and settings."}
            </p>
          </div>

          <div className="w-full border border-[#E5E7EB]" />

          {/* Section 1: Post Details */}
          <div className="flex flex-col relative top-[24px] gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Post Details
            </p>

            {/* Title + Bangla */}
            <div className="flex gap-2 w-full">
              <div className="w-1/2">
                <FieldLabel label="Title" required />
                <input
                  className={inputClass}
                  placeholder="Post title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
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

            {/* Slug */}
            <div>
              <FieldLabel label="Slug" required />
              <input
                className={inputClass}
                placeholder="post-slug"
                value={formData.slug}
                onChange={(e) => set("slug", slugify(e.target.value))}
              />
              <FieldError message={errors.slug} />
            </div>

            {/* Excerpt */}
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

            {/* Content */}
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

            {/* Featured Image */}
            <div>
              <FieldLabel label="Featured Image URL" />
              <input
                className={inputClass}
                placeholder="https://example.com/image.jpg"
                value={String(formData.featured_image ?? "")}
                onChange={(e) => set("featured_image", e.target.value)}
              />
            </div>

            <div className="w-full border border-[#E5E7EB]" />
          </div>

          {/* Section 2: Publishing Settings */}
          <div className="flex flex-col relative top-[48px] gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Publishing Settings
            </p>

            {/* Category + Status */}
            <div className="flex gap-2 w-full">
              <div className="w-1/2">
                <FieldLabel label="Category" />
                <select
                  className={inputClass}
                  value={formData.category_id ?? ""}
                  onChange={(e) =>
                    set(
                      "category_id",
                      e.target.value ? Number(e.target.value) : null,
                    )
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
                  onChange={(e) =>
                    set("status", e.target.value as BlogPostStatus)
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Published At */}
            <div>
              <FieldLabel label="Published At" />
              <input
                type="datetime-local"
                className={inputClass}
                value={
                  formData.published_at
                    ? formData.published_at.slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  set(
                    "published_at",
                    e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  )
                }
              />
            </div>

            {/* Is Featured */}
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

            <div className="w-full border border-[#E5E7EB]" />
          </div>

          {/* Section 3: Tags */}
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
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="h-[48px] px-4 rounded-[8px] bg-[#d7efdc] text-[#068847] font-medium text-sm whitespace-nowrap hover:bg-[#c3e8ca] transition-colors"
                >
                  Add
                </button>
              </div>
              {(formData.tags ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {(formData.tags ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d7efdc] text-[#068847] text-xs font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-[#068847] hover:text-red-500 font-bold ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
                    <span>Publish Post</span>
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
