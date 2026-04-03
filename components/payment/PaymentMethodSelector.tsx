'use client';

import { useState } from 'react';
import BkashPayment from './BkashPayment';

type PaymentMethod = 'bkash' | 'sslcommerz';

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

export default function PaymentMethodSelector({
  amount,
  paymentType,
  userId,
  referenceId,
  onSuccess,
  onError,
  customerInfo,
  hideCustomerForm = false,
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bkash');

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setSelectedMethod('bkash')}
          className={`p-4 border-2 rounded-lg transition-all ${
            selectedMethod === 'bkash'
              ? 'border-pink-600 bg-pink-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="h-12 flex items-center justify-center mb-2">
            <div className="h-10 w-24 bg-pink-600 rounded flex items-center justify-center text-white font-bold">
              bKash
            </div>
          </div>
          <p className="text-sm font-medium">bKash</p>
        </button>

        <button
          onClick={() => setSelectedMethod('sslcommerz')}
          className={`p-4 border-2 rounded-lg transition-all ${
            selectedMethod === 'sslcommerz'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="h-12 flex items-center justify-center mb-2">
            <div className="h-10 w-24 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
              SSLCommerz
            </div>
          </div>
          <p className="text-sm font-medium">Card/Bank</p>
        </button>
      </div>

      <div className="mt-6">
        {selectedMethod === 'bkash' ? (
          <BkashPayment
            amount={amount}
            paymentType={paymentType}
            userId={userId}
            referenceId={referenceId}
            onSuccess={onSuccess}
            onError={onError}
            customerInfo={customerInfo}
            hideCustomerForm={hideCustomerForm}
          />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600">SSLCommerz payment coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
