# Next.js bKash Implementation Files

## File Structure

```
your-nextjs-app/
├── lib/
│   ├── services/
│   │   └── bkash.service.ts
│   └── hooks/
│       └── useBkashPayment.ts
├── components/
│   └── payment/
│       ├── BkashPayment.tsx
│       └── PaymentMethodSelector.tsx
└── app/
    └── payment/
        └── bkash/
            └── callback/
                └── page.tsx
```

## 1. Service Layer

### `lib/services/bkash.service.ts`

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface BkashPaymentRequest {
  amount: number;
  payment_type: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  user_id?: number;
  reference_id?: string;
}

export interface BkashPaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment_id: number;
    bkashURL: string;
    paymentID: string;
    invoice_number: string;
  };
}

export interface BkashExecuteRequest {
  paymentID: string;
  status: 'success' | 'cancel' | 'failure';
}

class BkashService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async createPayment(data: BkashPaymentRequest): Promise<BkashPaymentResponse> {
    const response = await axios.post(
      `${API_URL}/bkash/create-payment`,
      data,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async executePayment(data: BkashExecuteRequest) {
    const response = await axios.post(
      `${API_URL}/bkash/execute-payment`,
      data,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async queryPayment(paymentID: string) {
    const response = await axios.post(
      `${API_URL}/bkash/query-payment`,
      { paymentID },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async searchTransaction(trxID: string) {
    const response = await axios.post(
      `${API_URL}/bkash/search-transaction`,
      { trxID },
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }
}

export const bkashService = new BkashService();
```

## 2. Custom Hook

### `lib/hooks/useBkashPayment.ts`

```typescript
import { useState, useCallback } from 'react';
import { bkashService, BkashPaymentRequest } from '@/lib/services/bkash.service';
import { toast } from 'react-hot-toast';

interface UseBkashPaymentOptions {
  onSuccess?: (payment: any) => void;
  onError?: (error: any) => void;
  pollInterval?: number;
  pollTimeout?: number;
}

export function useBkashPayment(options: UseBkashPaymentOptions = {}) {
  const {
    onSuccess,
    onError,
    pollInterval = 3000,
    pollTimeout = 300000,
  } = options;

  const [loading, setLoading] = useState(false);
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);

  const initiatePayment = useCallback(async (paymentData: BkashPaymentRequest) => {
    setLoading(true);

    try {
      const response = await bkashService.createPayment(paymentData);

      if (!response.success) {
        toast.error(response.message || 'Payment creation failed');
        onError?.(response);
        setLoading(false);
        return null;
      }

      // Open bKash payment URL
      const newWindow = window.open(
        response.data.bkashURL,
        'bKash Payment',
        'width=600,height=700,scrollbars=yes'
      );

      setPaymentWindow(newWindow);

      // Start polling for payment status
      const pollIntervalId = setInterval(async () => {
        try {
          const statusResponse = await bkashService.queryPayment(
            response.data.paymentID
          );

          if (statusResponse.success) {
            const status = statusResponse.data.transactionStatus;

            if (status === 'Completed') {
              clearInterval(pollIntervalId);
              newWindow?.close();

              // Execute payment
              const executeResponse = await bkashService.executePayment({
                paymentID: response.data.paymentID,
                status: 'success',
              });

              setLoading(false);

              if (executeResponse.success) {
                toast.success('Payment completed successfully!');
                onSuccess?.(executeResponse.data);
              } else {
                toast.error('Payment execution failed');
                onError?.(executeResponse);
              }
            } else if (status === 'Cancelled' || status === 'Failed') {
              clearInterval(pollIntervalId);
              newWindow?.close();
              setLoading(false);
              toast.error('Payment was cancelled or failed');
              onError?.({ message: 'Payment cancelled or failed' });
            }
          }
        } catch (error) {
          console.error('Error polling payment status:', error);
        }
      }, pollInterval);

      // Stop polling after timeout
      setTimeout(() => {
        clearInterval(pollIntervalId);
        if (newWindow && !newWindow.closed) {
          newWindow.close();
          setLoading(false);
          toast.error('Payment timeout');
          onError?.({ message: 'Payment timeout' });
        }
      }, pollTimeout);

      return response.data;
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
      onError?.(error);
      setLoading(false);
      return null;
    }
  }, [onSuccess, onError, pollInterval, pollTimeout]);

  const cancelPayment = useCallback(() => {
    if (paymentWindow && !paymentWindow.closed) {
      paymentWindow.close();
      setPaymentWindow(null);
      setLoading(false);
      toast.error('Payment cancelled');
    }
  }, [paymentWindow]);

  return {
    initiatePayment,
    cancelPayment,
    loading,
  };
}
```

## 3. Payment Component

### `components/payment/BkashPayment.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useBkashPayment } from '@/lib/hooks/useBkashPayment';
import { BkashPaymentRequest } from '@/lib/services/bkash.service';

interface BkashPaymentProps {
  amount: number;
  paymentType: string;
  userId?: number;
  referenceId?: string;
  onSuccess?: (payment: any) => void;
  onError?: (error: any) => void;
}

export default function BkashPayment({
  amount,
  paymentType,
  userId,
  referenceId,
  onSuccess,
  onError,
}: BkashPaymentProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const { initiatePayment, cancelPayment, loading } = useBkashPayment({
    onSuccess,
    onError,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return;
    }

    const paymentData: BkashPaymentRequest = {
      amount,
      payment_type: paymentType,
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      user_id: userId,
      reference_id: referenceId,
    };

    await initiatePayment(paymentData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Pay with bKash</h3>
        <img
          src="/bkash-logo.png"
          alt="bKash"
          className="h-8"
        />
      </div>

      <div className="mb-6 p-4 bg-pink-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount:</span>
          <span className="text-2xl font-bold text-pink-600">৳{amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">Payment Type:</span>
          <span className="text-sm font-medium">{paymentType}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
              'Pay Now'
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
          <strong>Note:</strong> You will be redirected to bKash payment gateway.
          Please complete the payment within 5 minutes.
        </p>
      </div>
    </div>
  );
}
```

## 4. Payment Method Selector

### `components/payment/PaymentMethodSelector.tsx`

```typescript
'use client';

import { useState } from 'react';
import BkashPayment from './BkashPayment';
import SslCommerzPayment from './SslCommerzPayment'; // Your existing component

type PaymentMethod = 'bkash' | 'sslcommerz';

interface PaymentMethodSelectorProps {
  amount: number;
  paymentType: string;
  userId?: number;
  referenceId?: string;
  onSuccess?: (payment: any) => void;
  onError?: (error: any) => void;
}

export default function PaymentMethodSelector({
  amount,
  paymentType,
  userId,
  referenceId,
  onSuccess,
  onError,
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
          <img
            src="/bkash-logo.png"
            alt="bKash"
            className="h-12 mx-auto mb-2"
          />
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
          <img
            src="/sslcommerz-logo.png"
            alt="SSLCommerz"
            className="h-12 mx-auto mb-2"
          />
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
          />
        ) : (
          <SslCommerzPayment
            amount={amount}
            paymentType={paymentType}
            userId={userId}
            referenceId={referenceId}
            onSuccess={onSuccess}
            onError={onError}
          />
        )}
      </div>
    </div>
  );
}
```

## 5. Callback Handler

### `app/payment/bkash/callback/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { bkashService } from '@/lib/services/bkash.service';

export default function BkashCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>(
    'processing'
  );
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const paymentID = searchParams.get('paymentID');
    const paymentStatus = searchParams.get('status');

    if (!paymentID || !paymentStatus) {
      setStatus('failed');
      setMessage('Invalid payment information');
      return;
    }

    handleCallback(paymentID, paymentStatus);
  }, [searchParams]);

  const handleCallback = async (paymentID: string, paymentStatus: string) => {
    try {
      if (paymentStatus === 'success') {
        const response = await bkashService.executePayment({
          paymentID,
          status: 'success',
        });

        if (response.success) {
          setStatus('success');
          setMessage('Payment completed successfully!');

          setTimeout(() => {
            router.push('/dashboard?payment=success');
          }, 3000);
        } else {
          setStatus('failed');
          setMessage(response.message || 'Payment execution failed');
        }
      } else if (paymentStatus === 'cancel') {
        setStatus('failed');
        setMessage('Payment was cancelled');
      } else {
        setStatus('failed');
        setMessage('Payment failed');
      }
    } catch (error: any) {
      console.error('Callback error:', error);
      setStatus('failed');
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-green-600 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-red-600 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push('/payment')}
              className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

## 6. Usage Example

### `app/membership/payment/page.tsx`

```typescript
'use client';

import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector';
import { useRouter } from 'next/navigation';

export default function MembershipPaymentPage() {
  const router = useRouter();

  const handlePaymentSuccess = (payment: any) => {
    console.log('Payment successful:', payment);
    router.push('/membership/success');
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <PaymentMethodSelector
        amount={1000}
        paymentType="membership_joining"
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}
```

## Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Dependencies

Install required packages:

```bash
npm install axios react-hot-toast
# or
yarn add axios react-hot-toast
```

## Notes

1. Replace `/bkash-logo.png` with actual bKash logo
2. Adjust styling to match your design system
3. Add proper error boundaries
4. Implement loading states
5. Add analytics tracking
6. Test thoroughly in sandbox before production
