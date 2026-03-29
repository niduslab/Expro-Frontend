import { fetchMyProfile } from "@/lib/api/functions/admin/memberProfileApi";
import { ProfileData } from "@/lib/types/admin/memberProfileType";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useMyProfile = (options?: UseQueryOptions<ProfileData, Error>) => {
  return useQuery<ProfileData, Error>({
    queryKey: ["my-profile"],
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...options,
  });
};
