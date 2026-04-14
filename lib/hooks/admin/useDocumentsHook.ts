import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchDocuments,
  fetchDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
} from "@/lib/api/functions/admin/documentsApi";
import {
  Document,
  DocumentIndexParams,
  DocumentStorePayload,
  DocumentUpdatePayload,
  PaginationMeta,
  SaveResult,
  UseDocumentsState,
  UseDocumentState,
  UseMutationState,
} from "@/lib/types/admin/documentType";

// ─────────────────────────────────────────────
// useDocuments — paginated list with filters
// ─────────────────────────────────────────────
export function useDocuments(
  initialParams: DocumentIndexParams = {},
): UseDocumentsState & {
  params: DocumentIndexParams;
  setParams: React.Dispatch<React.SetStateAction<DocumentIndexParams>>;
  refetch: () => void;
} {
  const [params, setParams] = useState<DocumentIndexParams>(initialParams);
  const [state, setState] = useState<UseDocumentsState>({
    documents: [],
    pagination: null,
    isLoading: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const res = await fetchDocuments(params);
      setState({
        documents: res.data,
        pagination: res.pagination,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load documents.",
      }));
    }
  }, [params]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  return { ...state, params, setParams, refetch: load };
}

// ─────────────────────────────────────────────
// useDocument — single document by id
// ─────────────────────────────────────────────
export function useDocument(id: number | null): UseDocumentState & {
  refetch: () => void;
} {
  const [state, setState] = useState<UseDocumentState>({
    document: null,
    isLoading: false,
    error: null,
  });

  const load = useCallback(async () => {
    if (id === null) return;
    setState({ document: null, isLoading: true, error: null });
    try {
      const res = await fetchDocument(id);
      setState({ document: res.data, isLoading: false, error: null });
    } catch (err: unknown) {
      setState({
        document: null,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load document.",
      });
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, refetch: load };
}

// ─────────────────────────────────────────────
// useCreateDocument
// ─────────────────────────────────────────────
export function useCreateDocument(): UseMutationState & {
  create: (payload: DocumentStorePayload) => Promise<Document | null>;
  reset: () => void;
} {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const create = useCallback(
    async (payload: DocumentStorePayload): Promise<Document | null> => {
      setState({ isLoading: true, error: null, isSuccess: false });
      try {
        const res = await createDocument(payload);
        setState({ isLoading: false, error: null, isSuccess: true });
        return res.data;
      } catch (err: unknown) {
        setState({
          isLoading: false,
          error:
            err instanceof Error ? err.message : "Failed to create document.",
          isSuccess: false,
        });
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
export function useUpdateDocument(): UseMutationState & {
  update: (
    id: number,
    payload: DocumentUpdatePayload,
  ) => Promise<Document | null>;
  reset: () => void;
} {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const update = useCallback(
    async (
      id: number,
      payload: DocumentUpdatePayload,
    ): Promise<Document | null> => {
      setState({ isLoading: true, error: null, isSuccess: false });
      try {
        const res = await updateDocument(id, payload);
        setState({ isLoading: false, error: null, isSuccess: true });
        return res.data;
      } catch (err: unknown) {
        setState({
          isLoading: false,
          error:
            err instanceof Error ? err.message : "Failed to update document.",
          isSuccess: false,
        });
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
export function useDeleteDocument(): UseMutationState & {
  remove: (id: number) => Promise<boolean>;
  reset: () => void;
} {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const remove = useCallback(async (id: number): Promise<boolean> => {
    setState({ isLoading: true, error: null, isSuccess: false });
    try {
      await deleteDocument(id);
      setState({ isLoading: false, error: null, isSuccess: true });
      return true;
    } catch (err: unknown) {
      setState({
        isLoading: false,
        error:
          err instanceof Error ? err.message : "Failed to delete document.",
        isSuccess: false,
      });
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, isSuccess: false });
  }, []);

  return { ...state, remove, reset };
}
// Add to the bottom of your hooks file
export function useDocumentsWithMutations(params: DocumentIndexParams) {
  const { documents, pagination, isLoading, error, refetch, setParams } =
    useDocuments(params);

  useEffect(() => {
    setParams(params);
  }, [
    params.page,
    params.search,
    params.type,
    params.status,
    params.is_featured,
  ]);

  const createHook = useCreateDocument();
  const updateHook = useUpdateDocument();
  const deleteHook = useDeleteDocument();

  const create = async (payload: DocumentStorePayload): Promise<SaveResult> => {
    try {
      const doc = await createHook.create(payload);
      if (doc) {
        refetch();
        return { ok: true, message: "Document created successfully." };
      }
      return {
        ok: false,
        message: createHook.error ?? "Failed to create document.",
      };
    } catch (err) {
      return {
        ok: false,
        message:
          err instanceof Error ? err.message : "Failed to create document.",
      };
    }
  };

  const update = async (
    id: number,
    payload: DocumentUpdatePayload,
  ): Promise<SaveResult> => {
    try {
      const doc = await updateHook.update(id, payload);
      if (doc) {
        refetch();
        return { ok: true, message: "Document updated successfully." };
      }
      return {
        ok: false,
        message: updateHook.error ?? "Failed to update document.",
      };
    } catch (err) {
      return {
        ok: false,
        message:
          err instanceof Error ? err.message : "Failed to update document.",
      };
    }
  };

  const remove = (
    id: number,
    callbacks?: { onSuccess?: () => void; onError?: (msg: string) => void },
  ) => {
    deleteHook.remove(id).then((ok) => {
      if (ok) {
        refetch();
        callbacks?.onSuccess?.();
      } else {
        callbacks?.onError?.(deleteHook.error ?? "Failed to delete document.");
      }
    });
  };

  const download = (
    id: number,
    fileName: string,
    callbacks?: { onSuccess?: () => void; onError?: (msg: string) => void },
  ) => {
    downloadDocument(id, fileName)
      .then(() => callbacks?.onSuccess?.())
      .catch((err: unknown) =>
        callbacks?.onError?.(
          err instanceof Error ? err.message : "Download failed.",
        ),
      );
  };

  return {
    documents,
    pagination,
    isLoading,
    error,
    create,
    update,
    remove,
    download,
    createState: {
      isLoading: createHook.isLoading,
      error: createHook.error,
      isSuccess: createHook.isSuccess,
    },
    updateState: {
      isLoading: updateHook.isLoading,
      error: updateHook.error,
      isSuccess: updateHook.isSuccess,
    },
    deleteState: {
      isLoading: deleteHook.isLoading,
      error: deleteHook.error,
      isSuccess: deleteHook.isSuccess,
    },
  };
}
