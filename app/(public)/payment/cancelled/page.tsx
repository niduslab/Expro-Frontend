'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw, Home, Info } from 'lucide-react';

export default function PaymentCancelledPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get('payment_id');
  const applicationNumber = searchParams.get('application_number');

  const handleRetry = () => {
    if (applicationNumber) {
      // Retry membership application payment
      router.push(`/membership/payment-retry?application_number=${applicationNumber}`);
    } else {
      // Go back to home
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4 py-32">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-yellow-100 rounded-full p-6">
              <AlertCircle className="w-20 h-20 text-yellow-600" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            You have cancelled the payment process. Your application is still saved and waiting for payment.
          </p>

          {/* Details */}
          {(paymentId || applicationNumber) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm">
                {paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono font-semibold text-gray-900">#{paymentId}</span>
                  </div>
                )}
                {applicationNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application Number:</span>
                    <span className="font-mono font-semibold text-gray-900">{applicationNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-yellow-600">Payment Pending</span>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Info size={20} />
              Important Information
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your application has been saved and is waiting for payment</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You can retry the payment at any time</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your application will remain in "Payment Pending" status until payment is completed</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>No charges have been made to your account</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {applicationNumber && (
              <button
                onClick={handleRetry}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#008543] text-white rounded-lg font-medium hover:bg-[#006C36] transition-colors shadow-md"
              >
                <RefreshCw size={20} />
                Complete Payment Now
              </button>
            )}

            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Home size={20} />
              Back to Home
            </button>
          </div>

          {/* Note */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> You can complete the payment later by using the retry link sent to your email, or by contacting our support team with your application number.
            </p>
          </div>

          {/* Support Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              Need help completing your payment?
            </p>
            <p className="text-sm text-gray-600">
              Email:{' '}
              <a href="mailto:support@exprowelfare.org" className="text-[#008543] hover:underline font-medium">
                support@exprowelfare.org
              </a>
            </p>
            <p className="text-sm text-gray-600">
              Phone:{' '}
              <a href="tel:+8801234567890" className="text-[#008543] hover:underline font-medium">
                +880 1234-567890
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
