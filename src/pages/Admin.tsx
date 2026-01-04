import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
    Check,
    Copy,
    ExternalLink,
    RefreshCw,
    X,
    Clock,
    CheckCircle,
    XCircle,
    DollarSign,
    Users,
    TrendingUp
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// 👇 ВСТАВТЕ СЮДИ ВАШ ADMIN EMAIL
const ADMIN_EMAIL = "valt76248@gmail.com";

interface Order {
    id: string;
    user_id: string;
    course_id: string;
    amount: number;
    tx_hash: string;
    status: string;
    created_at: string;
}

interface OrderWithDetails extends Order {
    user_email?: string;
    course_title?: string;
}

interface Stats {
    pending: number;
    completed: number;
    rejected: number;
    totalRevenue: number;
}

export default function Admin() {
    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [stats, setStats] = useState<Stats>({ pending: 0, completed: 0, rejected: 0, totalRevenue: 0 });
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Доступ заборонено",
                    description: "Потрібна авторизація",
                    variant: "destructive"
                });
                navigate('/login');
                return;
            }

            if (user.email !== ADMIN_EMAIL) {
                toast({
                    title: "Доступ заборонено",
                    description: "Ця сторінка доступна тільки для адміністраторів",
                    variant: "destructive"
                });
                navigate('/');
                return;
            }

            setIsAdmin(true);
            fetchOrders();
            fetchStats();
        } catch (error) {
            console.error('Admin check error:', error);
            navigate('/');
        }
    };

    const fetchStats = async () => {
        try {
            const { data: allOrders, error } = await supabase
                .from('orders')
                .select('status, amount');

            if (error) throw error;

            const pending = allOrders?.filter(o => o.status === 'pending').length || 0;
            const completed = allOrders?.filter(o => o.status === 'completed').length || 0;
            const rejected = allOrders?.filter(o => o.status === 'rejected').length || 0;
            const totalRevenue = allOrders
                ?.filter(o => o.status === 'completed')
                .reduce((sum, o) => sum + (o.amount || 0), 0) || 0;

            setStats({ pending, completed, rejected, totalRevenue });
        } catch (error) {
            console.error('Stats fetch error:', error);
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Отримуємо pending замовлення
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;

            // Для кожного замовлення отримуємо email користувача та назву курсу
            const enrichedOrders = await Promise.all(
                (ordersData || []).map(async (order) => {
                    // Отримуємо email користувача
                    const { data: userData } = await supabase.auth.admin.getUserById(order.user_id);

                    // Отримуємо назву курсу
                    const { data: courseData } = await supabase
                        .from('courses')
                        .select('title')
                        .eq('id', order.course_id)
                        .single();

                    return {
                        ...order,
                        user_email: userData?.user?.email || 'Unknown',
                        course_title: courseData?.title || 'Unknown Course'
                    };
                })
            );

            setOrders(enrichedOrders);
        } catch (error: any) {
            console.error('Fetch orders error:', error);
            toast({
                title: "Помилка",
                description: "Не вдалося завантажити замовлення",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (orderId: string, userId: string, courseId: string) => {
        try {
            // 1. Створюємо enrollment
            const { error: enrollError } = await supabase
                .from('enrollments')
                .insert([{
                    user_id: userId,
                    course_id: courseId,
                    enrolled_at: new Date().toISOString(),
                    progress: 0
                }]);

            if (enrollError) {
                // Перевіряємо, чи це помилка дубліката
                if (enrollError.code === '23505') {
                    toast({
                        title: "Увага",
                        description: "Користувач вже має доступ до цього курсу",
                        variant: "destructive"
                    });
                    return;
                }
                throw enrollError;
            }

            // 2. Оновлюємо статус замовлення
            const { error: orderError } = await supabase
                .from('orders')
                .update({
                    status: 'completed',
                    verified_at: new Date().toISOString()
                })
                .eq('id', orderId);

            if (orderError) throw orderError;

            toast({
                title: "✓ Успішно!",
                description: "Доступ видано, замовлення підтверджено"
            });

            // Оновлюємо списки
            fetchOrders();
            fetchStats();
        } catch (error: any) {
            console.error('Approve error:', error);
            toast({
                title: "Помилка",
                description: error.message || "Не вдалося підтвердити замовлення",
                variant: "destructive"
            });
        }
    };

    const handleReject = async (orderId: string) => {
        if (!confirm('Ви впевнені, що хочете відхилити це замовлення?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('orders')
                .update({
                    status: 'rejected',
                    verified_at: new Date().toISOString()
                })
                .eq('id', orderId);

            if (error) throw error;

            toast({
                title: "Замовлення відхилено",
                description: "Статус оновлено"
            });

            fetchOrders();
            fetchStats();
        } catch (error: any) {
            toast({
                title: "Помилка",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "✓ Скопійовано",
            description: "Текст у буфері обміну"
        });
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-trading-dark flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Перевірка доступу...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-trading-dark text-white">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Адмін-панель 👮‍♂️</h1>
                        <p className="text-gray-400">Управління замовленнями та доступом до курсів</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => {
                            fetchOrders();
                            fetchStats();
                        }}
                        disabled={loading}
                        className="border-gray-700"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Оновити
                    </Button>
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-yellow-900/20 border-yellow-800/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                На перевірці
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-900/20 border-green-800/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Підтверджено
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-900/20 border-red-800/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                <XCircle className="h-4 w-4" />
                                Відхилено
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-400">{stats.rejected}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-900/20 border-blue-800/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Дохід
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-400">{stats.totalRevenue} USDT</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Таблиця замовлень */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Замовлення на перевірці ({orders.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {orders.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <Clock className="h-16 w-16 mx-auto mb-4 text-gray-700" />
                                <p className="text-lg mb-2">Немає нових замовлень</p>
                                <p className="text-sm">Всі замовлення опрацьовано</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-800 text-gray-400 text-sm uppercase">
                                            <th className="p-4">Дата</th>
                                            <th className="p-4">Користувач</th>
                                            <th className="p-4">Курс</th>
                                            <th className="p-4">Сума</th>
                                            <th className="p-4">TX Hash</th>
                                            <th className="p-4 text-right">Дії</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-800/50 transition">
                                                <td className="p-4 text-gray-300">
                                                    <div className="text-sm">
                                                        {new Date(order.created_at).toLocaleDateString('uk-UA')}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(order.created_at).toLocaleTimeString('uk-UA')}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-sm font-medium text-white">
                                                        {order.user_email}
                                                    </div>
                                                    <div className="text-xs font-mono text-gray-500">
                                                        ID: {order.user_id.slice(0, 8)}...
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-sm text-blue-400">
                                                        {order.course_title}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge className="bg-green-600 hover:bg-green-700 font-mono">
                                                        {order.amount} USDT
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <code className="bg-black/30 px-2 py-1 rounded text-xs font-mono text-yellow-500 max-w-[120px] truncate">
                                                            {order.tx_hash}
                                                        </code>
                                                        <button
                                                            onClick={() => copyToClipboard(order.tx_hash)}
                                                            className="text-gray-400 hover:text-white transition-colors"
                                                            title="Копіювати"
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                        <a
                                                            href={`https://tronscan.org/#/transaction/${order.tx_hash}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-gray-400 hover:text-white transition-colors"
                                                            title="Перевірити в Tronscan"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700"
                                                            onClick={() => handleApprove(order.id, order.user_id, order.course_id)}
                                                        >
                                                            <Check className="w-4 h-4 mr-1" />
                                                            Підтвердити
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-red-800 text-red-400 hover:bg-red-900/20"
                                                            onClick={() => handleReject(order.id)}
                                                        >
                                                            <X className="w-4 h-4 mr-1" />
                                                            Відхилити
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Alert className="mt-6 bg-blue-900/20 border-blue-800/50">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <AlertDescription className="text-sm text-gray-300">
                        <strong>Інструкція:</strong> При підтвердженні замовлення автоматично створюється запис в таблиці <code className="bg-black/30 px-1 py-0.5 rounded text-yellow-400">enrollments</code> і користувач отримує доступ до курсу.
                    </AlertDescription>
                </Alert>
            </main>

            <Footer />
        </div>
    );
}
