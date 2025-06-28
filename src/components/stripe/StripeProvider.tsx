import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '@/lib/stripe';

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
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;