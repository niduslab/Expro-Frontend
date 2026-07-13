"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Home, Heart, Copy, Check } from "lucide-react";
import { useState } from "react";

function DonationSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const receipt = searchParams.get("receipt");
  const amount = searchParams.get("amount");
  const paymentId = searchParams.get("payment_id");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 py-32">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 rounded-full p-6 animate-bounce">
              <CheckCircle className="w-20 h-20 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thank You for Your Donation!
          </h1>

          <p className="text-lg text-gray-600 mb-8 flex items-center justify-center gap-2">
            <Heart className="text-green-600" size={20} /> Your generosity makes
            a real difference.
          </p>

          {amount && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600">Donation Amount</p>
              <p className="text-3xl font-bold text-[#008543]">৳ {amount}</p>
            </div>
          )}

          {receipt && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Receipt Number</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-semibold text-gray-900">
                    {receipt}
                  </span>
                  <button
                    onClick={() => copyToClipboard(receipt)}
                    className="text-[#008543] hover:text-[#006C36] transition-colors"
                    title="Copy receipt number"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {paymentId && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment ID</span>
                <span className="text-sm font-mono font-semibold text-gray-900">
                  #{paymentId}
                </span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-blue-800">
              A confirmation has been recorded against your account. Please keep
              your receipt number for future reference.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#008543] text-white rounded-lg font-medium hover:bg-[#006C36] transition-colors shadow-md"
            >
              <Home size={20} />
              Back to Home
            </button>

            <button
              onClick={() => router.push("/donate")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Heart size={20} />
              Donate Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={null}>
      <DonationSuccessContent />
    </Suspense>
  );
}
