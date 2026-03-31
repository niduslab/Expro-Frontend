import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchProjectById,
  fetchProjects,
} from "@/lib/api/functions/public/projectsApi";
import { Project, PaginatedResponse } from "@/lib/types/projectType";

export const useProjects = (page: number, per_page: number) => {
  const options: UseQueryOptions<
    PaginatedResponse<Project>, // data returned by queryFn
    Error, // error type
    PaginatedResponse<Project>, // data type for select/return
    [string, number] // query key tuple type
  > = {
    queryKey: ["projects", page],
    queryFn: () => fetchProjects(page, per_page),
    placeholderData: (previousData) => previousData,
  };

  return useQuery(options);
};
export const useProject = (id: number) =>
  useQuery<Project, Error>({
    queryKey: ["project", id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id,
  });
