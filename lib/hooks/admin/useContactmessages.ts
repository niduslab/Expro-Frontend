import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchContactMessages,
  fetchContactMessageById,
  updateContactMessage,
  deleteContactMessage,
  createContactMessage,
} from "@/lib/api/functions/admin/contactmessageapi";
import type {
  ContactMessage,
  ContactMessageFilters,
  ContactMessagePagination,
  ContactMessageUpdatePayload,
  UseContactMessagesReturn,
  UseContactMessageReturn,
  UseContactMessageMutationsReturn,
  ContactMessageCreatePayload,
} from "@/lib/types/admin/ContactMessageType";

const DEFAULT_FILTERS: ContactMessageFilters = {
  page: 1,
  per_page: 15,
};

// ============================================================
// useContactMessages
// ============================================================

/**
 * Fetches a paginated, filterable list of contact messages.
 *
 * @example
 * const {
 *   messages, pagination, isLoading, isError, error,
 *   filters, setFilters, resetFilters, refetch, goToPage,
 * } = useContactMessages({ status: "new", per_page: 20 });
 */
export const useContactMessages = (
  initialFilters: ContactMessageFilters = {},
): UseContactMessagesReturn => {
  const [filters, setFiltersState] = useState<ContactMessageFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [pagination, setPagination] = useState<ContactMessagePagination | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (currentFilters: ContactMessageFilters) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await fetchContactMessages(currentFilters);
      setMessages(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
      setIsError(true);
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Failed to fetch contact messages.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [filters, load]);

  const setFilters = useCallback((partial: Partial<ContactMessageFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...partial,
      page: partial.page ?? 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState({ ...DEFAULT_FILTERS, ...initialFilters });
  }, [initialFilters]);

  const goToPage = useCallback((page: number) => {
    setFiltersState((prev) => ({ ...prev, page }));
  }, []);

  const refetch = useCallback(() => {
    load(filters);
  }, [load, filters]);

  return {
    messages,
    pagination,
    isLoading,
    isError,
    error,
    filters,
    setFilters,
    resetFilters,
    refetch,
    goToPage,
  };
};

// ============================================================
// useContactMessage  (single record)
// ============================================================

/**
 * Fetches a single contact message by ID.
 *
 * @example
 * const { message, isLoading, isError, error, refetch } = useContactMessage(12);
 */
export const useContactMessage = (id: number): UseContactMessageReturn => {
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const data = await fetchContactMessageById(id);
      setMessage(data);
    } catch (err: any) {
      setIsError(true);
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Failed to fetch contact message.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    message,
    isLoading,
    isError,
    error,
    refetch: load,
  };
};

// ============================================================
// useContactMessageMutations  (update + delete)
// ============================================================

/**
 * Provides update and delete mutations for a contact message.
 * Designed to be used alongside useContactMessages or useContactMessage.
 *
 * @example
 * const { update, remove, isUpdating, isDeleting, mutationError } =
 *   useContactMessageMutations();
 *
 * await update(12, { ...payload, status: "replied" });
 * await remove(12);
 */
export const useContactMessageMutations =
  (): UseContactMessageMutationsReturn => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [mutationError, setMutationError] = useState<string | null>(null);

    const update = useCallback(
      async (
        id: number,
        payload: ContactMessageUpdatePayload,
      ): Promise<ContactMessage | null> => {
        setIsUpdating(true);
        setMutationError(null);

        try {
          const updated = await updateContactMessage(id, payload);
          return updated;
        } catch (err: any) {
          setMutationError(
            err?.response?.data?.message ??
              err?.message ??
              "Failed to update contact message.",
          );
          return null;
        } finally {
          setIsUpdating(false);
        }
      },
      [],
    );

    const remove = useCallback(async (id: number): Promise<boolean> => {
      setIsDeleting(true);
      setMutationError(null);

      try {
        await deleteContactMessage(id);
        return true;
      } catch (err: any) {
        setMutationError(
          err?.response?.data?.message ??
            err?.message ??
            "Failed to delete contact message.",
        );
        return false;
      } finally {
        setIsDeleting(false);
      }
    }, []);

    return {
      update,
      remove,
      isUpdating,
      isDeleting,
      mutationError,
    };
  };
export interface UseContactMessageCreateReturn {
  create: (
    payload: ContactMessageCreatePayload,
  ) => Promise<ContactMessage | null>;
  isCreating: boolean;
  isSuccess: boolean;
  creationError: string | null;
  reset: () => void;
}

/**
 * Creates a new contact message via the public endpoint.
 *
 * @example
 * const { create, isCreating, isSuccess, creationError, reset } =
 *   useContactMessageCreate();
 *
 * await create({ name: "John", email: "john@example.com", subject: "Hi", message: "Hello" });
 */
export const useContactMessageCreate = (): UseContactMessageCreateReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsCreating(false);
    setIsSuccess(false);
    setCreationError(null);
  }, []);

  const create = useCallback(
    async (
      payload: ContactMessageCreatePayload,
    ): Promise<ContactMessage | null> => {
      setIsCreating(true);
      setIsSuccess(false);
      setCreationError(null);

      try {
        const created = await createContactMessage(payload);
        setIsSuccess(true);
        return created;
      } catch (err: any) {
        setCreationError(
          err?.response?.data?.message ??
            err?.message ??
            "Failed to create contact message.",
        );
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  return {
    create,
    isCreating,
    isSuccess,
    creationError,
    reset,
  };
};
