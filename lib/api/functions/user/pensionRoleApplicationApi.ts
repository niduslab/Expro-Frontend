import api from "../../axios";

// ============================================
// MEMBER APIs - Pension Role Applications
// ============================================

/**
 * Check available roles that member can apply for
 */
export const getAvailableRoles = async () => {
  const response = await api.get("/pension-role-applications/available-roles");
  return response.data;
};

/**
 * Submit a new pension role application
 */
export const submitRoleApplication = async (data: {
  pension_enrollment_id: number;
  requested_role: string;
  application_reason: string;
  supporting_documents?: File[];
}) => {
  const formData = new FormData();
  formData.append("pension_enrollment_id", data.pension_enrollment_id.toString());
  formData.append("requested_role", data.requested_role);
  formData.append("application_reason", data.application_reason);

  if (data.supporting_documents && data.supporting_documents.length > 0) {
    data.supporting_documents.forEach((file) => {
      formData.append("supporting_documents[]", file);
    });
  }

  const response = await api.post("/pension-role-applications", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Get all my applications
 */
export const getMyApplications = async (params?: {
  per_page?: number;
  page?: number;
}) => {
  const response = await api.get("/pension-role-applications", { params });
  return response.data;
};

/**
 * Get specific application details
 */
export const getApplicationDetails = async (id: number) => {
  const response = await api.get(`/pension-role-applications/${id}`);
  return response.data;
};

/**
 * Cancel an application
 */
export const cancelApplication = async (id: number) => {
  const response = await api.post(`/pension-role-applications/${id}/cancel`);
  return response.data;
};

/**
 * Get my application statistics
 */
export const getMyApplicationStats = async () => {
  const response = await api.get("/pension-role-applications/my-stats");
  return response.data;
};

/**
 * Initiate payment for executive member application
 */
export const initiateApplicationPayment = async (applicationId: number) => {
  const response = await api.post(
    `/pension-role-applications/${applicationId}/initiate-payment`
  );
  return response.data;
};

/**
 * Create bKash payment for pension role application
 */
export const createBkashPayment = async (data: {
  amount: number;
  payment_type: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  reference_id?: number;
}) => {
  const response = await api.post("/bkash/create-payment", data);
  return response.data;
};

// ============================================
// ADMIN APIs - Pension Role Applications
// ============================================

/**
 * Get all applications (Admin)
 */
export const getAllApplications = async (params?: {
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
  const response = await api.get("/admin/pension-role-applications", { params });
  return response.data;
};

/**
 * Get application details (Admin)
 */
export const getAdminApplicationDetails = async (id: number) => {
  const response = await api.get(`/admin/pension-role-applications/${id}`);
  return response.data;
};

/**
 * Approve application (Admin)
 */
export const approveApplication = async (
  id: number,
  data: { review_notes?: string }
) => {
  const response = await api.post(
    `/admin/pension-role-applications/${id}/approve`,
    data
  );
  return response.data;
};

/**
 * Reject application (Admin)
 */
export const rejectApplication = async (
  id: number,
  data: { rejection_reason: string; review_notes?: string }
) => {
  const response = await api.post(
    `/admin/pension-role-applications/${id}/reject`,
    data
  );
  return response.data;
};

/**
 * Get application statistics (Admin)
 */
export const getApplicationStats = async () => {
  const response = await api.get("/admin/pension-role-applications/stats");
  return response.data;
};

/**
 * Bulk approve applications (Admin)
 */
export const bulkApproveApplications = async (data: {
  application_ids: number[];
  review_notes?: string;
}) => {
  const response = await api.post(
    "/admin/pension-role-applications/bulk-approve",
    data
  );
  return response.data;
};

/**
 * Bulk reject applications (Admin)
 */
export const bulkRejectApplications = async (data: {
  application_ids: number[];
  rejection_reason: string;
  review_notes?: string;
}) => {
  const response = await api.post(
    "/admin/pension-role-applications/bulk-reject",
    data
  );
  return response.data;
};
