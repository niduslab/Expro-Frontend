import { apiRequest } from "../../axios";
import type {
  CreateGalleryImagePayload,
  CreateGalleryPayload,
  GalleryDetailResponse,
  GalleryImageDetailResponse,
  GalleryImageListParams,
  GalleryImageListResponse,
  GalleryListParams,
  GalleryListResponse,
  ReorderGalleryImagesPayload,
  UpdateGalleryImagePayload,
  UpdateGalleryPayload,
} from "@/lib/types/admin/galleryType";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toFormData = (payload: Record<string, unknown>): FormData => {
  const form = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === null || value === undefined) continue;

    if (value instanceof File) {
      form.append(key, value);
    } else if (typeof value === "boolean") {
      form.append(key, value ? "1" : "0");
    } else {
      form.append(key, String(value));
    }
  }
  return form;
};

const buildQueryString = (params: Record<string, unknown>): string => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      search.append(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

// ─── Gallery API ──────────────────────────────────────────────────────────────

export const galleryApi = {
  getAll: (params: GalleryListParams = {}) => {
    const qs = buildQueryString(params as Record<string, unknown>);
    return apiRequest.get<GalleryListResponse["data"]>(`/galleries${qs}`);
  },

  getFeatured: (params: Pick<GalleryListParams, "page" | "per_page"> = {}) => {
    const qs = buildQueryString(params as Record<string, unknown>);
    return apiRequest.get<GalleryListResponse["data"]>(
      `/galleries/featured${qs}`,
    );
  },

  getById: (id: number) => {
    if (!id) throw new Error("Gallery ID is required");
    return apiRequest.get<GalleryDetailResponse["data"]>(`/galleries/${id}`);
  },

  create: (payload: CreateGalleryPayload) =>
    apiRequest.post<GalleryDetailResponse["data"]>(
      "/galleries",
      toFormData(payload as unknown as Record<string, unknown>),
      { headers: { "Content-Type": "multipart/form-data" } },
    ),

  update: (id: number, payload: UpdateGalleryPayload) => {
    if (!id) throw new Error("Gallery ID is required");
    return apiRequest.post<GalleryDetailResponse["data"]>( // ← put → post
      `/galleries/${id}`,
      toFormData(payload as unknown as Record<string, unknown>),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  delete: (id: number) => {
    if (!id) throw new Error("Gallery ID is required");
    return apiRequest.delete<null>(`/galleries/${id}`);
  },
};

// ─── Gallery Image API ────────────────────────────────────────────────────────

export const galleryImageApi = {
  getAll: (galleryId: number, params: GalleryImageListParams = {}) => {
    if (!galleryId) throw new Error("Gallery ID is required");
    const qs = buildQueryString(params as Record<string, unknown>);
    return apiRequest.get<GalleryImageListResponse["data"]>(
      `/galleries/${galleryId}/images${qs}`,
    );
  },

  getById: (galleryId: number, imageId: number) => {
    if (!galleryId || !imageId)
      throw new Error("Gallery ID and Image ID are required");
    return apiRequest.get<GalleryImageDetailResponse["data"]>(
      `/galleries/${galleryId}/images/${imageId}`,
    );
  },

  create: (galleryId: number, payload: CreateGalleryImagePayload) => {
    if (!galleryId) throw new Error("Gallery ID is required");
    return apiRequest.post<GalleryImageDetailResponse["data"]>(
      `/galleries/${galleryId}/images`,
      toFormData(payload as unknown as Record<string, unknown>),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  update: (
    galleryId: number,
    imageId: number,
    payload: UpdateGalleryImagePayload,
  ) => {
    if (!galleryId || !imageId)
      throw new Error("Gallery ID and Image ID are required");

    return apiRequest.post<GalleryImageDetailResponse["data"]>( // ← PUT → POST
      `/galleries/${galleryId}/images/${imageId}`,
      toFormData(payload as unknown as Record<string, unknown>),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  delete: (galleryId: number, imageId: number) => {
    if (!galleryId || !imageId)
      throw new Error("Gallery ID and Image ID are required");
    return apiRequest.delete<null>(`/galleries/${galleryId}/images/${imageId}`);
  },

  reorder: (galleryId: number, payload: ReorderGalleryImagesPayload) => {
    if (!galleryId) throw new Error("Gallery ID is required");
    return apiRequest.post<null>(
      `/galleries/${galleryId}/images/reorder`,
      payload,
    );
  },
};
