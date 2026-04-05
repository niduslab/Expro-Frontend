import { useState, useEffect, useCallback, useRef } from "react";
import { AxiosError } from "axios";

import {
  fetchDocuments,
  fetchDocumentById,
  fetchDocumentsByType,
  fetchFeaturedDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
} from "@/lib/api/functions/admin/documentsApi";

import {
  Document,
  DocumentIndexParams,
  DocumentByTypeParams,
  DocumentStorePayload,
  DocumentUpdatePayload,
  PaginationMeta,
  UseDocumentsState,
  UseDocumentState,
  UseMutationState,
} from "@/lib/types/admin/documentType";

// ─────────────────────────────────────────────
// extractApiError
// Pulls the most useful human-readable message
// out of an Axios 422 / 4xx / 5xx response so
// the raw "Request failed with status 422" never
// reaches the UI.
// ─────────────────────────────────────────────

export interface ApiFieldErrors {
  [field: string]: string[];
}

export function extractApiError(err: unknown): {
  message: string;
  fieldErrors?: ApiFieldErrors;
} {
  if (err instanceof AxiosError) {
    const data = err.response?.data as
      | { message?: string; errors?: ApiFieldErrors }
      | undefined;

    const fieldErrors = data?.errors;

    // Prefer the first field-level message (most specific)
    if (fieldErrors && typeof fieldErrors === "object") {
      const firstField = Object.values(fieldErrors)[0];
      if (Array.isArray(firstField) && firstField.length > 0) {
        return { message: firstField[0], fieldErrors };
      }
    }

    // Fall back to top-level message from backend
    if (data?.message && typeof data.message === "string") {
      return { message: data.message, fieldErrors };
    }

    // Last resort: HTTP status text
    return { message: err.message };
  }

  if (err instanceof Error) return { message: err.message };
  return { message: "An unexpected error occurred" };
}

// ─────────────────────────────────────────────
// documentApi — local adapter object
// ─────────────────────────────────────────────

const documentApi = {
  getAll: fetchDocuments,
  getById: fetchDocumentById,
  getByType: fetchDocumentsByType,
  getFeatured: fetchFeaturedDocuments,
  create: createDocument,
  update: updateDocument,
  delete: deleteDocument,
  download: downloadDocument,
};

// ─────────────────────────────────────────────
// useDocuments — paginated list with filters
// ─────────────────────────────────────────────

export function useDocuments(params: DocumentIndexParams = {}) {
  const [state, setState] = useState<UseDocumentsState>({
    documents: [],
    pagination: null,
    isLoading: false,
    error: null,
  });

  const paramsRef = useRef(params);
  paramsRef.current = params;

  const fetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await documentApi.getAll(paramsRef.current);
      setState({
        documents: res.data,
        pagination: res.pagination,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const { message } = extractApiError(err);
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  // Stable refetch ref — always points to the latest fetch function
  const refetchRef = useRef(fetch);
  useEffect(() => {
    refetchRef.current = fetch;
  }, [fetch]);

  const stableRefetch = useCallback(() => refetchRef.current(), []);

  const paramsKey = JSON.stringify(params);
  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  return { ...state, refetch: stableRefetch };
}

// ─────────────────────────────────────────────
// useDocument — single document by ID
// ─────────────────────────────────────────────

export function useDocument(id: number | null) {
  const [state, setState] = useState<UseDocumentState>({
    document: null,
    isLoading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    if (id === null) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await documentApi.getById(id);
      setState({ document: res.data, isLoading: false, error: null });
    } catch (err) {
      const { message } = extractApiError(err);
      setState({ document: null, isLoading: false, error: message });
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}

// ─────────────────────────────────────────────
// useDocumentsByType — public, type-filtered list
// ─────────────────────────────────────────────

export function useDocumentsByType(
  type: Document["type"] | null,
  params: DocumentByTypeParams = {},
) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!type) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await documentApi.getByType(type, params);
      setDocuments(res.data);
      setPagination(res.pagination);
    } catch (err) {
      const { message } = extractApiError(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, JSON.stringify(params)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { documents, pagination, isLoading, error, refetch: fetch };
}

// ─────────────────────────────────────────────
// useFeaturedDocuments — public featured list
// ─────────────────────────────────────────────

export function useFeaturedDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await documentApi.getFeatured();
      setDocuments(res.data);
    } catch (err) {
      const { message } = extractApiError(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { documents, isLoading, error, refetch: fetch };
}

// ─────────────────────────────────────────────
// Mutation result type
// Returned by create/update so callers can show
// both a toast and inline field errors.
// ─────────────────────────────────────────────

export type SaveResult =
  | { ok: true; data: Document }
  | { ok: false; message: string; fieldErrors?: ApiFieldErrors };

// ─────────────────────────────────────────────
// useCreateDocument
// ─────────────────────────────────────────────

export function useCreateDocument() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const create = useCallback(
    async (payload: DocumentStorePayload): Promise<SaveResult> => {
      setState({ isLoading: true, error: null, isSuccess: false });
      try {
        const res = await documentApi.create(payload);
        setState({ isLoading: false, error: null, isSuccess: true });
        return { ok: true, data: res.data };
      } catch (err) {
        const { message, fieldErrors } = extractApiError(err);
        setState({ isLoading: false, error: message, isSuccess: false });
        return { ok: false, message, fieldErrors };
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, isSuccess: false });
  }, []);

  return { ...state, create, reset };
}

// ─────────────────────────────────────────────
// useUpdateDocument
// ─────────────────────────────────────────────

export function useUpdateDocument() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const update = useCallback(
    async (id: number, payload: DocumentUpdatePayload): Promise<SaveResult> => {
      setState({ isLoading: true, error: null, isSuccess: false });
      try {
        const res = await documentApi.update(id, payload);
        setState({ isLoading: false, error: null, isSuccess: true });
        return { ok: true, data: res.data };
      } catch (err) {
        const { message, fieldErrors } = extractApiError(err);
        setState({ isLoading: false, error: message, isSuccess: false });
        return { ok: false, message, fieldErrors };
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, isSuccess: false });
  }, []);

  return { ...state, update, reset };
}

// ─────────────────────────────────────────────
// useDeleteDocument
// ─────────────────────────────────────────────

export function useDeleteDocument() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const remove = useCallback(
    async (
      id: number,
      options?: { onSuccess?: () => void; onError?: (msg: string) => void },
    ): Promise<boolean> => {
      setState({ isLoading: true, error: null, isSuccess: false });
      try {
        await documentApi.delete(id);
        setState({ isLoading: false, error: null, isSuccess: true });
        options?.onSuccess?.();
        return true;
      } catch (err) {
        const { message } = extractApiError(err);
        setState({ isLoading: false, error: message, isSuccess: false });
        options?.onError?.(message);
        return false;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, isSuccess: false });
  }, []);

  return { ...state, remove, reset };
}

// ─────────────────────────────────────────────
// useDownloadDocument
// ─────────────────────────────────────────────

export function useDownloadDocument() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(
    async (
      id: number,
      fileName: string,
      options?: { onSuccess?: () => void; onError?: (msg: string) => void },
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        await documentApi.download(id, fileName);
        setIsLoading(false);
        options?.onSuccess?.();
      } catch (err) {
        const { message } = extractApiError(err);
        setError(message);
        setIsLoading(false);
        options?.onError?.(message);
      }
    },
    [],
  );

  return { isLoading, error, download };
}

// ─────────────────────────────────────────────
// useDocumentsWithMutations — combined hook
// ─────────────────────────────────────────────

export function useDocumentsWithMutations(params: DocumentIndexParams = {}) {
  const list = useDocuments(params);
  const creator = useCreateDocument();
  const updater = useUpdateDocument();
  const deleter = useDeleteDocument();
  const downloader = useDownloadDocument();

  // Always hold the latest refetch — avoids stale closure issues
  const refetchRef = useRef(list.refetch);
  useEffect(() => {
    refetchRef.current = list.refetch;
  }, [list.refetch]);

  // create — returns SaveResult so page can forward fieldErrors to modal
  const create = useCallback(
    async (payload: DocumentStorePayload): Promise<SaveResult> => {
      const result = await creator.create(payload);
      if (result.ok) await refetchRef.current();
      return result;
    },
    [creator.create],
  );

  // update — same
  const update = useCallback(
    async (id: number, payload: DocumentUpdatePayload): Promise<SaveResult> => {
      const result = await updater.update(id, payload);
      if (result.ok) await refetchRef.current();
      return result;
    },
    [updater.update],
  );

  const remove = useCallback(
    async (
      id: number,
      options?: { onSuccess?: () => void; onError?: (msg: string) => void },
    ) => {
      return deleter.remove(id, {
        ...options,
        onSuccess: async () => {
          await refetchRef.current();
          options?.onSuccess?.();
        },
      });
    },
    [deleter.remove],
  );

  return {
    // list state
    documents: list.documents,
    pagination: list.pagination,
    isLoading: list.isLoading,
    error: list.error,
    refetch: list.refetch,

    // mutations
    create,
    update,
    remove,
    download: downloader.download,

    // mutation states
    createState: {
      isLoading: creator.isLoading,
      error: creator.error,
      isSuccess: creator.isSuccess,
    },
    updateState: {
      isLoading: updater.isLoading,
      error: updater.error,
      isSuccess: updater.isSuccess,
    },
    deleteState: {
      isLoading: deleter.isLoading,
      error: deleter.error,
      isSuccess: deleter.isSuccess,
    },
    downloadState: { isLoading: downloader.isLoading, error: downloader.error },
  };
}
