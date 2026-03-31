// lib/hooks/useEvents.ts

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { EventType, PaginatedResponse } from "@/lib/types/eventsType";
import {
  fetchEventById,
  fetchEvents,
} from "@/lib/api/functions/public/eventsApi";

/**
 * Get paginated events
 */
export const useEvents = (page: number, per_page: number = 6) => {
  const options: UseQueryOptions<
    PaginatedResponse<EventType>,
    Error,
    PaginatedResponse<EventType>,
    [string, number]
  > = {
    queryKey: ["events", page],
    queryFn: () => fetchEvents(page, per_page),
    placeholderData: (previousData) => previousData,
  };

  return useQuery(options);
};

/**
 * Get single event
 */
export const useEvent = (id: number) =>
  useQuery<EventType, Error>({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(id),
    enabled: !!id,
  });
