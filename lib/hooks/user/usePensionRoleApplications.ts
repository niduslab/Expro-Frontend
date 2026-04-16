import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAvailableRoles,
  submitRoleApplication,
  getMyApplications,
  getApplicationDetails,
  cancelApplication,
  getMyApplicationStats,
  initiateApplicationPayment,
  createBkashPayment,
  getAllApplications,
  getAdminApplicationDetails,
  approveApplication,
  rejectApplication,
  getApplicationStats,
  bulkApproveApplications,
  bulkRejectApplications,
} from "@/lib/api/functions/user/pensionRoleApplicationApi";
import { toast } from "sonner";

// ============================================
// MEMBER HOOKS
// ============================================

/**
 * Hook to get available roles
 */
export const useAvailableRoles = () => {
  return useQuery({
    queryKey: ["available-roles"],
    queryFn: getAvailableRoles,
  });
};

/**
 * Hook to submit role application
 */
export const useSubmitRoleApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitRoleApplication,
    onSuccess: (data) => {
      toast.success(data.message || "Application submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["my-application-stats"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    },
  });
};

/**
 * Hook to get my applications
 */
export const useMyApplications = (params?: {
  per_page?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["my-applications", params],
    queryFn: () => getMyApplications(params),
  });
};

/**
 * Hook to get application details
 */
export const useApplicationDetails = (id: number) => {
  return useQuery({
    queryKey: ["application-details", id],
    queryFn: () => getApplicationDetails(id),
    enabled: !!id,
  });
};

/**
 * Hook to cancel application
 */
export const useCancelApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelApplication,
    onSuccess: (data) => {
      toast.success(data.message || "Application cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["my-application-stats"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to cancel application"
      );
    },
  });
};

/**
 * Hook to get my application stats
 */
export const useMyApplicationStats = () => {
  return useQuery({
    queryKey: ["my-application-stats"],
    queryFn: getMyApplicationStats,
  });
};

/**
 * Hook to initiate payment
 */
export const useInitiateApplicationPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initiateApplicationPayment,
    onSuccess: (data) => {
      toast.success(data.message || "Payment initiated successfully");
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to initiate payment"
      );
    },
  });
};

/**
 * Hook to create bKash payment
 */
export const useCreateBkashPayment = () => {
  return useMutation({
    mutationFn: createBkashPayment,
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create payment"
      );
    },
  });
};

// ============================================
// ADMIN HOOKS
// ============================================

/**
 * Hook to get all applications (Admin)
 */
export const useAllApplications = (params?: {
  status?: string;
  requested_role?: string;
  payment_required?: boolean;
  payment_completed?: boolean;
  search?: string;
  from_date?: string;
  to_date?: string;
  sort_by?: string;
  sort_order?: string;
  per_page?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["admin-applications", params],
    queryFn: () => getAllApplications(params),
  });
};

/**
 * Hook to get application details (Admin)
 */
export const useAdminApplicationDetails = (id: number) => {
  return useQuery({
    queryKey: ["admin-application-details", id],
    queryFn: () => getAdminApplicationDetails(id),
    enabled: !!id,
  });
};

/**
 * Hook to approve application (Admin)
 */
export const useApproveApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { review_notes?: string } }) =>
      approveApplication(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Application approved successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      queryClient.invalidateQueries({ queryKey: ["application-stats"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to approve application"
      );
    },
  });
};

/**
 * Hook to reject application (Admin)
 */
export const useRejectApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { rejection_reason: string; review_notes?: string };
    }) => rejectApplication(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Application rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      queryClient.invalidateQueries({ queryKey: ["application-stats"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to reject application"
      );
    },
  });
};

/**
 * Hook to get application stats (Admin)
 */
export const useApplicationStats = () => {
  return useQuery({
    queryKey: ["application-stats"],
    queryFn: getApplicationStats,
  });
};

/**
 * Hook to bulk approve applications (Admin)
 */
export const useBulkApproveApplications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkApproveApplications,
    onSuccess: (data) => {
      toast.success(data.message || "Applications approved successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      queryClient.invalidateQueries({ queryKey: ["application-stats"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to approve applications"
      );
    },
  });
};

/**
 * Hook to bulk reject applications (Admin)
 */
export const useBulkRejectApplications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkRejectApplications,
    onSuccess: (data) => {
      toast.success(data.message || "Applications rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      queryClient.invalidateQueries({ queryKey: ["application-stats"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to reject applications"
      );
    },
  });
};
