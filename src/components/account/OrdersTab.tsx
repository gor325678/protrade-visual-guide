import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExternalLink, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

interface Order {
    id: string;
    course_id: string;
    course_title?: string;
    amount: number;
    tx_hash: string;
    status: 'pending' | 'paid' | 'rejected';
    created_at: string;
}

interface OrdersTabProps {
    orders: Order[];
    loading?: boolean;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders, loading = false }) => {
    const { t, language } = useLanguage();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <Badge className="bg-green-900/50 text-green-400 border border-green-700 hover:bg-green-900/70">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {t('orders.status.paid')}
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge className="bg-red-900/50 text-red-400 border border-red-700 hover:bg-red-900/70">
                        <XCircle className="w-3 h-3 mr-1" />
                        {t('orders.status.rejected')}
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-yellow-900/50 text-yellow-400 border border-yellow-700 hover:bg-yellow-900/70">
                        <Clock className="w-3 h-3 mr-1" />
                        {t('orders.status.pending')}
                    </Badge>
                );
        }
    };

    const shortenHash = (hash: string) => {
        if (!hash) return '';
        return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
    };

    const openTronscan = (hash: string) => {
        window.open(`https://tronscan.org/#/transaction/${hash}`, '_blank');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <Card className="bg-trading-card border-gray-800">
                <CardContent className="p-12 text-center">
                    <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                        {t('orders.no_orders')}
                    </h3>
                    <p className="text-gray-500">
                        {t('orders.no_orders_desc')}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Заголовок */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{t('orders.history')}</h2>
                <Badge variant="outline" className="border-gray-700 text-gray-400">
                    {orders.length} {t('orders.total')}
                </Badge>
            </div>

            {orders.map((order) => (
                <Card key={order.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                    <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Ліва частина: Курс та дата */}
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">
                                    {order.course_title || t('orders.course')}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {new Date(order.created_at).toLocaleDateString(
                                        language === 'uk' ? 'uk-UA' : 'ru-RU',
                                        { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                                    )}
                                </p>
                            </div>

                            {/* Центр: TX Hash */}
                            <div className="flex items-center gap-2">
                                <code className="bg-gray-800 px-3 py-1.5 rounded text-xs font-mono text-yellow-400">
                                    {shortenHash(order.tx_hash)}
                                </code>
                                <button
                                    onClick={() => openTronscan(order.tx_hash)}
                                    className="text-blue-400 hover:text-blue-300 transition-colors p-1.5 hover:bg-blue-900/20 rounded"
                                    title={t('orders.view_on_tronscan')}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Права частина: Сума та статус */}
                            <div className="flex items-center gap-4 md:min-w-[200px] justify-end">
                                <div className="text-right">
                                    <p className="font-bold text-lg">{order.amount} USDT</p>
                                    <p className="text-xs text-gray-500">TRC-20</p>
                                </div>
                                {getStatusBadge(order.status)}
                            </div>
                        </div>

                        {/* Підказка для pending */}
                        {order.status === 'pending' && (
                            <div className="mt-3 pt-3 border-t border-gray-800">
                                <p className="text-xs text-yellow-400/80 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {t('orders.pending_hint')}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
