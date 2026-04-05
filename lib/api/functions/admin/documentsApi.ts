import { apiClient } from "@/lib/api/axios";
import type {
  Document,
  DocumentListResponse,
  DocumentSingleResponse,
  DocumentDeleteResponse,
  DocumentStorePayload,
  DocumentUpdatePayload,
  DocumentIndexParams,
  DocumentByTypeParams,
} from "@/lib/types/admin/documentType";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function toFormData(
  payload: DocumentStorePayload | DocumentUpdatePayload,
): FormData {
  const form = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;

    if (value instanceof File) {
      form.append(key, value);
    } else if (typeof value === "boolean") {
      form.append(key, value ? "1" : "0");
    } else {
      form.append(key, String(value));
    }
  }

  return form;
}

// ─────────────────────────────────────────────
// Document API
// ─────────────────────────────────────────────

/**
 * Get all documents with optional filters, search, sorting, and pagination
 */
export const fetchDocuments = async (
  params?: DocumentIndexParams,
): Promise<DocumentListResponse> => {
  const { data } = await apiClient.get("/documents", { params });
  return data;
};

/**
 * Get a single document by ID (also increments view_count)
 */
export const fetchDocumentById = async (
  id: number | string,
): Promise<DocumentSingleResponse> => {
  const { data } = await apiClient.get(`/documents/${id}`);
  return data;
};

/**
 * Get active documents filtered by type (public endpoint)
 */
export const fetchDocumentsByType = async (
  type: Document["type"],
  params?: DocumentByTypeParams,
): Promise<DocumentListResponse> => {
  const { data } = await apiClient.get(`/documents/type/${type}`, { params });
  return data;
};

/**
 * Get featured active documents (public endpoint, max 10)
 */
export const fetchFeaturedDocuments = async (): Promise<{
  success: boolean;
  data: Document[];
}> => {
  const { data } = await apiClient.get("/documents/featured");
  return data;
};

/**
 * Upload a new document (multipart/form-data)
 * Fixed: was POST /document (singular) → now POST /documents (plural)
 */
export const createDocument = async (
  payload: DocumentStorePayload,
): Promise<DocumentSingleResponse> => {
  const { data } = await apiClient.post("/document", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/**
 * Update an existing document.
 * Uses _method spoofing for multipart PUT (Laravel requirement).
 * Fixed: was POST /document/:id (singular) → now POST /documents/:id (plural)
 */
export const updateDocument = async (
  id: number | string,
  payload: DocumentUpdatePayload,
): Promise<DocumentSingleResponse> => {
  const form = toFormData(payload);
  form.append("_method", "PUT");

  const { data } = await apiClient.post(`/document/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/**
 * Soft-delete a document and remove its file from storage
 * Fixed: was DELETE /document/:id (singular) → now DELETE /documents/:id (plural)
 */
export const deleteDocument = async (
  id: number | string,
): Promise<DocumentDeleteResponse> => {
  const { data } = await apiClient.delete(`/document/${id}`);
  return data;
};

/**
 * Download a document file (increments download_count).
 * Triggers a native browser file download.
 */
export const downloadDocument = async (
  id: number | string,
  fileName: string,
): Promise<void> => {
  const response = await apiClient.get(`/documents/${id}/download`, {
    responseType: "blob",
  });

  const url = URL.createObjectURL(new Blob([response.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
