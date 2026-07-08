import { useMutation } from "@tanstack/react-query";
import { createMemberByAdmin, AdminCreateMemberInput } from "@/lib/api/functions/admin/adminMembershipApi";

export const useCreateMemberByAdmin = () => {
  return useMutation({
    mutationFn: (payload: AdminCreateMemberInput) =>
      createMemberByAdmin(payload),
  });
};
