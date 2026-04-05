"use client";

import { useState } from "react";
import { Plus, FileText, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import {
  useDocumentsWithMutations,
  SaveResult,
} from "@/lib/hooks/admin/useDocumentsHook";
import {
  Document,
  DocumentIndexParams,
  DocumentType,
  DocumentStatus,
  DocumentStorePayload,
  DocumentUpdatePayload,
} from "@/lib/types/admin/documentType";

import DocumentSearchBar from "./documentSearchBar";
import DocumentFilterPanel from "./documentFilterPanel";
import DocumentTable from "./documentTable";
import DocumentModal from "./documentModal";
import DocumentDetailModal from "./documentDetails";
import Pagination from "@/components/pagination/page";

// ── Delete Confirmation Dialog ─────────────────────────────────────────────

interface DeleteConfirmDialogProps {
  documentName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function DeleteConfirmDialog({
  documentName,
  onConfirm,
  onCancel,
  isPending,
}: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex flex-col w-full max-w-[420px] bg-white rounded-2xl border border-[#E5E7EB] shadow-lg p-6 gap-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-50 border border-red-100">
            <AlertTriangle className="h-6 w-6 text-[#FB2C36]" />
          </div>
          <div>
            <p className="font-semibold text-[18px] text-[#030712] leading-[130%]">
              Delete Document
            </p>
            <p className="text-[13px] text-[#4A5565] mt-1 leading-[160%]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#030712]">
                "{documentName}"
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="border border-[#E5E7EB]" />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 cursor-pointer h-[44px] rounded-xl border border-[#E5E7EB] text-[#6A7282] font-normal text-[15px] hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 h-[44px] cursor-pointer rounded-xl bg-[#FB2C36] text-white font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  // ── Search ─────────────────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // ── Filters ────────────────────────────────────────────────────────────────
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");

  // ── Pagination ─────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);

  // ── Modal state ────────────────────────────────────────────────────────────
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editDocument, setEditDocument] = useState<Document | null>(null);
  const [detailDocument, setDetailDocument] = useState<Document | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null);

  // ── Search helpers ─────────────────────────────────────────────────────────
  const commitSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };
  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  // ── Filter helpers ─────────────────────────────────────────────────────────
  const hasActiveFilters = !!(filterType || filterStatus || filterFeatured);

  const clearFilters = () => {
    setFilterType("");
    setFilterStatus("");
    setFilterFeatured("");
    setPage(1);
  };

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  // ── Build query params ─────────────────────────────────────────────────────
  const queryParams: DocumentIndexParams = { page };
  if (search) queryParams.search = search;
  if (filterType) queryParams.type = filterType as DocumentType;
  if (filterStatus) queryParams.status = filterStatus as DocumentStatus;
  if (filterFeatured !== "")
    queryParams.is_featured = filterFeatured === "true";

  // ── Single hook instance — all mutations share the same refetch ────────────
  const {
    documents,
    pagination,
    isLoading,
    error,
    create,
    update,
    remove: deleteDocument,
    download,
    createState,
    updateState,
    deleteState,
  } = useDocumentsWithMutations(queryParams);

  // ── Unified save handler — returns SaveResult so modal can show field errors
  const handleSave = async (
    payload: DocumentStorePayload | DocumentUpdatePayload,
    isEdit: boolean,
    id?: number,
  ): Promise<SaveResult> => {
    if (isEdit && id !== undefined) {
      const result = await update(id, payload as DocumentUpdatePayload);
      if (result.ok) {
        toast.success("Document updated successfully");
      } else {
        toast.error(result.message);
      }
      return result;
    } else {
      const result = await create(payload as DocumentStorePayload);
      if (result.ok) {
        toast.success("Document uploaded successfully");
      } else {
        toast.error(result.message);
      }
      return result;
    }
  };

  const isSaving = createState.isLoading || updateState.isLoading;
  const deleting = deleteState.isLoading;

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteDocument(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Document deleted successfully");
        setDeleteTarget(null);
      },
      onError: (msg) => {
        toast.error(msg || "Failed to delete document");
        setDeleteTarget(null);
      },
    });
  };

  // ── Download ───────────────────────────────────────────────────────────────
  const handleDownload = (doc: Document) => {
    download(doc.id, doc.file_name, {
      onSuccess: () => toast.success("Download started"),
      onError: (msg) => toast.error(msg || "Failed to download document"),
    });
  };

  return (
    <div className="min-h-screen font-['DM_Sans',sans-serif]">
      {/* ── Header ── */}
      <div className="bg-white border-b border-[#e8e6e0] flex items-center max-w-7xl mx-auto">
        <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
              Documents
            </p>
            <p className="text-sm text-[#4A5565]">
              Manage documents, publications, and reports.
            </p>
          </div>
          <div className="flex justify-start sm:justify-end">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#068847] text-white whitespace-nowrap"
            >
              <Plus className="h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold">Upload Document</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 space-y-4">
        {/* ── Search & Filter Bar ── */}
        <DocumentSearchBar
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onCommitSearch={commitSearch}
          onClearSearch={clearSearch}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((v) => !v)}
          hasActiveFilters={hasActiveFilters}
        />

        {/* ── Filter Panel ── */}
        {showFilters && (
          <DocumentFilterPanel
            filterType={filterType}
            filterStatus={filterStatus}
            filterFeatured={filterFeatured}
            onTypeChange={handleFilterChange(setFilterType)}
            onStatusChange={handleFilterChange(setFilterStatus)}
            onFeaturedChange={handleFilterChange(setFilterFeatured)}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        {/* ── Table ── */}
        <div className="bg-white border border-[#d7efdc] rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center gap-3 text-[#8a8780]">
              <div className="w-8 h-8 border-2 border-[#1a1a2e]/20 border-t-[#1a1a2e] rounded-full animate-spin" />
              <span className="text-sm">Loading documents...</span>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-sm text-red-500">
              Failed to load documents. Please try again.
            </div>
          ) : documents.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f5f4f0] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#b8b5ae]" />
              </div>
              <p className="text-sm text-[#8a8780]">
                {search
                  ? `No documents found for "${search}"`
                  : "No documents found"}
              </p>
              {search ? (
                <button
                  onClick={clearSearch}
                  className="text-sm text-[#1a1a2e] underline underline-offset-2 font-medium"
                >
                  Clear search
                </button>
              ) : (
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="text-sm text-[#1a1a2e] underline underline-offset-2 font-medium"
                >
                  Upload your first document
                </button>
              )}
            </div>
          ) : (
            <DocumentTable
              documents={documents}
              deletingId={deleteTarget?.id ?? null}
              onView={setDetailDocument}
              onEdit={setEditDocument}
              onDelete={(id) => {
                const doc = documents.find((d) => d.id === id) ?? null;
                setDeleteTarget(doc);
              }}
              onDownload={handleDownload}
            />
          )}
        </div>

        {/* ── Pagination ── */}
        {pagination && pagination.last_page > 0 && (
          <Pagination
            page={pagination.current_page}
            perPage={pagination.per_page}
            total={pagination.total}
            dataLength={documents.length}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>

      {/* ── Modals ── */}

      <DocumentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <DocumentModal
        open={!!editDocument}
        document={editDocument}
        onClose={() => setEditDocument(null)}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <DocumentDetailModal
        open={!!detailDocument}
        document={detailDocument}
        onClose={() => setDetailDocument(null)}
        onEdit={(doc) => {
          setDetailDocument(null);
          setEditDocument(doc);
        }}
        onDownload={handleDownload}
      />

      {deleteTarget && (
        <DeleteConfirmDialog
          documentName={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isPending={deleting}
        />
      )}
    </div>
  );
}
