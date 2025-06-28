import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface PaymentIntentData {
  amount: number;
  currency: string;
  courseId: string;
  customerEmail?: string;
}

export const useStripePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { toast } = useToast();

  const createPaymentIntent = async (data: PaymentIntentData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      return clientSecret;
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать платежное намерение',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPaymentIntent,
    clientSecret,
    isLoading,
  };
};