// lib/api/functions/public/events.ts

import { apiClient } from "@/lib/api/axios";
import { EventType, PaginatedResponse } from "@/lib/types/eventsType";
import { ApiResponseWithPagination } from "@/lib/types/eventsType";

export const fetchEvents = async (
  page = 1,
  per_page = 10,
): Promise<PaginatedResponse<EventType>> => {
  const res = await apiClient.get<ApiResponseWithPagination<EventType>>(
    `/public/events?page=${page}&per_page=${per_page}`,
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
