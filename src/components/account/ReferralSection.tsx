import React, { useState, useEffect } from 'react';
import { Copy, Share2, Gift, CheckCircle, DollarSign, Users, TrendingUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface ReferralStats {
    totalReferrals: number;
    successfulReferrals: number;
    pendingReferrals: number;
    totalEarnings: number;
    pendingEarnings: number;
}

interface ReferralSectionProps {
    userId: string;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({ userId }) => {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState<ReferralStats>({
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0
    });

    // Generate referral link
    const referralCode = userId.slice(0, 8).toUpperCase();
    const referralLink = `${window.location.origin}/?ref=${referralCode}`;

    // Commission amount (10% of $1700)
    const COMMISSION_PER_SALE = 170;

    useEffect(() => {
        if (userId) {
            fetchReferralStats();
        }
    }, [userId]);

    const fetchReferralStats = async () => {
        try {
            // Fetch referral stats from Supabase
            const { data, error } = await supabase
                .from('referrals')
                .select('*')
                .eq('referrer_id', userId);

            if (error) {
                console.error('Error fetching referrals:', error);
                return;
            }

            if (data) {
                const successful = data.filter(r => r.status === 'completed');
                const pending = data.filter(r => r.status === 'pending');

                setStats({
                    totalReferrals: data.length,
                    successfulReferrals: successful.length,
                    pendingReferrals: pending.length,
                    totalEarnings: successful.length * COMMISSION_PER_SALE,
                    pendingEarnings: pending.length * COMMISSION_PER_SALE
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            toast({
                title: "Ссылка скопирована!",
                description: "Поделитесь ею с друзьями"
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareToTelegram = () => {
        const text = encodeURIComponent(`🚀 Хочешь научиться трейдингу по системе? Смотри Pro Trader Systems — курс с реальными результатами +296% за месяц!\n\nПереходи по ссылке и получи скидку 10%:`);
        const url = encodeURIComponent(referralLink);
        window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
    };

    const shareLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'ProTrader Systems - Обучение трейдингу',
                    text: '🚀 Присоединяйся к Pro Trader Systems! Курс с реальными результатами +296%',
                    url: referralLink
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            copyToClipboard();
        }
    };

    return (
        <div className="space-y-6">
            {/* Main Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-800/50">
                    <CardContent className="p-4 text-center">
                        <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-green-400">${stats.totalEarnings}</div>
                        <div className="text-xs text-gray-400">Заработано</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border-yellow-800/50">
                    <CardContent className="p-4 text-center">
                        <TrendingUp className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-yellow-400">${stats.pendingEarnings}</div>
                        <div className="text-xs text-gray-400">На рассмотрении</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-800/50">
                    <CardContent className="p-4 text-center">
                        <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-purple-400">{stats.successfulReferrals}</div>
                        <div className="text-xs text-gray-400">Успешных рефералов</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-800/50">
                    <CardContent className="p-4 text-center">
                        <Gift className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-blue-400">{stats.pendingReferrals}</div>
                        <div className="text-xs text-gray-400">Ожидают покупки</div>
                    </CardContent>
                </Card>
            </div>

            {/* Referral Link Card */}
            <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-800/50">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                            <DollarSign className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Получите $170 за каждого друга!</h3>
                            <p className="text-sm text-gray-400">10% от стоимости курса — ваша комиссия</p>
                        </div>
                    </div>

                    {/* Referral Link Input */}
                    <div className="mb-6">
                        <label className="text-sm text-gray-400 mb-2 block">Ваша партнёрская ссылка:</label>
                        <div className="bg-gray-900 rounded-lg p-3 flex items-center gap-2 border border-gray-700">
                            <code className="flex-1 text-sm text-green-400 truncate font-mono">{referralLink}</code>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={copyToClipboard}
                                className="shrink-0"
                            >
                                {copied ? (
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                ) : (
                                    <Copy className="h-5 w-5 text-gray-400" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Share Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={copyToClipboard}
                            variant="outline"
                            className="flex-1 border-purple-700 text-purple-400 hover:bg-purple-900/30"
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Копировать ссылку
                        </Button>
                        <Button
                            onClick={shareToTelegram}
                            className="flex-1 bg-[#0088cc] hover:bg-[#0077b5]"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Отправить в Telegram
                        </Button>
                        <Button
                            onClick={shareLink}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                            <Share2 className="h-4 w-4 mr-2" />
                            Поделиться
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Gift className="h-5 w-5 text-purple-400" />
                        Как работает партнёрская программа
                    </h4>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0">1</span>
                            <div>
                                <h5 className="font-semibold text-white mb-1">Поделитесь ссылкой</h5>
                                <p className="text-sm text-gray-400">Отправьте вашу уникальную ссылку друзьям в Telegram или соцсетях</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0">2</span>
                            <div>
                                <h5 className="font-semibold text-white mb-1">Друг покупает курс</h5>
                                <p className="text-sm text-gray-400">Ваш друг получает скидку 10%, а вы — комиссию $170</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0">3</span>
                            <div>
                                <h5 className="font-semibold text-white mb-1">Получите выплату</h5>
                                <p className="text-sm text-gray-400">Деньги переводим на карту или в крипто (USDT TRC-20)</p>
                            </div>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="mt-6 pt-6 border-t border-gray-800">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                Без лимита на количество рефералов
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                Выплаты каждую неделю
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                Друг получает скидку 10%
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                Личная поддержка в Telegram
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* VIP Partner Info */}
            <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-800/50">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold mb-2">
                                🌟 VIP Партнёр
                            </Badge>
                            <h4 className="text-lg font-bold text-white">Пригласите 3+ друзей</h4>
                            <p className="text-sm text-gray-400">И получайте 20% комиссию ($340) с каждой продажи!</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-yellow-400">{stats.successfulReferrals}/3</div>
                            <div className="text-xs text-gray-400">до VIP статуса</div>
                        </div>
                    </div>

                    {/* Progress bar to VIP */}
                    <div className="mt-4">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(stats.successfulReferrals / 3 * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReferralSection;
