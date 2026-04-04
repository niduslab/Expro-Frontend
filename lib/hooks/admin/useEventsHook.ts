import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  fetchEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/api/functions/admin/eventsApi";
import {
  EventListResponse,
  SingleEventResponse,
  EventPayload,
  EventQueryParams,
  DeleteEventResponse,
} from "@/lib/types//admin/eventType";

// ─── Query Keys ────────────────────────────────────────────────
export const eventKeys = {
  all: ["events"] as const,
  detail: (id: number | string) => ["event", id] as const,
};

// ─── Queries ────────────────────────────────────────────────────

export const useEvents = (
  params?: EventQueryParams,
  options?: UseQueryOptions<EventListResponse, Error>,
) => {
  return useQuery({
    queryKey: [...eventKeys.all, params],
    queryFn: () => fetchEvents(params),
    ...options,
  });
};

export const useEvent = (
  id: number | string,
  options?: UseQueryOptions<SingleEventResponse, Error>,
) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => fetchEventById(id),
    enabled: !!id,
    ...options,
  });
};

// ─── Mutations ──────────────────────────────────────────────────

type CreateEventOptions = UseMutationOptions<
  SingleEventResponse,
  Error,
  EventPayload,
  void
>;

export const useCreateEvent = (options?: CreateEventOptions) => {
  const queryClient = useQueryClient();

  return useMutation<SingleEventResponse, Error, EventPayload, void>({
    mutationFn: (payload) => createEvent(payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

type UpdateEventOptions = UseMutationOptions<
  SingleEventResponse,
  Error,
  EventPayload,
  void
>;

export const useUpdateEvent = (
  id: number | string,
  options?: UpdateEventOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation<SingleEventResponse, Error, EventPayload, void>({
    mutationFn: (payload) => updateEvent(id, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

type DeleteEventOptions = UseMutationOptions<
  DeleteEventResponse,
  Error,
  number | string,
  void
>;

export const useDeleteEvent = (options?: DeleteEventOptions) => {
  const queryClient = useQueryClient();

  return useMutation<DeleteEventResponse, Error, number | string, void>({
    mutationFn: (id) => deleteEvent(id),
    ...options,
    onSuccess: (data, id, onMutateResult, context) => {
      queryClient.removeQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      options?.onSuccess?.(data, id, onMutateResult, context);
    },
  });
};
