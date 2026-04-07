import type {
  DocumentListResponse,
  DocumentSingleResponse,
  DocumentIndexParams,
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
export const downloadDocument = async (
  id: number | string,
  fileName: string,
): Promise<void> => {
  const response = await apiClient.get(`/public/documents/${id}/download`, {
    responseType: "blob", // important for binary
  });

  // Create a download link
  const blobUrl = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link); // required for Firefox
  link.click();
  document.body.removeChild(link); // clean up
  URL.revokeObjectURL(blobUrl); // free memory
};
