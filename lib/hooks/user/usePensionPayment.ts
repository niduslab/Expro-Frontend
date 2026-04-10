import { useState, useCallback } from 'react';
import { pensionPaymentService } from '@/lib/services/pensionPayment.service';
import { toast } from 'sonner';

interface UsePensionPaymentOptions {
  onSuccess?: (payment: any) => void;
  onError?: (error: any) => void;
}

export function usePensionPayment(options: UsePensionPaymentOptions = {}) {
  const { onSuccess, onError } = options;

  const [loading, setLoading] = useState(false);

  /**
   * Initiate pension installment payment
   */
  const initiatePayment = useCallback(
    async (enrollmentId: number, count: number) => {
      setLoading(true);

      try {
        const response = await pensionPaymentService.initiatePayment(
          enrollmentId,
          {
            count,
            payment_method: 'bkash',
          }
        );

        console.log("✅ Payment Response:", response);
        console.log("📦 Payment Data:", response.data);

        if (response.success && response.data) {
          const paymentData = response.data;

          // Store payment ID for callback handling
          localStorage.setItem(
            'pending_pension_payment_id',
            paymentData.payment_id.toString()
          );
          localStorage.setItem(
            'pending_pension_enrollment_id',
            enrollmentId.toString()
          );

          console.log("🔗 Redirecting to payment URL:", paymentData.bkashURL);

          toast.success(response.message || 'Redirecting to payment gateway...');

          // Redirect to bKash payment URL directly (like membership payment)
          if (paymentData.payment_method === 'bkash' && paymentData.bkashURL) {
            // Direct redirect to bKash payment page
            // bKash will redirect back to backend callback after payment
            // Backend will then redirect to /dashboard/pensions/payment-callback
            window.location.href = paymentData.bkashURL;
          } else if (paymentData.gateway_url) {
            // For other gateways
            window.location.href = paymentData.gateway_url;
          } else {
            console.error("❌ No payment URL found in response");
            toast.error('Payment URL not found. Please contact support.');
            setLoading(false);
          }
        } else {
          toast.error(response.message || 'Failed to initiate payment');
          setLoading(false);
        }

        return response;
      } catch (error: any) {
        console.error('Payment initiation error:', error);
        const errorMessage =
          error.response?.data?.message || 'Failed to initiate payment';
        toast.error(errorMessage);
        onError?.(error);
        setLoading(false);
        throw error;
      }
    },
    [onError]
  );

  /**
   * Complete payment after callback
   */
  const completePayment = useCallback(
    async (paymentId: number, transactionId?: string) => {
      try {
        const response = await pensionPaymentService.completePayment({
          payment_id: paymentId,
          status: 'success',
          gateway_transaction_id: transactionId,
        });

        if (response.success) {
          localStorage.setItem('pension_payment_completed', 'true');
          localStorage.removeItem('pending_pension_payment_id');
          localStorage.removeItem('pending_pension_enrollment_id');
          toast.success('Payment completed successfully!');
          onSuccess?.(response);
        } else {
          toast.error(response.message || 'Payment confirmation failed');
          onError?.(response);
        }

        return response;
      } catch (error: any) {
        console.error('Payment completion error:', error);
        const errorMessage =
          error.response?.data?.message || 'Payment confirmation failed';
        toast.error(errorMessage);
        onError?.(error);
        throw error;
      }
    },
    [onSuccess, onError]
  );

  /**
   * Report payment failure
   */
  const reportPaymentFailure = useCallback(
    async (paymentId: number) => {
      try {
        const response = await pensionPaymentService.completePayment({
          payment_id: paymentId,
          status: 'failed',
        });

        localStorage.removeItem('pending_pension_payment_id');
        localStorage.removeItem('pending_pension_enrollment_id');
        toast.error('Payment failed. Please try again.');
        onError?.(response);

        return response;
      } catch (error: any) {
        console.error('Payment failure report error:', error);
        onError?.(error);
        throw error;
      }
    },
    [onError]
  );

  const cancelPayment = useCallback(() => {
    const paymentId = localStorage.getItem('pending_pension_payment_id');
    if (paymentId) {
      reportPaymentFailure(parseInt(paymentId));
    }
    setLoading(false);
  }, [reportPaymentFailure]);

  return {
    initiatePayment,
    completePayment,
    reportPaymentFailure,
    cancelPayment,
    loading,
  };
}
