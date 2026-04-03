"use client";

import { useState } from "react";
import { useBkashPayment } from "@/lib/hooks/useBkashPayment";
import {
  CreatePaymentRequest,
  bkashService,
} from "@/lib/services/bkash.service";

interface BkashPaymentProps {
  amount: number;
  paymentType: string;
  userId?: number;
  referenceId?: string;
  onSuccess?: (payment: any) => void;
  onError?: (error: any) => void;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  hideCustomerForm?: boolean;
}

export default function BkashPayment({
  amount,
  paymentType,
  userId,
  referenceId,
  onSuccess,
  onError,
  customerInfo: initialCustomerInfo,
  hideCustomerForm = false,
}: BkashPaymentProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: initialCustomerInfo?.name || "",
    email: initialCustomerInfo?.email || "",
    phone: initialCustomerInfo?.phone || "",
  });

  const { openPaymentGateway, cancelPayment, loading } = useBkashPayment({
    onSuccess,
    onError,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone)
      return;

    const paymentData: CreatePaymentRequest = {
      amount,
      payment_type: paymentType,
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      user_id: userId,
      reference_id: referenceId,
    };

    try {
      // Step 1: create payment on backend → receive bkashURL + payment_id
      const result = await bkashService.createPayment(paymentData);

      if (!result.success || !result.data?.bkashURL) {
        onError?.({ message: result.message || "Failed to create payment" });
        return;
      }

      // Step 2: open bKash gateway with server-returned data
      await openPaymentGateway({
        bkashURL: result.data.bkashURL,
        payment_id: result.data.payment_id,
        paymentID: result.data.paymentID,
      });
    } catch (error: any) {
      onError?.(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Pay with bKash</h3>
        <div className="h-8 w-20 bg-pink-600 rounded flex items-center justify-center text-white font-bold text-sm">
          bKash
        </div>
      </div>

      <div className="mb-6 p-4 bg-pink-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount:</span>
          <span className="text-2xl font-bold text-pink-600">
            ৳{amount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">Payment Type:</span>
          <span className="text-sm font-medium">{paymentType}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!hideCustomerForm && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customerInfo.name}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={customerInfo.email}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="your.email@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                pattern="01[0-9]{9}"
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="01XXXXXXXXX"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your 11-digit mobile number
              </p>
            </div>
          </>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </button>

          {loading && (
            <button
              type="button"
              onClick={cancelPayment}
              className="px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> You will be redirected to bKash payment
          gateway. Please complete the payment within 5 minutes.
        </p>
      </div>
    </div>
  );
}
