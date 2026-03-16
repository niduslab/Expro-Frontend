import { useQuery, useMutation } from "@tanstack/react-query";
import { queryKeys, invalidateQueries } from "../../BaseApi";
import {
  addDonation,
  deleteDonation,
  fetchDonationByID,
  fetchDonations,
  updateDonation,
} from "../../apifunctions/Donation/DonationFunction";
import { UpdateDonationInput } from "@/app/tanstack/types/DonationType";

// ---------------------------
// Queries
// ---------------------------
export const useDonations = () => {
  return useQuery({
    queryKey: queryKeys.donation(),
    queryFn: fetchDonations,
  });
};

export const useDonationByID = (id: number) => {
  return useQuery({
    queryKey: queryKeys.donation(id),
    queryFn: () => fetchDonationByID(id),
  });
};
export const useAddDonation = () => {
  return useMutation({
    mutationFn: addDonation,
    onSuccess: () => {
      invalidateQueries("donation");
    },
  });
};
export const useUpdateDonation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDonationInput }) =>
      updateDonation(id, data),

    onSuccess: (_, variables) => {
      invalidateQueries("donation");
      invalidateQueries("donation", variables.id);
    },
  });
};
export const useDeleteDonation = () => {
  return useMutation({
    mutationFn: deleteDonation,
    onSuccess: (_, id) => {
      invalidateQueries("donation"); // refresh list
      invalidateQueries("donation", id); // refresh single item
    },
  });
};
