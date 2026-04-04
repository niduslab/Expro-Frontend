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

export function useDocuments(initialParams: DocumentIndexParams = {}) {
  const [state, setState] = useState<UseDocumentsState>({
    documents: [],
    pagination: null,
    isLoading: false,
    error: null,
  });

  const [params, setParams] = useState<DocumentIndexParams>(initialParams);

  // Stable ref so the fetch function never captures stale params
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

  useEffect(() => {
    fetch();
  }, [fetch, params]);

  const updateParams = useCallback((next: Partial<DocumentIndexParams>) => {
    setParams((prev) => ({ ...prev, ...next, page: 1 }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  return {
    ...state,
    params,
    updateParams,
    goToPage,
    refetch: fetch,
  };
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
