"use client";

import { useState } from "react";
import { Plus, FileText } from "lucide-react";
import { toast } from "sonner";

import {
  useDocuments,
  useDeleteDocument,
  useDownloadDocument,
} from "@/lib/hooks/admin/useDocumentsHook";
import { Document, DocumentType, DocumentStatus } from "@/lib/types/admin/documentType";

import DocumentSearchBar from "./documentSearchBar";
import DocumentFilterPanel from "./documentFilterPanel";
import DocumentTable from "./documentTable";
import DocumentModal from "./documentModal";
import DocumentDetailModal from "./documentDetails";
import Pagination from "@/components/pagination/page";

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
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  const handleFilterChange = (
    setter: (v: string) => void,
  ) => (v: string) => {
    setter(v);
    setPage(1);
  };

  // ── Query params ───────────────────────────────────────────────────────────
  const queryParams: Record<string, unknown> = { page };
  if (search) queryParams.search = search;
  if (filterType) queryParams.type = filterType as DocumentType;
  if (filterStatus) queryParams.status = filterStatus as DocumentStatus;
  if (filterFeatured !== "") queryParams.is_featured = filterFeatured === "true";

  const { documents, pagination, isLoading, error } = useDocuments(queryParams);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const { remove: deleteDocument, isLoading: deleting } = useDeleteDocument();
  const { download, isLoading: downloading } = useDownloadDocument();

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    setDeletingId(id);
    deleteDocument(id, {
      onSuccess: () => toast.success("Document deleted successfully"),
      onError: (msg) => toast.error(msg || "Failed to delete document"),
    }).finally(() => setDeletingId(null));
  };

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
              deletingId={deletingId}
              onView={setDetailDocument}
              onEdit={setEditDocument}
              onDelete={handleDelete}
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
            onNext={() =>
              setPage((p) => Math.min(pagination.last_page, p + 1))
            }
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>

      {/* ── Modals ── */}
      <DocumentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <DocumentModal
        open={!!editDocument}
        document={editDocument}
        onClose={() => setEditDocument(null)}
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
    </div>
  );
}
