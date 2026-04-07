import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchDocuments,
  fetchDocument,
} from "@/lib/api/functions/public/useDocumentPublicApi";
import {
  DocumentIndexParams,
  UseDocumentsState,
  UseDocumentState,
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
