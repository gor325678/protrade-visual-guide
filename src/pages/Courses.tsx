
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Course, CourseCard } from '@/components/courses/CourseCard';
import { FeaturesSection } from '@/components/courses/FeaturesSection';

const Courses = () => {
  const { t } = useLanguage();
  const [cart, setCart] = useState<string[]>([]);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const { toast } = useToast();

  const courses: Course[] = [
    {
      id: '1',
      title: 'Система ProTrader Systems',
      description: 'Освойте одну из самых мощных и прибыльных систем в мире трейдинга для получения стабильной прибыли.',
      price: 1700,
      duration: '21 час',
      students: 850,
      rating: 5.0,
      level: 'advanced',
      features: [
        'Мощные торговые стратегии',
        'Система управления рисками',
        'Психология профессионального трейдера',
        'Анализ рыночных тенденций',
        'Практические торговые сессии',
        'Пожизненная поддержка'
      ],
      image: '/lovable-uploads/a7a07a1f-0f0d-453b-8d07-32767312672d.png'
    }
  ];

  const addToCart = async (courseId: string) => {
    if (cart.includes(courseId)) {
      await handlePurchase(courseId);
      return;
    }

    setCart([...cart, courseId]);
    toast({
      title: 'Курс добавлен в корзину',
      description: 'Теперь вы можете перейти к оплате',
    });
  };

  const handlePurchase = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      console.error('Course not found:', courseId);
      return;
    }

    setProcessingPayment(courseId);
    console.log('=== STARTING PAYMENT PROCESS ===');
    console.log('Course:', course.title);
    console.log('Price in USD:', course.price);
    console.log('Amount to be sent to Stripe (should be in cents):', course.price * 100);

    try {
      console.log('Calling create-payment-intent function...');
      const requestBody = {
        amount: course.price, // Отправляем в долларах, Edge Function конвертирует в центы
        currency: 'usd',
        courseId: course.id,
      };
      console.log('Request body being sent:', requestBody);

      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: requestBody,
      });

      console.log('Function response data:', data);
      console.log('Function response error:', error);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to create payment intent');
      }

      if (!data?.clientSecret) {
        console.error('No clientSecret in response:', data);
        throw new Error('No client secret received from server');
      }

      console.log('Payment intent created successfully for $' + course.price);
      console.log('Client secret received:', data.clientSecret.substring(0, 20) + '...');

      localStorage.setItem('stripe_client_secret', data.clientSecret);
      localStorage.setItem('course_for_purchase', JSON.stringify(course));

      console.log('Data saved to localStorage, redirecting to checkout...');

      // Переходим на страницу оплаты
      window.location.href = '/checkout';

    } catch (error: any) {
      console.error('=== PAYMENT ERROR ===');
      console.error('Error type:', typeof error);
      console.error('Error message:', error?.message);
      console.error('Full format error:', error);

      toast({
        title: 'Ошибка оплаты',
        description: error?.message || 'Не удалось создать платеж. Попробуйте еще раз.',
        variant: 'destructive',
      });
    } finally {
      setProcessingPayment(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Каталог курсов трейдинга</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Выберите курс, который поможет вам стать успешным трейдером.
            Все курсы включают практические задания и пожизненный доступ к материалам.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="max-w-md">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isInCart={cart.includes(course.id)}
                isProcessing={processingPayment === course.id}
                onAction={addToCart}
              />
            ))}
          </div>
        </div>

        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
};

export default Courses;

