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

/**
 * Create a new event
 */
export const createEvent = async (
  payload: EventPayload,
): Promise<SingleEventResponse> => {
  const { data } = await apiClient.post("/event", payload);
  return data;
};

/**
 * Update an existing event
 */
export const updateEvent = async (
  id: number | string,
  payload: EventPayload,
): Promise<SingleEventResponse> => {
  const { data } = await apiClient.put(`/event/${id}`, payload);
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
