
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard, Book, Settings } from 'lucide-react';
import { ProfileTab } from '@/components/account/ProfileTab';
import { CoursesTab } from '@/components/account/CoursesTab';
import { OrdersTab } from '@/components/account/OrdersTab';
import { SettingsTab } from '@/components/account/SettingsTab';

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

            <TabsContent value="profile">
              <ProfileTab
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                onSave={handleSaveProfile}
              />
            </TabsContent>

            <TabsContent value="courses">
              <CoursesTab courses={courses} />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersTab orders={orders} />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
