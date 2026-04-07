// ─────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────

export type DocumentType =
  | "profile"
  | "awards"
  | "annual_reports"
  | "rules"
  | "organogram"
  | "magazine"
  | "calendar"
  | "notice"
  | "other";

export type DocumentStatus = "active" | "inactive" | "archived";

// ─────────────────────────────────────────────
// Core Models
// ─────────────────────────────────────────────
export interface SaveResult {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}
export interface DocumentUploader {
  id: number;
  email: string;
  name: string;
}

export interface Document {
  id: number;
  name: string;
  description: string | null;
  type: DocumentType;
  type_label: string;

  // File
  file_name: string;
  file_url: string;
  file_size: number;
  file_size_formatted: string;
  mime_type: string;

  // Metadata
  download_count: number;
  view_count: number;
  publish_date: string | null; // 'YYYY-MM-DD'
  is_featured: boolean;
  display_order: number;

  // Status
  status: DocumentStatus;
  status_label: string;

  // Relations
  uploaded_by: DocumentUploader;
  updated_by: DocumentUploader | null;

  // Timestamps
  created_at: string; // 'YYYY-MM-DD HH:mm:ss'
  updated_at: string;
}

// ─────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ─────────────────────────────────────────────
// API Responses
// ─────────────────────────────────────────────

export interface DocumentListResponse {
  success: boolean;
  data: Document[];
  pagination: PaginationMeta;
}

export interface DocumentSingleResponse {
  success: boolean;
  data: Document;
}

export interface DocumentDeleteResponse {
  success: boolean;
  message: string;
}

export interface DocumentErrorResponse {
  success: false;
  message: string;
  error?: string;
}

// ─────────────────────────────────────────────
// Request Payloads
// ─────────────────────────────────────────────

export interface DocumentStorePayload {
  name: string;
  description?: string;
  type: DocumentType;
  file: File;
  publish_date?: string; // 'YYYY-MM-DD'
  is_featured?: boolean;
  display_order?: number;
  status?: DocumentStatus;
}

export interface DocumentUpdatePayload {
  name: string;
  description?: string;
  type: DocumentType;
  file?: File; // optional on update
  publish_date?: string;
  is_featured?: boolean;
  display_order?: number;
  status?: DocumentStatus;
}

// ─────────────────────────────────────────────
// Query / Filter Params
// ─────────────────────────────────────────────

export interface DocumentIndexParams {
  type?: DocumentType;
  status?: DocumentStatus;
  is_featured?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface DocumentByTypeParams {
  per_page?: number;
  page?: number;
}

// ─────────────────────────────────────────────
// Hook State
// ─────────────────────────────────────────────

export interface UseDocumentsState {
  documents: Document[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseDocumentState {
  document: Document | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseMutationState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}
