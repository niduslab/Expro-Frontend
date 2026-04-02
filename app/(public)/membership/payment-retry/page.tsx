'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBkashPayment } from '@/lib/hooks/useBkashPayment';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function PaymentRetryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const applicationId = searchParams.get('application_id');
  const applicationNumber = searchParams.get('application_number');
  
  // Use whichever parameter is available
  const appId = applicationId || applicationNumber;
  
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'sslcommerz'>('bkash');
  const { retryPayment, loading } = useBkashPayment({
    onSuccess: () => {
      router.push('/membership/success?payment=success');
    },
    onError: (error) => {
      console.error('Payment retry failed:', error);
    },
  });

  useEffect(() => {
    if (!appId) {
      router.push('/membership');
    }
  }, [appId, router]);

  const handleRetry = async () => {
    if (!appId) return;
    
    try {
      await retryPayment(parseInt(appId), paymentMethod);
    } catch (error) {
      console.error('Retry error:', error);
    }
  };

  if (!appId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4 py-32">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
        <div className="text-center mb-8">
          {/* Warning Icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-orange-100 rounded-full p-6">
              <AlertCircle className="w-20 h-20 text-orange-600" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Payment Incomplete
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Your membership application was submitted, but the payment was not completed. 
            Please retry the payment to activate your membership.
          </p>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center">Select Payment Method</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod('bkash')}
              disabled={loading}
              className={`p-6 border-2 rounded-lg transition-all ${
                paymentMethod === 'bkash'
                  ? 'border-pink-600 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="h-12 flex items-center justify-center mb-2">
                <div className="h-10 w-24 bg-pink-600 rounded flex items-center justify-center text-white font-bold">
                  bKash
                </div>
              </div>
              <p className="text-sm font-medium">bKash</p>
            </button>

            <button
              onClick={() => setPaymentMethod('sslcommerz')}
              disabled={loading}
              className={`p-6 border-2 rounded-lg transition-all ${
                paymentMethod === 'sslcommerz'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="h-12 flex items-center justify-center mb-2">
                <div className="h-10 w-24 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                  SSLCommerz
                </div>
              </div>
              <p className="text-sm font-medium">Card/Bank</p>
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Your application has been saved with ID: {appId}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Complete the payment to activate your membership</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>You can retry payment multiple times if needed</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleRetry}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#008543] text-white rounded-lg font-medium hover:bg-[#006C36] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
              <>
                <RefreshCw size={20} />
                Retry Payment
              </>
            )}
          </button>

          <button
            onClick={() => router.push('/')}
            disabled={loading}
            className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Back to Home
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@exprowelfare.org" className="text-[#008543] hover:underline">
              support@exprowelfare.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
