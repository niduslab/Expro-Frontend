import type {
  DocumentListResponse,
  DocumentSingleResponse,
  DocumentDeleteResponse,
  DocumentIndexParams,
  DocumentStorePayload,
  DocumentUpdatePayload,
} from "@/lib/types/admin/documentType";
import apiClient from "../../axios";

// ─────────────────────────────────────────────
// GET /documents
// ─────────────────────────────────────────────
export async function fetchDocuments(
  params: DocumentIndexParams = {},
): Promise<DocumentListResponse> {
  const res = await apiClient.get<DocumentListResponse>("/public/documents", {
    params,
  });
  return res.data;
}

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
