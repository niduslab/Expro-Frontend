import { updateMyProfile } from "@/lib/api/functions/admin/myMemberProfileApi";
import { MemberProfile } from "@/lib/types/admin/memberType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateMyProfile = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<MemberProfile>) =>
      updateMyProfile(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
  });
};
