'use client';

import { useState } from 'react';
import apiClient from '@/lib/api/axios';

interface PaymentMethodSelectorProps {
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

/**
 * Submits payment via SSLCommerz using the generic /sslcommerz/initiate
 * endpoint and redirects the browser to the hosted checkout page.
 */
export default function PaymentMethodSelector({
  amount,
  paymentType,
  userId,
  referenceId,
  onError,
  customerInfo: initialCustomerInfo,
  hideCustomerForm = false,
}: PaymentMethodSelectorProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: initialCustomerInfo?.name || '',
    email: initialCustomerInfo?.email || '',
    phone: initialCustomerInfo?.phone || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/sslcommerz/initiate', {
        amount,
        payment_type: paymentType,
        user_id: userId,
        reference_id: referenceId,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
      });

      const gatewayUrl = response.data?.data?.GatewayPageURL;

      if (gatewayUrl) {
        window.location.href = gatewayUrl;
      } else {
        onError?.({ message: 'Payment URL not found' });
      }
    } catch (error: any) {
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Pay with SSLCommerz</h3>
          <div className="h-8 w-24 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
            SSLCommerz
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount:</span>
            <span className="text-2xl font-bold text-blue-600">৳{amount.toFixed(2)}</span>
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
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="01XXXXXXXXX"
                  disabled={loading}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> You will be redirected to the SSLCommerz payment gateway.
          </p>
        </div>
      </div>
    </div>
  );
}
