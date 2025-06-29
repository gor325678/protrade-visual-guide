
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import StripeProvider from '@/components/stripe/StripeProvider';
import CheckoutForm from '@/components/stripe/CheckoutForm';

interface Course {
  id: string;
  title: string;
  price: number;
}

const Checkout = () => {
  const { t } = useLanguage();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const storedClientSecret = localStorage.getItem('stripe_client_secret');
    const storedCourse = localStorage.getItem('course_for_purchase');

    console.log('=== CHECKOUT PAGE LOADED ===');
    console.log('Stored client secret:', storedClientSecret ? 'Found' : 'Not found');
    console.log('Stored course:', storedCourse ? 'Found' : 'Not found');

    if (storedClientSecret) {
      setClientSecret(storedClientSecret);
    }

    if (storedCourse) {
      const courseData = JSON.parse(storedCourse);
      setCourse(courseData);
      console.log('Course data loaded:', courseData);
      console.log('Course price:', courseData.price, 'USD');
    }
  }, []);

  const handlePaymentSuccess = () => {
    console.log('=== PAYMENT SUCCESS ===');
    localStorage.removeItem('stripe_client_secret');
    localStorage.removeItem('course_for_purchase');
    
    window.location.href = '/payment-success';
  };

  if (!clientSecret || !course) {
    return (
      <div className="min-h-screen flex flex-col bg-trading-dark text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Загрузка...</h1>
            <p className="text-gray-400">Подготавливаем форму оплаты</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const exchangeRates = {
    usdToRub: 93,
    usdToUah: 41
  };

  const priceInRub = Math.round(course.price * exchangeRates.usdToRub);
  const priceInUah = Math.round(course.price * exchangeRates.usdToUah);

  console.log('=== CHECKOUT RENDER ===');
  console.log('Course price USD:', course.price);
  console.log('Price in RUB:', priceInRub);
  console.log('Amount for Stripe (cents):', course.price * 100);

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к курсам
            </Button>
            <h1 className="text-3xl font-bold">Оформление заказа</h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <StripeProvider clientSecret={clientSecret}>
                <CheckoutForm
                  amount={course.price * 100} // Передаем в центах
                  currency="usd"
                  onSuccess={handlePaymentSuccess}
                />
              </StripeProvider>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-trading-card border-gray-800 sticky top-4">
                <CardHeader>
                  <CardTitle>Ваш заказ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{course.title}</h4>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${course.price}</div>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Подытог:</span>
                      <span>${course.price}</span>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Итого:</span>
                      <span>${course.price}</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-400">
                      <div className="flex justify-between">
                        <span>В рублях:</span>
                        <span>{priceInRub.toLocaleString()} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span>В гривнах:</span>
                        <span>{priceInUah.toLocaleString()} ₴</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Shield className="h-4 w-4 text-blue-500" />
                      Пожизненный доступ к курсу
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Shield className="h-4 w-4 text-green-500" />
                      Безопасная оплата через Stripe
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
