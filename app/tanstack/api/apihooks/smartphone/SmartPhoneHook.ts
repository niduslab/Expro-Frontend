import { useQuery, useMutation } from "@tanstack/react-query";
import { queryKeys, invalidateQueries } from "../../BaseApi";
import {
  addSmartphone,
  fetchSmartphoneById,
  fetchSmartphones,
  updateSmartphone,
  deleteSmartphone,
} from "../../apifunctions/smartphone/SmartPhoneFunction";

// ---------------------------
// Queries
// ---------------------------
export const useSmartphones = () => {
  return useQuery({
    queryKey: queryKeys.smartphone(),
    queryFn: fetchSmartphones,
  });
};

export const useSmartphone = (id: number) => {
  return useQuery({
    queryKey: queryKeys.smartphone(id),
    queryFn: () => fetchSmartphoneById(id),
  });
};
export const useAddSmartphone = () => {
  return useMutation({
    mutationFn: addSmartphone,
    onSuccess: () => {
      invalidateQueries("smartphone");
    },
  });
};
export const useUpdateSmartphone = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { name?: string; brand?: string };
    }) => updateSmartphone(id, data),
    onSuccess: (_, variables) => {
      invalidateQueries("smartphone");
      invalidateQueries("smartphone", variables.id);
    },
  });
};
export const useDeleteSmartphone = () => {
  return useMutation({
    mutationFn: deleteSmartphone,
    onSuccess: (_, id) => {
      invalidateQueries("smartphone"); // refresh list
      invalidateQueries("smartphone", id); // refresh single item
    },
  });
};
