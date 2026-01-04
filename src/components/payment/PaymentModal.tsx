import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Copy, X, CheckCircle, ExternalLink, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// 👇 ВСТАВТЕ СЮДИ СВОЮ АДРЕСУ ГАМАНЦЯ
const MY_WALLET = "TVk2qAy4m4NckAZHWHK5fiaKRRMJ1Lb6xC";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
    courseTitle: string;
    price: number;
    userId: string;
}

export default function PaymentModal({
    isOpen,
    onClose,
    courseId,
    courseTitle,
    price,
    userId
}: PaymentModalProps) {
    const [hash, setHash] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'payment' | 'success'>('payment');
    const { toast } = useToast();

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(MY_WALLET);
        toast({
            title: "✓ Скопійовано!",
            description: "Адреса гаманця у буфері обміну"
        });
    };

    const validateTxHash = (txHash: string): boolean => {
        // TRC-20 transaction hash is 64 characters (hexadecimal)
        const tronHashRegex = /^[a-fA-F0-9]{64}$/;
        return tronHashRegex.test(txHash.trim());
    };

    const handleSubmit = async () => {
        const trimmedHash = hash.trim();

        if (!trimmedHash) {
            toast({
                title: "Помилка",
                description: "Будь ласка, введіть хеш транзакції",
                variant: "destructive"
            });
            return;
        }

        if (!validateTxHash(trimmedHash)) {
            toast({
                title: "Невірний формат",
                description: "Хеш транзакції має бути 64 символи (0-9, A-F)",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            // Check if this hash was already used
            const { data: existingOrder } = await supabase
                .from('orders')
                .select('id')
                .eq('tx_hash', trimmedHash)
                .single();

            if (existingOrder) {
                toast({
                    title: "Помилка",
                    description: "Цей хеш вже використовувався для іншого замовлення",
                    variant: "destructive"
                });
                setLoading(false);
                return;
            }

            // Create order
            const { error } = await supabase
                .from('orders')
                .insert([{
                    user_id: userId,
                    course_id: courseId,
                    amount: price,
                    tx_hash: trimmedHash,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;

            setStep('success');
            toast({
                title: "✓ Заявку відправлено!",
                description: "Ми перевіримо оплату протягом 24 годин",
            });

        } catch (error: any) {
            console.error('Payment error:', error);
            toast({
                title: "Помилка",
                description: error.message || "Не вдалося відправити заявку",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setHash('');
        setStep('payment');
        onClose();
    };

    const openTronscan = () => {
        window.open(`https://tronscan.org/#/address/${MY_WALLET}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative animate-in slide-in-from-bottom duration-300">

                {/* Декоративний фон */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                {/* Кнопка закриття */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 md:p-8 relative z-10">
                    {step === 'payment' ? (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    Оплата курсу
                                </h2>
                                <p className="text-gray-400">
                                    <span className="text-blue-400 font-semibold">{courseTitle}</span>
                                </p>
                            </div>

                            {/* Інструкції */}
                            <Alert className="mb-6 bg-blue-900/20 border-blue-800/50">
                                <Info className="h-4 w-4 text-blue-400" />
                                <AlertDescription className="text-sm text-gray-300">
                                    <strong className="text-blue-400">Крок 1:</strong> Надішліть {price} USDT на вказану адресу<br />
                                    <strong className="text-blue-400">Крок 2:</strong> Вставте хеш транзакції нижче<br />
                                    <strong className="text-blue-400">Крок 3:</strong> Ми підтвердимо оплату протягом 24 год
                                </AlertDescription>
                            </Alert>

                            {/* Блок з гаманцем */}
                            <div className="bg-gray-800/50 backdrop-blur p-5 rounded-xl mb-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs text-gray-400 uppercase font-semibold">
                                        Надішліть {price} USDT (TRC-20)
                                    </p>
                                    <button
                                        onClick={openTronscan}
                                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                    >
                                        Перевірити <ExternalLink className="h-3 w-3" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <code className="flex-1 bg-black/50 p-3 rounded-lg text-xs md:text-sm text-yellow-400 font-mono break-all border border-gray-700">
                                        {MY_WALLET}
                                    </code>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={handleCopy}
                                        className="shrink-0 bg-gray-700 border-gray-600 hover:bg-gray-600 h-10 w-10"
                                    >
                                        <Copy className="w-4 h-4 text-white" />
                                    </Button>
                                </div>

                                <Alert className="bg-red-900/20 border-red-800/50">
                                    <AlertCircle className="h-4 w-4 text-red-400" />
                                    <AlertDescription className="text-xs text-red-300">
                                        ⚠️ Використовуйте ТІЛЬКИ мережу <strong>TRC-20 (Tron)</strong>.
                                        Інші мережі призведуть до втрати коштів!
                                    </AlertDescription>
                                </Alert>
                            </div>

                            {/* Форма для хешу */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block font-medium">
                                        Хеш транзакції (TXID)
                                    </label>
                                    <Input
                                        placeholder="Вставте 64-символьний хеш (напр: a1b2c3d4...)"
                                        value={hash}
                                        onChange={(e) => setHash(e.target.value)}
                                        className="bg-gray-800 border-gray-700 text-white h-12 font-mono text-sm"
                                        maxLength={64}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Знайдіть у вашому гаманці після відправки
                                    </p>
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-semibold shadow-lg hover:shadow-green-900/50 transition-all"
                                    disabled={loading || !hash.trim()}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Перевірка...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Підтвердити оплату
                                        </>
                                    )}
                                </Button>
                            </div>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Після підтвердження оплати доступ буде відкрито автоматично
                            </p>
                        </>
                    ) : (
                        // Success Screen
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                                <CheckCircle className="w-12 h-12 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3">
                                Заявку отримано!
                            </h3>
                            <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                                Ми перевіримо вашу транзакцію протягом <strong className="text-white">24 годин</strong> і
                                відкриємо доступ до курсу автоматично.
                            </p>

                            <Alert className="bg-blue-900/20 border-blue-800/50 mb-6">
                                <Info className="h-4 w-4 text-blue-400" />
                                <AlertDescription className="text-sm text-gray-300">
                                    Ви отримаєте email-повідомлення, коли доступ буде активовано
                                </AlertDescription>
                            </Alert>

                            <Button
                                onClick={handleClose}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Закрити
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
