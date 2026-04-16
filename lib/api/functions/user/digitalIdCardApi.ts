import api from "@/lib/api/axios";

/**
 * Get digital ID card by ID
 */
export const getDigitalIdCard = async (id: number) => {
  const response = await api.get(`/digitalidcard/${id}`);
  return response.data;
};

/**
 * List all digital ID cards (admin)
 */
export const getAllDigitalIdCards = async (params?: {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}) => {
  const response = await api.get("/digitalidcards", { params });
  return response.data;
};

/**
 * Create digital ID card (admin)
 */
export const createDigitalIdCard = async (data: {
  user_id: number;
  card_number: string;
  issue_date: string;
  expiry_date: string;
  status: string;
  qr_code?: string;
}) => {
  const response = await api.post("/digitalidcard", data);
  return response.data;
};

/**
 * Update digital ID card (admin)
 */
export const updateDigitalIdCard = async (id: number, data: {
  status?: string;
  expiry_date?: string;
  card_number?: string;
  qr_code?: string;
}) => {
  const response = await api.put(`/digitalidcard/${id}`, data);
  return response.data;
};

/**
 * Delete digital ID card (admin)
 */
export const deleteDigitalIdCard = async (id: number) => {
  const response = await api.delete(`/digitalidcard/${id}`);
  return response.data;
};
