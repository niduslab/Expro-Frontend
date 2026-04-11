import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { EventType, PaginatedResponse } from "@/lib/types/eventsType";
import {
  fetchEventById,
  fetchEvents,
} from "@/lib/api/functions/public/eventsApi";

/**
 * Get paginated events
 */
export const useEvents = (
  page: number,
  per_page: number = 6,
  status?: string,
) => {
  const options: UseQueryOptions<
    PaginatedResponse<EventType>,
    Error,
    PaginatedResponse<EventType>,
    [string, number, number, string | undefined] // 1. Updated Key Type: [key, page, per_page, status]
  > = {
    // 2. Updated Key Array to match the type above
    queryKey: ["events", page, per_page, status],
    queryFn: () => fetchEvents(page, per_page, status),
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
