
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Clock, Users, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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

  const courses: Course[] = [
    {
      id: '1',
      title: 'Полный курс трейдинга Форекс',
      description: 'Изучите основы торговли на рынке Форекс от А до Я. Практические стратегии, управление рисками и психология трейдинга.',
      price: 4999,
      originalPrice: 7999,
      duration: '40 часов',
      students: 1250,
      rating: 4.8,
      level: 'beginner',
      features: [
        'Основы Форекс торговли',
        'Технический анализ',
        'Фундаментальный анализ',
        'Управление рисками',
        'Психология трейдинга',
        'Практические стратегии'
      ],
      image: '/lovable-uploads/a7a07a1f-0f0d-453b-8d07-32767312672d.png'
    },
    {
      id: '2',
      title: 'Продвинутые стратегии трейдинга',
      description: 'Освойте профессиональные торговые стратегии и алгоритмы для успешной торговли на финансовых рынках.',
      price: 6999,
      originalPrice: 9999,
      duration: '60 часов',
      students: 850,
      rating: 4.9,
      level: 'advanced',
      features: [
        'Алгоритмический трейдинг',
        'Высокочастотная торговля',
        'Арбитражные стратегии',
        'Портфельное управление',
        'Автоматизация торговли'
      ],
      image: '/lovable-uploads/bc061cd0-6147-4c2b-8788-9fbadd5d9608.png'
    },
    {
      id: '3',
      title: 'Психология успешного трейдера',
      description: 'Развейте правильное мышление трейдера и научитесь контролировать эмоции для стабильной прибыли.',
      price: 2999,
      duration: '25 часов',
      students: 2100,
      rating: 4.7,
      level: 'intermediate',
      features: [
        'Психология рынка',
        'Управление эмоциями',
        'Дисциплина в торговле',
        'Формирование привычек'
      ],
      image: '/lovable-uploads/cc2b5ae9-e199-45de-b86f-79807e893c3e.png'
    }
  ];

  const addToCart = (courseId: string) => {
    if (!cart.includes(courseId)) {
      setCart([...cart, courseId]);
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
          {cart.length > 0 && (
            <div className="mt-6">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => window.location.href = '/checkout'}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Корзина ({cart.length}) - Перейти к оформлению
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="bg-trading-card border-gray-800 overflow-hidden group hover:border-blue-500 transition-colors">
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                {course.originalPrice && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-600 text-white">
                      Скидка {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                    </Badge>
                  </div>
                )}
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
                    <span className="text-2xl font-bold text-green-400">₽{course.price.toLocaleString()}</span>
                    {course.originalPrice && (
                      <span className="ml-2 text-lg text-gray-500 line-through">
                        ₽{course.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => addToCart(course.id)}
                  disabled={cart.includes(course.id)}
                >
                  {cart.includes(course.id) ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Добавлено в корзину
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
