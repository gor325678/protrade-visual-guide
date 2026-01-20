import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '@/lib/stripe';
import type { Stripe } from '@stripe/stripe-js';

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
  amount?: number;
  currency?: string;
}

const StripeProvider: React.FC<StripeProviderProps> = ({
  children,
  clientSecret,
  amount,
  currency = 'usd'
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stripePromise.then((s) => {
      setStripe(s);
      setLoading(false);
    });
  }, []);

  // If Stripe is not configured, show a message instead of crashing
  if (!loading && !stripe) {
    return (
      <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg text-yellow-400 text-center">
        Оплата временно недоступна. Пожалуйста, свяжитесь с поддержкой.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#3b82f6',
        colorBackground: '#1a1f2e',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
    ...(amount && {
      amount,
      currency,
    }),
  };

  return (
    <Elements stripe={stripe} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
