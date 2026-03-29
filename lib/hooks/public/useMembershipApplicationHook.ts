import { useMutation } from "@tanstack/react-query";
import { createMembershipApplication } from "@/lib/api/functions/public/membershipApplicationApi";
import { CreateMembershipApplicationInput } from "@/lib/types/membershipApplication";

export const useCreateMembershipApplication = () => {
  return useMutation({
    mutationFn: (payload: CreateMembershipApplicationInput) =>
      createMembershipApplication(payload),
  });
};
