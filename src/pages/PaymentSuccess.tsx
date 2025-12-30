
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Play, Mail } from 'lucide-react';

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Оплата прошла успешно!</h1>
            <p className="text-xl text-gray-300">
              Спасибо за покупку! Ваш курс готов к изучению.
            </p>
          </div>

          <Card className="bg-trading-card border-gray-800 mb-8">
            <CardHeader>
              <CardTitle>Детали заказа</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 text-left">
                <div>
                  <p className="text-gray-400">Номер заказа:</p>
                  <p className="font-semibold">#TRD-2024-001234</p>
                </div>
                <div>
                  <p className="text-gray-400">Дата покупки:</p>
                  <p className="font-semibold">{new Date().toLocaleDateString('ru-RU')}</p>
                </div>
                <div>
                  <p className="text-gray-400">Курс:</p>
                  <p className="font-semibold">Полный курс трейдинга Форекс</p>
                </div>
                <div>
                  <p className="text-gray-400">Сумма:</p>
                  <p className="font-semibold">₽4,999</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-6 text-center">
                <Play className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Начать обучение</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Приступите к изучению материалов прямо сейчас
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Перейти к курсу
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-6 text-center">
                <Download className="h-8 w-8 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Скачать материалы</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Дополнительные PDF и файлы для изучения
                </p>
                <Button variant="outline" className="w-full border-gray-700">
                  Скачать
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Письмо подтверждения</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Проверьте свою почту для получения деталей
                </p>
                <Button variant="outline" className="w-full border-gray-700">
                  Повторно отправить
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">🎉 Добро пожаловать в сообщество трейдеров!</h3>
            <p className="text-gray-300 mb-4">
              Теперь у вас есть доступ к:
            </p>
            <div className="grid gap-2 md:grid-cols-2 text-left max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>40+ часов видеоуроков</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Практические задания</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Закрытое сообщество</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Поддержка экспертов</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => window.location.href = '/account'}
            >
              Личный кабинет
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-700"
              onClick={() => window.location.href = '/courses'}
            >
              Посмотреть другие курсы
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
