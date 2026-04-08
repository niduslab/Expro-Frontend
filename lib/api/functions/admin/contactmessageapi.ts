import type {
  ContactMessageFilters,
  ContactMessageListResponse,
  ContactMessageSingleResponse,
  ContactMessageDeleteResponse,
  ContactMessageUpdatePayload,
  ContactMessage,
  ContactMessageCreatePayload,
} from "@/lib/types/admin/ContactMessageType";
import apiClient from "../../axios";

const BASE_URL = "/contactmessage";

/**
 * Build a clean query-string object from filters,
 * stripping undefined / empty-string values.
 */
const buildParams = (
  filters: ContactMessageFilters,
): Record<string, string | number> => {
  const params: Record<string, string | number> = {};

  if (filters.user_id !== undefined) params.user_id = filters.user_id;
  if (filters.name) params.name = filters.name;
  if (filters.email) params.email = filters.email;
  if (filters.phone) params.phone = filters.phone;
  if (filters.subject) params.subject = filters.subject;
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.assigned_to !== undefined)
    params.assigned_to = filters.assigned_to;
  if (filters.page !== undefined) params.page = filters.page;
  if (filters.per_page !== undefined) params.per_page = filters.per_page;

  return params;
};

/**
 * Fetch a paginated list of contact messages.
 *
 * @example
 * const data = await fetchContactMessages({ status: "new", page: 1 });
 */
export const fetchContactMessages = async (
  filters: ContactMessageFilters = {},
): Promise<ContactMessageListResponse> => {
  const { data } = await apiClient.get<ContactMessageListResponse>(
    `${BASE_URL}s`,
    { params: buildParams(filters) },
  );
  return data;
};

/**
 * Fetch a single contact message by ID.
 *
 * @example
 * const message = await fetchContactMessageById(12);
 */
export const fetchContactMessageById = async (
  id: number,
): Promise<ContactMessage> => {
  const { data } = await apiClient.get<ContactMessageSingleResponse>(
    `${BASE_URL}/${id}`,
  );
  return data.data;
};

/**
 * Update a contact message by ID.
 *
 * @example
 * const updated = await updateContactMessage(12, { status: "replied", ... });
 */
export const updateContactMessage = async (
  id: number,
  payload: ContactMessageUpdatePayload,
): Promise<ContactMessage> => {
  const { data } = await apiClient.put<ContactMessageSingleResponse>(
    `${BASE_URL}/${id}`,
    payload,
  );
  return data.data;
};

/**
 * Delete a contact message by ID.
 *
 * @example
 * const result = await deleteContactMessage(12);
 */
export const deleteContactMessage = async (
  id: number,
): Promise<ContactMessageDeleteResponse> => {
  const { data } = await apiClient.delete<ContactMessageDeleteResponse>(
    `${BASE_URL}/${id}`,
  );
  return data;
};

/**
 * Fetch all messages filtered by status.
 *
 * @example
 * const data = await fetchContactMessagesByStatus("new");
 */
export const fetchContactMessagesByStatus = async (
  status: ContactMessageFilters["status"],
  extra: Omit<ContactMessageFilters, "status"> = {},
): Promise<ContactMessageListResponse> => {
  return fetchContactMessages({ ...extra, status });
};

/**
 * Fetch all messages filtered by priority.
 *
 * @example
 * const data = await fetchContactMessagesByPriority("urgent");
 */
export const fetchContactMessagesByPriority = async (
  priority: ContactMessageFilters["priority"],
  extra: Omit<ContactMessageFilters, "priority"> = {},
): Promise<ContactMessageListResponse> => {
  return fetchContactMessages({ ...extra, priority });
};

/**
 * Fetch all messages assigned to a specific user.
 *
 * @example
 * const data = await fetchContactMessagesByAssignee(5);
 */
export const fetchContactMessagesByAssignee = async (
  assignedTo: number,
  extra: Omit<ContactMessageFilters, "assigned_to"> = {},
): Promise<ContactMessageListResponse> => {
  return fetchContactMessages({ ...extra, assigned_to: assignedTo });
};
/**
 * Create a new contact message (public endpoint).
 *
 * @example
 * const created = await createContactMessage({ name: "John", email: "john@example.com", ... });
 */
export const createContactMessage = async (
  payload: ContactMessageCreatePayload,
): Promise<ContactMessage> => {
  const { data } = await apiClient.post<ContactMessageSingleResponse>(
    `public${BASE_URL}`,
    payload,
  );
  return data.data;
};
