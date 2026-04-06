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

// ─────────────────────────────────────────────
// GET /documents/:id
// ─────────────────────────────────────────────
export async function fetchDocument(
  id: number,
): Promise<DocumentSingleResponse> {
  const res = await apiClient.get<DocumentSingleResponse>(
    `/public/documents/${id}`,
  );
  return res.data;
}

// ─────────────────────────────────────────────
// POST /documents
// ─────────────────────────────────────────────
export async function createDocument(
  payload: DocumentStorePayload,
): Promise<DocumentSingleResponse> {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("type", payload.type);
  formData.append("file", payload.file);
  if (payload.description) formData.append("description", payload.description);
  if (payload.publish_date)
    formData.append("publish_date", payload.publish_date);
  if (payload.is_featured !== undefined)
    formData.append("is_featured", payload.is_featured ? "1" : "0");
  if (payload.display_order !== undefined)
    formData.append("display_order", String(payload.display_order));
  if (payload.status) formData.append("status", payload.status);

  const res = await apiClient.post<DocumentSingleResponse>(
    "/documents",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data;
}

// ─────────────────────────────────────────────
// POST /documents/:id  (Laravel FormData PATCH)
// ─────────────────────────────────────────────
export async function updateDocument(
  id: number,
  payload: DocumentUpdatePayload,
): Promise<DocumentSingleResponse> {
  const formData = new FormData();
  formData.append("_method", "PATCH");
  formData.append("name", payload.name);
  formData.append("type", payload.type);
  if (payload.file) formData.append("file", payload.file);
  if (payload.description) formData.append("description", payload.description);
  if (payload.publish_date)
    formData.append("publish_date", payload.publish_date);
  if (payload.is_featured !== undefined)
    formData.append("is_featured", payload.is_featured ? "1" : "0");
  if (payload.display_order !== undefined)
    formData.append("display_order", String(payload.display_order));
  if (payload.status) formData.append("status", payload.status);

  const res = await apiClient.post<DocumentSingleResponse>(
    `/documents/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data;
}

// ─────────────────────────────────────────────
// DELETE /documents/:id
// ─────────────────────────────────────────────
export async function deleteDocument(
  id: number,
): Promise<DocumentDeleteResponse> {
  const res = await apiClient.delete<DocumentDeleteResponse>(
    `/documents/${id}`,
  );
  return res.data;
}

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
