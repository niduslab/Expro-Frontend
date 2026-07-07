"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BlogPost, BlogPostPayload } from "@/lib/types/admin/blogType";
import {
  useCreateBlogPost,
  useUpdateBlogPost,
} from "@/lib/hooks/admin/useBlogPostHook";
import { useBlogCategories } from "@/lib/hooks/admin/useBlogCategory";
import { defaultForm, slugify } from "./blogPostModalShared";
import {
  PostDetailsSection,
  PublishingSettingsSection,
  TagsSection,
} from "./blogPostModalSections";
import { useUsers } from "@/lib/hooks/admin/useUsers";

interface BlogPostModalProps {
  open: boolean;
  onClose: () => void;
  post?: BlogPost | null;
}

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
  const { data: usersData } = useUsers();
  const users = usersData?.data ?? [];

  useEffect(() => {
    if (open && post) {
      setFormData({
        id: post.id,
        title: post.title,
        title_bangla: post.title_bangla ?? "",
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        content: post.content,
        featured_image: null,
        author_id: post.author?.id ?? post.author_id ?? null, // ← fix
        category_id: post.category?.id ?? post.category_id ?? null, // ← fix
        status: String(post.status) as BlogPostPayload["status"],
        published_at: post.published_at ?? null,
        is_featured: post.is_featured,
        tags: Array.isArray(post.tags) ? post.tags : [],
        // In the useEffect where you set formData for editing
        meta:
          typeof post.meta === "string"
            ? (() => {
                try {
                  return JSON.parse(post.meta);
                } catch {
                  return null;
                }
              })()
            : (post.meta ?? null),
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

    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.slug?.trim()) newErrors.slug = "Slug is required";
    if (!formData.content?.trim()) newErrors.content = "Content is required";
    if (formData.author_id === null || formData.author_id === undefined)
      newErrors.author_id = "Author is required";
    if (formData.category_id === null || formData.category_id === undefined)
      newErrors.category_id = "Category is required";

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
    Number(post?.id), // undefined when no post — safe
    {
      onSuccess: () => {
        toast.success("Post updated successfully");
        onClose();
      },
      onError: () => toast.error("Failed to update post"),
    },
  );

  const isPending = creating || updating;

  // In Blogpostmodal.tsx — handleSubmit
  const handleSubmit = () => {
    if (!validate()) return;

    // Parse meta if it was stored/received as a JSON string
    let parsedMeta = formData.meta;
    if (typeof parsedMeta === "string") {
      try {
        parsedMeta = JSON.parse(parsedMeta);
      } catch {
        parsedMeta = null;
      }
    }

    const payload: BlogPostPayload = {
      ...formData,
      meta: parsedMeta,
      published_at: formData.published_at
        ? new Date(formData.published_at)
            .toISOString()
            .replace("T", " ")
            .replace(".000Z", "")
        : null,
      featured_image: formData.featured_image || null,
    };

    if (isEdit) update(payload);
    else create(payload);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="flex flex-col w-full max-w-5xl h-[90vh] p-2 md:p-6 bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black relative my-4">
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

          <PostDetailsSection
            formData={formData}
            errors={errors}
            onTitleChange={handleTitleChange}
            set={set}
            existingImageUrl={post?.featured_image_url ?? null}
          />

          <PublishingSettingsSection
            formData={formData}
            categories={categories}
            set={set}
            users={users}
            errors={errors}
          />

          <TagsSection
            tags={formData.tags ?? []}
            tagInput={tagInput}
            onTagInputChange={setTagInput}
            onAddTag={addTag}
            onRemoveTag={removeTag}
          />

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
                  <span>Publish Post</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
