import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  getProjectById,
} from "@/lib/api/functions/admin/projectsApi";
import {
  CreateProjectPayload,
  UpdateProjectPayload,
} from "@/lib/types/projectType";
import { toast } from "sonner";

export const useProjects = (params?: {
  page?: number;
  per_page?: number;
  status?: string;
  category?: string;
}) => {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => getProjects(params),
  });
};

export const useProject = (id: number) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
};
export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => toast.error("Failed to create project"),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateProjectPayload;
    }) => updateProject(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["project", id] });
    },
    onError: () => toast.error("Failed to update project"),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
    },
    onError: () => toast.error("Failed to delete project"),
  });
};
