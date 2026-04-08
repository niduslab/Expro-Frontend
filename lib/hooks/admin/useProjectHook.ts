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
import { apiRequest, ApiResponse } from "@/lib/api/axios";
import { AxiosError } from "axios";

// In useProjectHook.ts — update the params type
export const useProjects = (params?: {
  page?: number;
  per_page?: number;
  status?: string;
  category?: string;
  q?: string; // ← add this
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
    onMutate: () => {
      toast.loading("Creating project...", { id: "create-project" });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success(`"${data.title}" created successfully`, {
        id: "create-project",
      });
    },
    onError: () => {
      toast.error("Failed to create project", { id: "create-project" });
    },
    onSettled: () => {
      toast.dismiss("create-project");
    },
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

/**
 * Pension Enrollment Promotion/Demotion Types
 */
export interface PromotePensionEnrollmentParams {
  enrollmentId: number;
  role: 'executive_member' | 'project_presenter' | 'assistant_pp';
  payment_id?: number; // Required for executive_member
  notes?: string;
}

export interface DemotePensionEnrollmentParams {
  enrollmentId: number;
  reason: string;
}

/**
 * Hook: Get Members by Role in Pension Package
 * 
 * @param packageId - Pension package ID
 * @returns React Query result with members by role
 */
export const usePensionPackageMembersByRole = (packageId: number) => {
  return useQuery({
    queryKey: ['pension-package-members-by-role', packageId],
    queryFn: async () => {
      const response = await apiRequest.get<any>(
        `/pension-package/${packageId}/members-by-role`
      );
      return response.data;
    },
    enabled: !!packageId,
  });
};

/**
 * Hook: Get Role History for Pension Enrollment
 * 
 * @param enrollmentId - Pension enrollment ID
 * @returns React Query result with role history
 */
export const usePensionEnrollmentRoleHistory = (enrollmentId: number) => {
  return useQuery({
    queryKey: ['pension-enrollment-role-history', enrollmentId],
    queryFn: async () => {
      const response = await apiRequest.get<any>(
        `/pension-enrollment/${enrollmentId}/role-history`
      );
      return response.data;
    },
    enabled: !!enrollmentId,
  });
};

/**
 * Hook: Get Current Role for Pension Enrollment
 * 
 * @param enrollmentId - Pension enrollment ID
 * @returns React Query result with current role
 */
export const usePensionEnrollmentCurrentRole = (enrollmentId: number) => {
  return useQuery({
    queryKey: ['pension-enrollment-current-role', enrollmentId],
    queryFn: async () => {
      const response = await apiRequest.get<any>(
        `/pension-enrollment/${enrollmentId}/current-role`
      );
      return response.data;
    },
    enabled: !!enrollmentId,
  });
};

/**
 * Hook: Promote Member in Pension Enrollment
 * Promotes a member to executive_member, project_presenter, or assistant_pp
 * 
 * @returns React Query mutation for promoting member
 * 
 * @example
 * const { mutate } = usePromotePensionEnrollment();
 * 
 * // Promote to Executive Member
 * mutate({ enrollmentId: 1, role: 'executive_member', payment_id: 123, notes: 'Promoted' });
 */
export const usePromotePensionEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<any>,
    AxiosError,
    PromotePensionEnrollmentParams
  >({
    mutationFn: async ({ enrollmentId, role, payment_id, notes }) => {
      const payload: any = { role };
      
      if (payment_id) {
        payload.payment_id = payment_id;
      }

      if (notes) {
        payload.notes = notes;
      }

      const response = await apiRequest.post<any>(
        `/pension-enrollment/${enrollmentId}/promote`,
        payload
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['pension-enrollment-current-role', variables.enrollmentId] });
      queryClient.invalidateQueries({ queryKey: ['pension-enrollment-role-history', variables.enrollmentId] });
    },
  });
};

/**
 * Hook: Demote Member in Pension Enrollment
 * Demotes a member to general_member
 * 
 * @returns React Query mutation for demoting member
 * 
 * @example
 * const { mutate } = useDemotePensionEnrollment();
 * 
 * mutate({ enrollmentId: 1, reason: 'Performance issues' });
 */
export const useDemotePensionEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<any>,
    AxiosError,
    DemotePensionEnrollmentParams
  >({
    mutationFn: async ({ enrollmentId, reason }) => {
      const response = await apiRequest.post<any>(
        `/pension-enrollment/${enrollmentId}/demote`,
        { reason }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['pension-enrollment-current-role', variables.enrollmentId] });
      queryClient.invalidateQueries({ queryKey: ['pension-enrollment-role-history', variables.enrollmentId] });
    },
  });
};
