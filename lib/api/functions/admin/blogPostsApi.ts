import { apiClient } from "@/lib/api/axios";
import {
  BlogPostListResponse,
  SingleBlogPostResponse,
  BlogPostPayload,
  DeleteBlogPostResponse,
} from "@/lib/types/admin/blogType";
import { BlogPost } from "@/lib/types/admin/blogType";

const mapBlogPostResponse = (post: BlogPost): BlogPost => ({
  ...post,
  featured_image_url:
    typeof post.featured_image === "string" ? post.featured_image : null,
  featured_image: null,
});
/**
 * Get all blog posts (with optional query params for filtering/search/pagination)
 */
export const fetchBlogPosts = async (
  params?: Record<string, unknown>,
): Promise<BlogPostListResponse> => {
  const { data } = await apiClient.get("/blogposts", { params });

  return {
    ...data,
    data: data.data.map(mapBlogPostResponse),
  };
};

/**
 * Get single blog post by ID
 */
export const fetchBlogPostById = async (
  id: number | string,
): Promise<SingleBlogPostResponse> => {
  const { data } = await apiClient.get(`/blogpost/${id}`);

  return {
    ...data,
    data: mapBlogPostResponse(data.data),
  };
};

const buildBlogFormData = (payload: BlogPostPayload): FormData => {
  const form = new FormData();

  form.append("title", payload.title);
  form.append("slug", payload.slug);
  form.append("content", payload.content);
  form.append("status", payload.status ?? "draft");
  form.append("is_featured", payload.is_featured ? "1" : "0");

  if (payload.title_bangla) form.append("title_bangla", payload.title_bangla);
  if (payload.excerpt) form.append("excerpt", payload.excerpt);
  if (payload.author_id != null)
    form.append("author_id", String(payload.author_id));
  if (payload.category_id != null)
    form.append("category_id", String(payload.category_id));
  if (payload.published_at) form.append("published_at", payload.published_at);
  if (payload.tags?.length) {
    payload.tags.forEach((tag, index) => {
      form.append(`tags[${index}]`, tag);
    });
  }
  if (payload.meta) form.append("meta", JSON.stringify(payload.meta));

  // ✅ Only append if it's a real File — never send existing URL string back
  if (payload.featured_image instanceof File) {
    form.append("featured_image", payload.featured_image);
  }

  return form;
};

export const createBlogPost = async (
  payload: BlogPostPayload,
): Promise<SingleBlogPostResponse> => {
  const { data } = await apiClient.post(
    "/blogpost",
    buildBlogFormData(payload),
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
};

export const updateBlogPost = async (
  id: number | string,
  payload: BlogPostPayload,
): Promise<SingleBlogPostResponse> => {
  const form = buildBlogFormData(payload);
  form.append("_method", "PUT");

  const { data } = await apiClient.post(`/blogpost/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/**
 * Delete a blog post by ID
 */
export const deleteBlogPost = async (
  id: number | string,
): Promise<DeleteBlogPostResponse> => {
  const { data } = await apiClient.delete(`/blogpost/${id}`);
  return data;
};
