import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyMembershipFees,
  getUpcomingMembershipFees,
  payMembershipFee,
  PayMembershipFeeRequest,
} from "@/lib/api/functions/membershipFee";

export const useMyMembershipFees = () => {
  return useQuery({
    queryKey: ["my-membership-fees"],
    queryFn: getMyMembershipFees,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpcomingMembershipFees = () => {
  return useQuery({
    queryKey: ["upcoming-membership-fees"],
    queryFn: getUpcomingMembershipFees,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const usePayMembershipFee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PayMembershipFeeRequest) => payMembershipFee(data),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["my-membership-fees"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-membership-fees"] });
      queryClient.invalidateQueries({ queryKey: ["my-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
    },
  });
};
