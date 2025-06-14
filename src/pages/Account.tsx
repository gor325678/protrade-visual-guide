
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, CreditCard, Book, Settings, Shield, Bell } from 'lucide-react';

const Account = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: 'Иван',
    lastName: 'Иванов',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67'
  });

  const [isEditing, setIsEditing] = useState(false);

  const courses = [
    {
      id: '1',
      title: 'Полный курс трейдинга Форекс',
      progress: 35,
      purchaseDate: '2024-01-15',
      status: 'active'
    }
  ];

  const orders = [
    {
      id: 'TRD-2024-001234',
      date: '2024-01-15',
      amount: 4999,
      status: 'completed',
      items: ['Полный курс трейдинга Форекс']
    }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Здесь будет логика сохранения профиля
    console.log('Saving profile:', userInfo);
  };

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full bg-trading-card border-gray-800">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Профиль
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Мои курсы
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                История заказов
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Настройки
              </TabsTrigger>
            </TabsList>

            {/* Профиль */}
            <TabsContent value="profile">
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Информация профиля</CardTitle>
                    <Button 
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    >
                      {isEditing ? 'Сохранить' : 'Редактировать'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">Имя</Label>
                      <Input
                        id="firstName"
                        value={userInfo.firstName}
                        onChange={(e) => setUserInfo(prev => ({...prev, firstName: e.target.value}))}
                        disabled={!isEditing}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Фамилия</Label>
                      <Input
                        id="lastName"
                        value={userInfo.lastName}
                        onChange={(e) => setUserInfo(prev => ({...prev, lastName: e.target.value}))}
                        disabled={!isEditing}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo(prev => ({...prev, email: e.target.value}))}
                      disabled={!isEditing}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo(prev => ({...prev, phone: e.target.value}))}
                      disabled={!isEditing}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Мои курсы */}
            <TabsContent value="courses">
              <div className="space-y-4">
                {courses.map((course) => (
                  <Card key={course.id} className="bg-trading-card border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                          <p className="text-gray-400">Куплен: {new Date(course.purchaseDate).toLocaleDateString('ru-RU')}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Активен</Badge>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Прогресс:</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Продолжить обучение
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* История заказов */}
            <TabsContent value="orders">
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="bg-trading-card border-gray-800">
                    <CardContent className="p-6">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div>
                          <p className="text-gray-400 text-sm">Номер заказа</p>
                          <p className="font-semibold">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Дата</p>
                          <p>{new Date(order.date).toLocaleDateString('ru-RU')}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Сумма</p>
                          <p className="font-semibold">₽{order.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Статус</p>
                          <Badge className="bg-green-100 text-green-800">Выполнен</Badge>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-gray-400 text-sm mb-2">Товары:</p>
                        {order.items.map((item, index) => (
                          <p key={index} className="text-sm">{item}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Настройки */}
            <TabsContent value="settings">
              <div className="space-y-6">
                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Уведомления
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email уведомления</p>
                        <p className="text-sm text-gray-400">Получать новости о курсах и обновлениях</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push уведомления</p>
                        <p className="text-sm text-gray-400">Уведомления в браузере</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Безопасность
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full border-gray-700">
                      Изменить пароль
                    </Button>
                    <Button variant="outline" className="w-full border-gray-700">
                      Настроить двухфакторную аутентификацию
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
