import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDigitalIdCard,
  getAllDigitalIdCards,
  createDigitalIdCard,
  updateDigitalIdCard,
  deleteDigitalIdCard,
} from "@/lib/api/functions/user/digitalIdCardApi";
import { toast } from "sonner";

/**
 * Hook to get digital ID card by ID
 */
export const useDigitalIdCard = (id: number) => {
  return useQuery({
    queryKey: ["digital-id-card", id],
    queryFn: () => getDigitalIdCard(id),
    enabled: !!id && id > 0,
    retry: 1,
  });
};

/**
 * Hook to get all digital ID cards (admin)
 */
export const useAllDigitalIdCards = (params?: {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["digital-id-cards", params],
    queryFn: () => getAllDigitalIdCards(params),
  });
};

/**
 * Hook to create digital ID card (admin)
 */
export const useCreateDigitalIdCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDigitalIdCard,
    onSuccess: (data) => {
      toast.success(data.message || "Digital ID card created successfully");
      queryClient.invalidateQueries({ queryKey: ["digital-id-cards"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create digital ID card"
      );
    },
  });
};

/**
 * Hook to update digital ID card (admin)
 */
export const useUpdateDigitalIdCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateDigitalIdCard(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Digital ID card updated successfully");
      queryClient.invalidateQueries({ queryKey: ["digital-id-cards"] });
      queryClient.invalidateQueries({ queryKey: ["digital-id-card"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update digital ID card"
      );
    },
  });
};

/**
 * Hook to delete digital ID card (admin)
 */
export const useDeleteDigitalIdCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDigitalIdCard,
    onSuccess: (data) => {
      toast.success(data.message || "Digital ID card deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["digital-id-cards"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete digital ID card"
      );
    },
  });
};
