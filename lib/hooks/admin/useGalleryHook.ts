import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { type AxiosResponse } from "axios";

import type {
  CreateGalleryImagePayload,
  CreateGalleryPayload,
  Gallery,
  GalleryImage,
  GalleryImageListParams,
  GalleryListParams,
  ReorderGalleryImagesPayload,
  UpdateGalleryImagePayload,
  UpdateGalleryPayload,
} from "@/lib/types/admin/galleryType";
import { ApiResponse } from "@/lib/api/axios";
import {
  galleryApi,
  galleryImageApi,
} from "@/lib/api/functions/admin/galleriesApi";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const galleryKeys = {
  all: ["galleries"] as const,
  lists: () => [...galleryKeys.all, "list"] as const,
  list: (params: GalleryListParams) =>
    [...galleryKeys.lists(), params] as const,
  featured: () => [...galleryKeys.all, "featured"] as const,
  featuredList: (params: Pick<GalleryListParams, "page" | "per_page">) =>
    [...galleryKeys.featured(), params] as const,
  details: () => [...galleryKeys.all, "detail"] as const,
  detail: (id: number) => [...galleryKeys.details(), id] as const,
  images: (galleryId: number) =>
    [...galleryKeys.detail(galleryId), "images"] as const,
  imageLists: (galleryId: number) =>
    [...galleryKeys.images(galleryId), "list"] as const,
  imageList: (galleryId: number, params: GalleryImageListParams) =>
    [...galleryKeys.imageLists(galleryId), params] as const,
  imageDetails: (galleryId: number) =>
    [...galleryKeys.images(galleryId), "detail"] as const,
  imageDetail: (galleryId: number, imageId: number) =>
    [...galleryKeys.imageDetails(galleryId), imageId] as const,
} as const;

// ─── Shared Types ─────────────────────────────────────────────────────────────

type GalleryListData = AxiosResponse<ApiResponse<Gallery[]>>["data"];
type GalleryDetailData = AxiosResponse<ApiResponse<Gallery>>["data"];
type GalleryImageListData = AxiosResponse<ApiResponse<GalleryImage[]>>["data"];
type GalleryImageDetailData = AxiosResponse<ApiResponse<GalleryImage>>["data"];

// ─── Gallery Queries ──────────────────────────────────────────────────────────

export function useGalleries(
  params: GalleryListParams = {},
  options?: Omit<UseQueryOptions<GalleryListData>, "queryKey" | "queryFn">,
) {
  return useQuery<GalleryListData>({
    queryKey: galleryKeys.list(params),
    queryFn: async () => {
      const res = await galleryApi.getAll(params);
      return res.data;
    },
    ...options,
  });
}

export function useFeaturedGalleries(
  params: Pick<GalleryListParams, "page" | "per_page"> = {},
  options?: Omit<UseQueryOptions<GalleryListData>, "queryKey" | "queryFn">,
) {
  return useQuery<GalleryListData>({
    queryKey: galleryKeys.featuredList(params),
    queryFn: async () => {
      const res = await galleryApi.getFeatured(params);
      return res.data;
    },
    ...options,
  });
}

export function useGallery(
  id: number,
  options?: Omit<UseQueryOptions<GalleryDetailData>, "queryKey" | "queryFn">,
) {
  return useQuery<GalleryDetailData>({
    queryKey: galleryKeys.detail(id),
    queryFn: async () => {
      const res = await galleryApi.getById(id);
      return res.data;
    },
    enabled: !!id,
    ...options,
  });
}

// ─── Gallery Mutations ────────────────────────────────────────────────────────

export function useCreateGallery(
  options?: UseMutationOptions<GalleryDetailData, Error, CreateGalleryPayload>,
) {
  const queryClient = useQueryClient();
  return useMutation<GalleryDetailData, Error, CreateGalleryPayload>({
    mutationFn: async (payload) => {
      const res = await galleryApi.create(payload);
      return res.data;
    },

    ...options,
    onSuccess: (data, variables, onMutate, context) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.featured() });
      options?.onSuccess?.(data, variables, onMutate, context);
    },
  });
}

export function useUpdateGallery(
  id: number,
  options?: UseMutationOptions<GalleryDetailData, Error, UpdateGalleryPayload>,
) {
  const queryClient = useQueryClient();
  return useMutation<GalleryDetailData, Error, UpdateGalleryPayload>({
    mutationFn: async (payload) => {
      const res = await galleryApi.update(id, payload);
      return res.data;
    },
    ...options,
    onSuccess: (data, variables, onMutate, context) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.featured() });
      queryClient.setQueryData(galleryKeys.detail(id), data);
      options?.onSuccess?.(data, variables, onMutate, context);
    },
  });
}

export function useDeleteGallery(
  options?: UseMutationOptions<AxiosResponse<ApiResponse<null>>, Error, number>,
) {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse<ApiResponse<null>>, Error, number>({
    mutationFn: (id) => galleryApi.delete(id),
    ...options,
    onSuccess: (data, id, onMutate, context) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.featured() });
      queryClient.removeQueries({ queryKey: galleryKeys.detail(id) });
      options?.onSuccess?.(data, id, onMutate, context);
    },
  });
}

// ─── Gallery Image Queries ────────────────────────────────────────────────────

export function useGalleryImages(
  galleryId: number,
  params: GalleryImageListParams = {},
  options?: Omit<UseQueryOptions<GalleryImageListData>, "queryKey" | "queryFn">,
) {
  return useQuery<GalleryImageListData>({
    queryKey: galleryKeys.imageList(galleryId, params),
    queryFn: async () => {
      const res = await galleryImageApi.getAll(galleryId, params);
      return res.data;
    },
    enabled: !!galleryId,
    ...options,
  });
}

export function useGalleryImage(
  galleryId: number,
  imageId: number,
  options?: Omit<
    UseQueryOptions<GalleryImageDetailData>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<GalleryImageDetailData>({
    queryKey: galleryKeys.imageDetail(galleryId, imageId),
    queryFn: async () => {
      const res = await galleryImageApi.getById(galleryId, imageId);
      return res.data;
    },
    enabled: !!galleryId && !!imageId,
    ...options,
  });
}

// ─── Gallery Image Mutations ──────────────────────────────────────────────────

export function useCreateGalleryImage(
  galleryId: number,
  options?: UseMutationOptions<
    GalleryImageDetailData,
    Error,
    CreateGalleryImagePayload
  >,
) {
  const queryClient = useQueryClient();
  return useMutation<GalleryImageDetailData, Error, CreateGalleryImagePayload>({
    mutationFn: async (payload) => {
      const res = await galleryImageApi.create(galleryId, payload);
      return res.data;
    },
    ...options,
    onSuccess: (data, variables, onMutate, context) => {
      // ← add onMutate
      queryClient.invalidateQueries({
        queryKey: galleryKeys.imageLists(galleryId),
      });
      queryClient.invalidateQueries({
        queryKey: galleryKeys.detail(galleryId),
      });
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      options?.onSuccess?.(data, variables, onMutate, context); // ← add onMutate
    },
  });
}

export function useUpdateGalleryImage(
  galleryId: number,
  imageId: number,
  options?: UseMutationOptions<
    GalleryImageDetailData,
    Error,
    UpdateGalleryImagePayload
  >,
) {
  const queryClient = useQueryClient();
  return useMutation<GalleryImageDetailData, Error, UpdateGalleryImagePayload>({
    mutationFn: async (payload) => {
      const res = await galleryImageApi.update(galleryId, imageId, payload);
      return res.data;
    },
    ...options,
    onSuccess: (data, variables, onMutate, context) => {
      // ← add onMutate
      queryClient.invalidateQueries({
        queryKey: galleryKeys.imageLists(galleryId),
      });
      queryClient.setQueryData(
        galleryKeys.imageDetail(galleryId, imageId),
        data,
      );
      queryClient.invalidateQueries({
        queryKey: galleryKeys.detail(galleryId),
      });
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      options?.onSuccess?.(data, variables, onMutate, context); // ← add onMutate
    },
  });
}
type DeleteGalleryImageVariables = { galleryId: number; imageId: number };

export function useDeleteGalleryImage(
  options?: UseMutationOptions<
    AxiosResponse<ApiResponse<null>>,
    Error,
    DeleteGalleryImageVariables
  >,
) {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<ApiResponse<null>>,
    Error,
    DeleteGalleryImageVariables
  >({
    mutationFn: ({ galleryId, imageId }) =>
      galleryImageApi.delete(galleryId, imageId),
    ...options,
    onSuccess: (data, { galleryId, imageId }, onMutate, context) => {
      queryClient.invalidateQueries({
        queryKey: galleryKeys.imageLists(galleryId),
      });
      queryClient.removeQueries({
        queryKey: galleryKeys.imageDetail(galleryId, imageId),
      });
      queryClient.invalidateQueries({
        queryKey: galleryKeys.detail(galleryId),
      });
      options?.onSuccess?.(data, { galleryId, imageId }, onMutate, context);
    },
  });
}

export function useReorderGalleryImages(
  galleryId: number,
  options?: UseMutationOptions<
    AxiosResponse<ApiResponse<null>>,
    Error,
    ReorderGalleryImagesPayload
  >,
) {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<ApiResponse<null>>,
    Error,
    ReorderGalleryImagesPayload
  >({
    mutationFn: (payload) => galleryImageApi.reorder(galleryId, payload),
    onSuccess: (data, variables, onMutate, context) => {
      queryClient.invalidateQueries({
        queryKey: galleryKeys.imageLists(galleryId),
      });
      options?.onSuccess?.(data, variables, onMutate, context);
    },
    ...options,
  });
}
