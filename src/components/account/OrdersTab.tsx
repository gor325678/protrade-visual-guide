
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface Order {
    id: string;
    date: string;
    amount: number;
    status: string;
    items: string[];
}

interface OrdersTabProps {
    orders: Order[];
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
    const { t, language } = useLanguage();

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <Card key={order.id} className="bg-trading-card border-gray-800">
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-4">
                            <div>
                                <p className="text-gray-400 text-sm">{t('orders.number')}</p>
                                <p className="font-semibold">{order.id}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{t('orders.date')}</p>
                                <p>{new Date(order.date).toLocaleDateString(language === 'uk' ? 'uk-UA' : 'ru-RU')}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{t('orders.amount')}</p>
                                <p className="font-semibold">₽{order.amount.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{t('orders.status')}</p>
                                <Badge className="bg-green-100 text-green-800">{t('orders.completed')}</Badge>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-400 text-sm mb-2">{t('orders.items')}</p>
                            {order.items.map((item, index) => (
                                <p key={index} className="text-sm">{item}</p>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
