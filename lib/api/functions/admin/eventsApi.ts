import { apiClient } from "@/lib/api/axios";
import {
  EventListResponse,
  SingleEventResponse,
  EventPayload,
  EventQueryParams,
  DeleteEventResponse,
} from "@/lib/types/admin/eventType";

/**
 * Get all events (with optional query params for filtering/search/pagination)
 */
export const fetchEvents = async (
  params?: EventQueryParams,
): Promise<EventListResponse> => {
  const { data } = await apiClient.get("/events", { params });
  return data;
};

/**
 * Get single event by ID
 */
export const fetchEventById = async (
  id: number | string,
): Promise<SingleEventResponse> => {
  const { data } = await apiClient.get(`/event/${id}`);
  return data;
};

export const createEvent = async (
  payload: EventPayload,
): Promise<SingleEventResponse> => {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("status", payload.status);
  form.append("start_date", payload.start_date);
  if (payload.project_id != null)
    form.append("project_id", String(payload.project_id));
  if (payload.description) form.append("description", payload.description);
  if (payload.location) form.append("location", payload.location);
  if (payload.end_date) form.append("end_date", payload.end_date);
  if (payload.max_attendees != null)
    form.append("max_attendees", String(payload.max_attendees));
  if (payload.registration_fee != null)
    form.append("registration_fee", String(payload.registration_fee));
  if (payload.image instanceof File) form.append("image", payload.image);

  const { data } = await apiClient.post("/event", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateEvent = async (
  id: number | string,
  payload: EventPayload,
): Promise<SingleEventResponse> => {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("status", payload.status);
  form.append("start_date", payload.start_date);
  if (payload.project_id != null)
    form.append("project_id", String(payload.project_id));
  if (payload.description) form.append("description", payload.description);
  if (payload.location) form.append("location", payload.location);
  if (payload.end_date) form.append("end_date", payload.end_date);
  if (payload.max_attendees != null)
    form.append("max_attendees", String(payload.max_attendees));
  if (payload.registration_fee != null)
    form.append("registration_fee", String(payload.registration_fee));
  if (payload.image instanceof File) form.append("image", payload.image);
  form.append("_method", "PUT");

  const { data } = await apiClient.post(`/event/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/**
 * Delete an event by ID
 */
export const deleteEvent = async (
  id: number | string,
): Promise<DeleteEventResponse> => {
  const { data } = await apiClient.delete(`/event/${id}`);
  return data;
};
