import { apiClient } from "@/lib/api/axios";
import {
  EventType,
  PaginatedResponse,
  ApiResponseWithPagination,
} from "@/lib/types/eventsType";

export const fetchEvents = async (
  page = 1,
  per_page = 10,
  status?: string, // 1. Add this optional parameter
): Promise<PaginatedResponse<EventType>> => {
  // 2. Build query params dynamically
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
  });

  if (status) {
    params.append("status", status);
  }

  // 3. Use the constructed params string
  const res = await apiClient.get<ApiResponseWithPagination<EventType>>(
    `/public/events?${params.toString()}`,
  );

  const { data, pagination } = res.data;

  return { data, pagination };
};

export const fetchEventById = async (id: number): Promise<EventType> => {
  const res = await apiClient.get<{
    success: boolean;
    message: string;
    data: EventType;
  }>(`/public/event/${id}`);

  return res.data.data;
};
