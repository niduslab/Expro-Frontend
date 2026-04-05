import { useState, useEffect, useCallback, useRef } from "react";

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
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch documents",
      }));
    }
  }, []);

  const paramsKey = JSON.stringify(params);
  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  return { ...state, refetch: fetch };
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
      setState({
        document: null,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch document",
      });
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
      setError(
        err instanceof Error ? err.message : "Failed to fetch documents",
      );
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
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch featured documents",
      );
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
// useCreateDocument
// ─────────────────────────────────────────────

export function useCreateDocument() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const create = useCallback(
    async (
      payload: DocumentStorePayload,
      options?: {
        onSuccess?: (doc: Document) => void;
        onError?: (msg: string) => void;
      },
    ): Promise<Document | null> => {
      setState({ isLoading: true, error: null, isSuccess: false });
      try {
        const res = await documentApi.create(payload);
        setState({ isLoading: false, error: null, isSuccess: true });
        options?.onSuccess?.(res.data);
        return res.data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to upload document";
        setState({ isLoading: false, error: message, isSuccess: false });
        options?.onError?.(message);
        return null;
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
    async (
      id: number,
      payload: DocumentUpdatePayload,
      options?: {
        onSuccess?: (doc: Document) => void;
        onError?: (msg: string) => void;
      },
    ): Promise<Document | null> => {
      setState({ isLoading: true, error: null, isSuccess: false });
      try {
        const res = await documentApi.update(id, payload);
        setState({ isLoading: false, error: null, isSuccess: true });
        options?.onSuccess?.(res.data);
        return res.data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update document";
        setState({ isLoading: false, error: message, isSuccess: false });
        options?.onError?.(message);
        return null;
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
        const message =
          err instanceof Error ? err.message : "Failed to delete document";
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
        const message =
          err instanceof Error ? err.message : "Failed to download document";
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
// Use this in your page/component instead of
// wiring useDocuments + mutations separately.
// All mutations auto-refetch the list on success.
// ─────────────────────────────────────────────

export function useDocumentsWithMutations(params: DocumentIndexParams = {}) {
  const list = useDocuments(params);
  const creator = useCreateDocument();
  const updater = useUpdateDocument();
  const deleter = useDeleteDocument();
  const downloader = useDownloadDocument();

  const create = useCallback(
    async (
      payload: DocumentStorePayload,
      options?: {
        onSuccess?: (doc: Document) => void;
        onError?: (msg: string) => void;
      },
    ) => {
      return creator.create(payload, {
        ...options,
        onSuccess: async (doc) => {
          await list.refetch();
          options?.onSuccess?.(doc);
        },
      });
    },
    [creator.create, list.refetch],
  );

  const update = useCallback(
    async (
      id: number,
      payload: DocumentUpdatePayload,
      options?: {
        onSuccess?: (doc: Document) => void;
        onError?: (msg: string) => void;
      },
    ) => {
      return updater.update(id, payload, {
        ...options,
        onSuccess: async (doc) => {
          await list.refetch();
          options?.onSuccess?.(doc);
        },
      });
    },
    [updater.update, list.refetch],
  );

  const remove = useCallback(
    async (
      id: number,
      options?: { onSuccess?: () => void; onError?: (msg: string) => void },
    ) => {
      return deleter.remove(id, {
        ...options,
        onSuccess: async () => {
          await list.refetch();
          options?.onSuccess?.();
        },
      });
    },
    [deleter.remove, list.refetch],
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
