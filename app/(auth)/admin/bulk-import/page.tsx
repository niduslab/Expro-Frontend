"use client";

import React, { useState, useRef } from "react";
import { Upload, Download, AlertCircle, CheckCircle2, AlertTriangle, Loader } from "lucide-react";
import { toast } from "sonner";

interface ImportResult {
  success: boolean;
  message: string;
  data?: {
    total_rows: number;
    successful: number;
    failed: number;
    skipped: number;
    errors: any[];
    imported_member_ids: number[];
    failed_rows: number[];
  };
  error?: string;
}

export default function BulkImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDryRun, setIsDryRun] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error("Please select a CSV file");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setImportResult(null);
    }
  };

  const downloadTemplate = async () => {
    try {
      toast.loading("Downloading template...", { id: "download" });

      const response = await fetch("/api/v1/admin/bulk-import/template", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download template");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `members_import_template_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Template downloaded", { id: "download" });
    } catch (error) {
      toast.error("Failed to download template", { id: "download" });
      console.error("Download error:", error);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    setIsImporting(true);
    const toastId = isDryRun ? "dry-run" : "import";
    toast.loading(isDryRun ? "Running validation..." : "Importing members...", { id: toastId });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("dry_run", isDryRun ? "true" : "false");

      const response = await fetch("/api/v1/admin/bulk-import/members", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      });

      const result = await response.json() as ImportResult;
      setImportResult(result);

      if (result.success) {
        toast.success(
          isDryRun
            ? `Validation complete: ${result.data?.successful} valid rows`
            : `Import successful: ${result.data?.successful} members imported`,
          { id: toastId }
        );
      } else {
        toast.error(result.message || "Import failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Import error: " + (error instanceof Error ? error.message : "Unknown error"), { id: toastId });
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#068847] to-[#045a2e] rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bulk Member Import</h1>
              <p className="text-gray-600 mt-1">Import up to 2500 members with their pension packages and payment history</p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Steps */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              {[
                { number: 1, title: "Download Template", icon: Download },
                { number: 2, title: "Fill Data", icon: null },
                { number: 3, title: "Upload CSV", icon: Upload },
                { number: 4, title: "Import", icon: null },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-[#068847] text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {step.number}
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center whitespace-nowrap">{step.title}</p>
                  </div>
                  {idx < 3 && <div className="flex-1 h-0.5 bg-gray-300 mx-4" />}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Step 1: Download Template */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Step 1: Download Template</h3>
                  <p className="text-gray-600 text-sm mt-1">Start by downloading the CSV template with all required columns</p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-6 py-3 bg-[#068847] text-white rounded-lg hover:bg-[#045a2e] transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>
            </div>

            {/* Step 2: Upload File */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Upload CSV File</h3>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  file ? "border-[#068847] bg-green-50" : "border-gray-300 hover:border-[#068847]"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {file ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="w-12 h-12 text-[#068847] mb-3" />
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <button
                      className="mt-3 text-sm text-[#068847] hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      Change file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-600 mt-1">CSV files up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Import Options */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Import Options</h3>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDryRun}
                    onChange={(e) => setIsDryRun(e.target.checked)}
                    className="w-4 h-4 accent-[#068847]"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Dry Run (Recommended First)</p>
                    <p className="text-sm text-gray-600">Validate data without importing. Good for checking for errors before actual import.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Import Button */}
            <button
              onClick={handleImport}
              disabled={!file || isImporting}
              className={`w-full py-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-colors ${
                !file || isImporting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#068847] hover:bg-[#045a2e]"
              }`}
            >
              {isImporting && <Loader className="w-5 h-5 animate-spin" />}
              {isImporting ? (isDryRun ? "Validating..." : "Importing...") : (isDryRun ? "Run Validation" : "Import Members")}
            </button>

            {/* Results */}
            {importResult && (
              <div className={`rounded-lg border-l-4 p-6 ${
                importResult.success
                  ? "bg-green-50 border-green-400"
                  : "bg-red-50 border-red-400"
              }`}>
                <div className="flex gap-4">
                  {importResult.success ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h4 className={`font-semibold ${importResult.success ? "text-green-900" : "text-red-900"}`}>
                      {importResult.message}
                    </h4>

                    {importResult.data && (
                      <div className="mt-4 grid grid-cols-4 gap-4">
                        <div className="bg-white rounded p-3">
                          <p className="text-xs text-gray-600">Total Rows</p>
                          <p className="text-xl font-bold text-gray-900">{importResult.data.total_rows}</p>
                        </div>
                        <div className="bg-white rounded p-3">
                          <p className="text-xs text-green-600 font-medium">Successful</p>
                          <p className="text-xl font-bold text-green-600">{importResult.data.successful}</p>
                        </div>
                        <div className="bg-white rounded p-3">
                          <p className="text-xs text-red-600 font-medium">Failed</p>
                          <p className="text-xl font-bold text-red-600">{importResult.data.failed}</p>
                        </div>
                        <div className="bg-white rounded p-3">
                          <p className="text-xs text-gray-600">Skipped</p>
                          <p className="text-xl font-bold text-gray-900">{importResult.data.skipped}</p>
                        </div>
                      </div>
                    )}

                    {importResult.data?.errors && importResult.data.errors.length > 0 && (
                      <div className="mt-4 bg-white rounded p-4">
                        <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Errors ({importResult.data.errors.length})
                        </h5>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {importResult.data.errors.slice(0, 10).map((error, idx) => (
                            <p key={idx} className="text-sm text-red-800">
                              {typeof error === "string" ? error : error.error || JSON.stringify(error)}
                            </p>
                          ))}
                          {importResult.data.errors.length > 10 && (
                            <p className="text-sm text-red-800 font-medium">
                              ... and {importResult.data.errors.length - 10} more errors
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>CSV Format:</strong> File must have headers in first row and proper column names</li>
            <li>• <strong>Dry Run First:</strong> Always test with dry-run mode before live import</li>
            <li>• <strong>Max File Size:</strong> 10MB per file (supports ~2500+ members)</li>
            <li>• <strong>Backup:</strong> Keep a backup of your CSV file</li>
            <li>• <strong>Pension Packages:</strong> Must be created before importing members</li>
            <li>• <strong>Email Unique:</strong> Each member's email must be unique in system</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
