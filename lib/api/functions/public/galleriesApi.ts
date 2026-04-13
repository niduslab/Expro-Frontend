// lib/api/functions/public/galleriesApi.ts

import { apiRequest } from "@/lib/api/axios";
import {
  Gallery,
  GalleryImage,
  PaginatedResponse,
} from "@/lib/types/galleryType";

/**
 * Fetch all galleries (paginated optional)
 */
export const fetchGalleries = async (
  page = 1,
  per_page = 10,
): Promise<PaginatedResponse<Gallery>> => {
  const res = await apiRequest.get<PaginatedResponse<Gallery>>(
    `/public/galleries?page=${page}&per_page=${per_page}`,
  );
  return res.data.data;
};

/**
 * Fetch images for a specific gallery
 */
export const fetchGalleryImages = async (
  galleryId: number,
): Promise<GalleryImage[]> => {
  const res = await apiRequest.get<GalleryImage[]>(
    `/public/galleries/${galleryId}/images`,
  );
  return res.data.data;
};

/**
 * Fetch a single gallery by ID
 */
export const fetchGalleryById = async (id: number): Promise<Gallery> => {
  const res = await apiRequest.get<Gallery>(`/galleries/${id}`);
  return res.data.data;
};
export const fetchGalleriespublic = async (): Promise<
  PaginatedResponse<Gallery>
> => {
  const res = await apiRequest.get(`/public/galleries`);
  return res.data as PaginatedResponse<Gallery>;
};
