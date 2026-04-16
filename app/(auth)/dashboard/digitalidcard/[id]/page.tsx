"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useDigitalIdCard } from "@/lib/hooks/user/useDigitalIdCard";
import { DigitalIdCard } from "@/components/user/DigitalIdCard";

export default function DigitalIdCardPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const { data, isLoading, error } = useDigitalIdCard(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#068847] mx-auto mb-4" />
          <p className="text-sm text-[#6B7280]">Loading digital ID card…</p>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <ArrowLeft className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#030712] mb-2">
            Card Not Found
          </h2>
          <p className="text-sm text-[#6B7280] mb-6">
            The digital ID card you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#068847] text-white rounded-lg hover:bg-[#045a2e] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const cardData = data.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#068847] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <h1 className="text-2xl font-bold text-[#030712]">
            Digital Identity Card
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            View and manage your digital identity card
          </p>
        </div>

        {/* Digital ID Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 md:p-8">
          <DigitalIdCard cardData={cardData} />
        </div>

        {/* Additional Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Important Information
              </h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• This digital ID card is valid for official identification purposes</li>
                <li>• Keep your card number confidential and secure</li>
                <li>• Report any loss or unauthorized use immediately</li>
                <li>• The QR code can be scanned for verification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
