// lib/hooks/public/galleryHooks.ts

import { useQuery } from "@tanstack/react-query";
import {
  Gallery,
  GalleryImage,
  PaginatedResponse,
} from "@/lib/types/galleryType";
import {
  fetchGalleries,
  fetchGalleryImages,
  fetchGalleryById,
} from "@/lib/api/functions/public/galleriesApi";

/**
 * Hook to fetch all galleries
 */
export const useGalleries = (page: number = 1, per_page: number = 10) => {
  return useQuery<PaginatedResponse<Gallery>, Error>({
    queryKey: ["galleries", page, per_page],
    queryFn: () => fetchGalleries(page, per_page),
  });
};

/**
 * Hook to fetch a single gallery by ID
 */
export const useGallery = (id: number) => {
  return useQuery<Gallery, Error>({
    queryKey: ["gallery", id],
    queryFn: () => fetchGalleryById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch images of a gallery
 */
export const useGalleryImages = (galleryId: number) => {
  return useQuery<GalleryImage[], Error>({
    queryKey: ["galleryImages", galleryId],
    queryFn: () => fetchGalleryImages(galleryId),
    enabled: !!galleryId,
  });
};
