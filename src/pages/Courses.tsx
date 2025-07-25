import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Clock, Users, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration: string;
  students: number;
  rating: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  features: string[];
  image: string;
}

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
      window.location.href = '/checkout';

    } catch (error) {
      console.error('=== PAYMENT ERROR ===');
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      
      toast({
        title: 'Ошибка оплаты',
        description: error.message || 'Не удалось создать платеж. Попробуйте еще раз.',
        variant: 'destructive',
      });
    } finally {
      setProcessingPayment(null);
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch(level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch(level) {
      case 'beginner': return 'Начинающий';
      case 'intermediate': return 'Средний';
      case 'advanced': return 'Продвинутый';
      default: return level;
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
              <Card key={course.id} className="bg-trading-card border-gray-800 overflow-hidden group hover:border-blue-500 transition-colors">
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className={`absolute top-4 right-4 ${getLevelBadgeColor(course.level)}`}>
                    {getLevelText(course.level)}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-300 mb-4 line-clamp-3">{course.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Что вы изучите:</h4>
                    <ul className="space-y-1">
                      {course.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                      {course.features.length > 4 && (
                        <li className="text-sm text-gray-400">
                          +{course.features.length - 4} дополнительных модулей
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-green-400">${course.price}</span>
                      <div className="text-sm text-gray-400">
                        ≈ {Math.round(course.price * 93).toLocaleString()} ₽
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => addToCart(course.id)}
                    disabled={processingPayment === course.id}
                  >
                    {processingPayment === course.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Обработка...
                      </>
                    ) : cart.includes(course.id) ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Перейти к оплате
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Добавить в корзину
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Почему выбирают наши курсы?</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-trading-card p-6 rounded-lg border border-gray-800">
                <div className="text-blue-500 text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Практический подход</h3>
                <p className="text-gray-300">Все знания подкреплены реальными примерами и практическими заданиями</p>
              </div>
              <div className="bg-trading-card p-6 rounded-lg border border-gray-800">
                <div className="text-green-500 text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Проверенные стратегии</h3>
                <p className="text-gray-300">Методы, которые действительно работают на реальных рынках</p>
              </div>
              <div className="bg-trading-card p-6 rounded-lg border border-gray-800">
                <div className="text-purple-500 text-4xl mb-4">💬</div>
                <h3 className="text-xl font-semibold mb-2">Поддержка сообщества</h3>
                <p className="text-gray-300">Доступ к закрытому сообществу трейдеров и экспертов</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Courses;
