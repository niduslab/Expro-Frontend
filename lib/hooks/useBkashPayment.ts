import { useState, useCallback } from 'react';
import { bkashService } from '@/lib/services/bkash.service';
import { toast } from 'react-hot-toast';

interface UseBkashPaymentOptions {
  onSuccess?: (payment: any) => void;
  onError?: (error: any) => void;
}

interface PaymentData {
  bkashURL: string;
  payment_id: number;
  paymentID?: string;
}

export function useBkashPayment(options: UseBkashPaymentOptions = {}) {
  const { onSuccess, onError } = options;

  const [loading, setLoading] = useState(false);
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);

  /**
   * Open payment gateway URL and handle the callback
   * This is called after the membership application is submitted
   */
  const openPaymentGateway = useCallback(async (paymentData: PaymentData) => {
    setLoading(true);

    try {
      // Store payment ID for callback handling
      localStorage.setItem('pending_payment_id', paymentData.payment_id.toString());

      // Open bKash payment URL in new window
      const newWindow = window.open(
        paymentData.bkashURL,
        'bKash Payment',
        'width=600,height=700,scrollbars=yes'
      );

      if (!newWindow) {
        toast.error('Please allow popups for payment');
        setLoading(false);
        return;
      }

      setPaymentWindow(newWindow);

      // Monitor if window is closed manually
      const checkWindowClosed = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(checkWindowClosed);
          setLoading(false);
          
          // Check if payment was completed
          const paymentCompleted = localStorage.getItem('payment_completed');
          if (!paymentCompleted) {
            toast.error('Payment window closed. Please try again.');
            onError?.({ message: 'Payment window closed' });
          }
        }
      }, 1000);

      return newWindow;
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Failed to open payment gateway');
      onError?.(error);
      setLoading(false);
      return null;
    }
  }, [onError]);

  /**
   * Confirm payment success after callback
   */
  const confirmPaymentSuccess = useCallback(async (paymentId: number, transactionId?: string) => {
    try {
      const response = await bkashService.confirmPaymentSuccess({
        payment_id: paymentId,
        gateway_transaction_id: transactionId,
      });

      if (response.success) {
        localStorage.setItem('payment_completed', 'true');
        localStorage.removeItem('pending_payment_id');
        toast.success('Payment completed successfully!');
        onSuccess?.(response.data);
      } else {
        toast.error(response.message || 'Payment confirmation failed');
        onError?.(response);
      }

      return response;
    } catch (error: any) {
      console.error('Payment confirmation error:', error);
      toast.error(error.response?.data?.message || 'Payment confirmation failed');
      onError?.(error);
      throw error;
    }
  }, [onSuccess, onError]);

  /**
   * Report payment failure
   */
  const reportPaymentFailure = useCallback(async (paymentId: number, reason?: string) => {
    try {
      const response = await bkashService.reportPaymentFailure({
        payment_id: paymentId,
        failure_reason: reason || 'Payment cancelled by user',
      });

      localStorage.removeItem('pending_payment_id');
      toast.error('Payment failed. Please try again.');
      onError?.(response);

      return response;
    } catch (error: any) {
      console.error('Payment failure report error:', error);
      onError?.(error);
      throw error;
    }
  }, [onError]);

  /**
   * Retry payment for an existing application
   */
  const retryPayment = useCallback(async (applicationId: number, paymentMethod: 'bkash' | 'sslcommerz' = 'bkash') => {
    setLoading(true);

    try {
      const response = await bkashService.retryPayment(applicationId, {
        payment_method: paymentMethod,
      });

      if (response.success && response.data) {
        // Store new payment ID
        localStorage.setItem('pending_payment_id', response.data.payment_id.toString());

        // Open payment gateway
        if (paymentMethod === 'bkash' && response.data.bkashURL) {
          await openPaymentGateway({
            bkashURL: response.data.bkashURL,
            payment_id: response.data.payment_id,
            paymentID: response.data.paymentID,
          });
        } else if (response.data.gateway_url) {
          window.location.href = response.data.gateway_url;
        }
      } else {
        toast.error(response.message || 'Failed to retry payment');
        setLoading(false);
      }

      return response;
    } catch (error: any) {
      console.error('Payment retry error:', error);
      toast.error(error.response?.data?.message || 'Failed to retry payment');
      setLoading(false);
      throw error;
    }
  }, [openPaymentGateway]);

  const cancelPayment = useCallback(() => {
    if (paymentWindow && !paymentWindow.closed) {
      paymentWindow.close();
      setPaymentWindow(null);
      setLoading(false);
      
      const paymentId = localStorage.getItem('pending_payment_id');
      if (paymentId) {
        reportPaymentFailure(parseInt(paymentId), 'Payment cancelled by user');
      }
    }
  }, [paymentWindow, reportPaymentFailure]);

  return {
    openPaymentGateway,
    confirmPaymentSuccess,
    reportPaymentFailure,
    retryPayment,
    cancelPayment,
    loading,
  };
}
