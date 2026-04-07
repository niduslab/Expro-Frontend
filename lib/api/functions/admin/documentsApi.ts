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
// GET /documents
// ─────────────────────────────────────────────
export const fetchDocuments = async (
  params?: DocumentIndexParams,
): Promise<DocumentListResponse> => {
  const { data } = await apiClient.get("/documents", { params });
  return data;
};

// ─────────────────────────────────────────────
// GET /documents/:id
// ─────────────────────────────────────────────
export async function fetchDocument(
  id: number,
): Promise<DocumentSingleResponse> {
  const res = await apiClient.get<DocumentSingleResponse>(`/documents/${id}`);
  return res.data;
}

// ─────────────────────────────────────────────
// GET /documents/:id  (alias — increments view_count)
// ─────────────────────────────────────────────
export const fetchDocumentById = async (
  id: number | string,
): Promise<DocumentSingleResponse> => {
  const { data } = await apiClient.get(`/documents/${id}`);
  return data;
};

// ─────────────────────────────────────────────
// GET /documents/type/:type
// ─────────────────────────────────────────────
export const fetchDocumentsByType = async (
  type: Document["type"],
  params?: DocumentByTypeParams,
): Promise<DocumentListResponse> => {
  const { data } = await apiClient.get(`/documents/type/${type}`, { params });
  return data;
};

// ─────────────────────────────────────────────
// GET /documents/featured
// ─────────────────────────────────────────────
export const fetchFeaturedDocuments = async (): Promise<{
  success: boolean;
  data: Document[];
}> => {
  const { data } = await apiClient.get("/documents/featured");
  return data;
};

// ─────────────────────────────────────────────
// POST /document  (store — singular route)
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
    "/document", // ← singular
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data;
}

// ─────────────────────────────────────────────
// PUT /document/:id  (update — singular route, true PUT)
// ─────────────────────────────────────────────
export async function updateDocument(
  id: number,
  payload: DocumentUpdatePayload,
): Promise<DocumentSingleResponse> {
  const formData = new FormData();
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
    `/document/${id}`, // ← singular
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-HTTP-Method-Override": "PUT", // ← PUT override header
      },
      params: { _method: "PUT" }, // ← Laravel query-string fallback
    },
  );
  return res.data;
}

// ─────────────────────────────────────────────
// DELETE /document/:id  (singular route)
// ─────────────────────────────────────────────
export async function deleteDocument(
  id: number,
): Promise<DocumentDeleteResponse> {
  const res = await apiClient.delete<DocumentDeleteResponse>(`/document/${id}`); // ← singular
  return res.data;
}

// ─────────────────────────────────────────────
// GET /documents/:id/download
// ─────────────────────────────────────────────
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
