
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Shield, Lock, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Checkout = () => {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: ''
  });

  // Моковые данные корзины (в реальном приложении будут из состояния)
  const cartItems = [
    {
      id: '1',
      title: 'Полный курс трейдинга Форекс',
      price: 4999,
      originalPrice: 7999
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discount = cartItems.reduce((sum, item) => sum + (item.originalPrice ? item.originalPrice - item.price : 0), 0);
  const total = subtotal;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика обработки платежа
    console.log('Processing payment...', formData);
    window.location.href = '/payment-success';
  };

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
            {/* Форма оформления заказа */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Контактная информация */}
                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</div>
                      Контактная информация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email адрес *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="firstName">Имя *</Label>
                        <Input
                          id="firstName"
                          placeholder="Иван"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Фамилия *</Label>
                        <Input
                          id="lastName"
                          placeholder="Иванов"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Способ оплаты */}
                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</div>
                      Способ оплаты
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex items-center gap-2 p-4 border rounded-lg transition-colors ${
                          paymentMethod === 'card' 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <CreditCard className="h-5 w-5" />
                        Банковская карта
                      </button>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="cardNumber">Номер карты *</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            required
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="expiryDate">Срок действия *</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                              required
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange('cvv', e.target.value)}
                              required
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 p-3 rounded-lg">
                      <Shield className="h-4 w-4 text-green-500" />
                      Ваши платежные данные защищены SSL-шифрованием
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Lock className="mr-2 h-5 w-5" />
                  Завершить покупку - ₽{total.toLocaleString()}
                </Button>
              </form>
            </div>

            {/* Сводка заказа */}
            <div className="lg:col-span-1">
              <Card className="bg-trading-card border-gray-800 sticky top-4">
                <CardHeader>
                  <CardTitle>Ваш заказ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        {item.originalPrice && (
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              Скидка ₽{(item.originalPrice - item.price).toLocaleString()}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₽{item.price.toLocaleString()}</div>
                        {item.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            ₽{item.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <Separator className="bg-gray-700" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Подытог:</span>
                      <span>₽{subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-500">
                        <span>Скидка:</span>
                        <span>-₽{discount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Итого:</span>
                    <span>₽{total.toLocaleString()}</span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Shield className="h-4 w-4 text-green-500" />
                      30-дневная гарантия возврата денег
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Lock className="h-4 w-4 text-blue-500" />
                      Пожизненный доступ к курсу
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
