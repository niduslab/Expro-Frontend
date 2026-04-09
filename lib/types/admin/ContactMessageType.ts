/**
 * Contact Message Types
 */

export type ContactMessageStatus = "new" | "read" | "replied" | "archived";
export type ContactMessagePriority = "low" | "normal" | "high" | "urgent";

export interface ContactMessage {
  id: number;
  user_id: number | null;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  priority: ContactMessagePriority;
  assigned_to: number | null;
  admin_notes: string | null;
  read_at: string | null;
  replied_at: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessageUpdatePayload {
  user_id?: number | null;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  priority: ContactMessagePriority;
  assigned_to?: number | null;
  admin_notes?: string | null;
  read_at?: string | null;
  replied_at?: string | null;
  ip_address?: string | null;
}

/**
 * Query / Filter Parameters
 */
export interface ContactMessageFilters {
  user_id?: number;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  status?: ContactMessageStatus;
  priority?: ContactMessagePriority;
  assigned_to?: number;
  page?: number;
  per_page?: number;
}

/**
 * API Response Shapes
 */
export interface ContactMessagePagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface ContactMessageListResponse {
  success: boolean;
  message: string;
  data: ContactMessage[];
  pagination: ContactMessagePagination;
}

export interface ContactMessageSingleResponse {
  success: boolean;
  message: string;
  data: ContactMessage;
}

export interface ContactMessageDeleteResponse {
  success: boolean;
  message: string;
}

/**
 * Hook Return Shape
 */
export interface UseContactMessagesReturn {
  messages: ContactMessage[];
  pagination: ContactMessagePagination | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  filters: ContactMessageFilters;
  setFilters: (filters: Partial<ContactMessageFilters>) => void;
  resetFilters: () => void;
  refetch: () => void;
  goToPage: (page: number) => void;
}

export interface UseContactMessageReturn {
  message: ContactMessage | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseContactMessageMutationsReturn {
  update: (
    id: number,
    payload: ContactMessageUpdatePayload,
  ) => Promise<ContactMessage | null>;
  remove: (id: number) => Promise<boolean>;
  isUpdating: boolean;
  isDeleting: boolean;
  mutationError: string | null;
}
export interface ContactMessageCreatePayload {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  priority?: ContactMessagePriority;
  status?: ContactMessageStatus;
}
