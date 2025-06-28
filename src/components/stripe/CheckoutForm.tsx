import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CheckoutFormProps {
  amount: number;
  currency: string;
  onSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, currency, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        toast({
          title: 'Ошибка оплаты',
          description: error.message || 'Произошла ошибка при обработке платежа',
          variant: 'destructive',
        });
      } else {
        onSuccess();
      }
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: 'Произошла неожиданная ошибка',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-trading-card border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Безопасная оплата
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Платежная информация</h3>
            <PaymentElement />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Адрес для выставления счета</h3>
            <AddressElement options={{ mode: 'billing' }} />
          </div>

          <Button
            type="submit"
            disabled={!stripe || isLoading}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Обработка платежа...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Оплатить ${amount / 100}
              </>
            )}
          </Button>

          <div className="text-center text-sm text-gray-400">
            <p>Ваши платежные данные защищены 256-битным SSL шифрованием</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;