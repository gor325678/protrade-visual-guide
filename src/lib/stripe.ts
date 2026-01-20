import { loadStripe, Stripe } from '@stripe/stripe-js';

// Загружаем Stripe с публичным ключом (только если ключ существует)
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<Stripe | null>;

if (stripePublishableKey && typeof stripePublishableKey === 'string') {
  stripePromise = loadStripe(stripePublishableKey);
} else {
  console.warn('Stripe publishable key is missing. Payment features will be disabled.');
  stripePromise = Promise.resolve(null);
}

export default stripePromise;

export const formatPrice = (amount: number, currency: string = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

export const formatPriceRub = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(amount);
};