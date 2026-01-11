import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, AlertCircle } from 'lucide-react';

const SYMBOLS = [
    { value: 'EURUSD', label: 'EUR/USD' },
    { value: 'GBPUSD', label: 'GBP/USD' },
    { value: 'USDJPY', label: 'USD/JPY' },
    { value: 'USDCHF', label: 'USD/CHF' },
    { value: 'AUDUSD', label: 'AUD/USD' },
    { value: 'BTCUSD', label: 'BTC/USD' },
    { value: 'ETHUSD', label: 'ETH/USD' },
    { value: 'XAUUSD', label: 'XAU/USD (Gold)' },
];

const LEVERAGES = [1, 10, 25, 50, 100, 200, 500, 1000];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'UAH'];

interface MarginResult {
    requiredMargin: number;
    requiredMarginAccountCurrency: number;
    positionValue: number;
    leverageRatio: string;
}

interface MarginCalculatorProps {
    apiUrl?: string;
}

export default function MarginCalculator({ apiUrl = '' }: MarginCalculatorProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MarginResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        accountCurrency: 'USD',
        symbol: 'EURUSD',
        currentRate: '1.0850',
        leverage: '100',
        volume: '1',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleCalculate = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = {
                accountCurrency: formData.accountCurrency,
                symbol: formData.symbol,
                currentRate: parseFloat(formData.currentRate),
                leverage: parseInt(formData.leverage),
                volume: parseFloat(formData.volume),
            };

            if (!payload.currentRate || isNaN(payload.currentRate)) {
                throw new Error('Введите текущий курс');
            }
            if (!payload.volume || isNaN(payload.volume)) {
                throw new Error('Введите объём');
            }

            // Локальный расчёт
            const contractSize = 100000; // стандарт для forex
            const positionValue = contractSize * payload.volume * payload.currentRate;
            const requiredMargin = positionValue / payload.leverage;

            // Конвертация в валюту счёта
            let marginAccountCurrency = requiredMargin;
            if (payload.accountCurrency === 'UAH') {
                marginAccountCurrency = requiredMargin * 41.5;
            } else if (payload.accountCurrency === 'EUR') {
                marginAccountCurrency = requiredMargin / 1.08;
            }

            setResult({
                requiredMargin,
                requiredMarginAccountCurrency: marginAccountCurrency,
                positionValue,
                leverageRatio: `${payload.leverage}:1`,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full bg-gray-900/50 border-gray-700">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Wallet className="h-5 w-5 text-purple-400" />
                    Калькулятор маржи
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Рассчитайте требуемую маржу для открытия позиции
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Валюта счёта */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Валюта счёта</Label>
                        <Select value={formData.accountCurrency} onValueChange={v => handleInputChange('accountCurrency', v)}>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                                {CURRENCIES.map(c => (
                                    <SelectItem key={c} value={c} className="text-white hover:bg-gray-700">{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Инструмент */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Валютная пара</Label>
                        <Select value={formData.symbol} onValueChange={v => handleInputChange('symbol', v)}>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                                {SYMBOLS.map(s => (
                                    <SelectItem key={s.value} value={s.value} className="text-white hover:bg-gray-700">
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Текущий курс */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Текущий курс</Label>
                        <Input
                            type="number"
                            step="0.0001"
                            placeholder="1.0850"
                            value={formData.currentRate}
                            onChange={e => handleInputChange('currentRate', e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                        />
                    </div>

                    {/* Плечо */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Кредитное плечо</Label>
                        <Select value={formData.leverage} onValueChange={v => handleInputChange('leverage', v)}>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                                {LEVERAGES.map(l => (
                                    <SelectItem key={l} value={l.toString()} className="text-white hover:bg-gray-700">
                                        {l}:1
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Объём */}
                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-gray-300">Объём (лоты)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="1"
                            value={formData.volume}
                            onChange={e => handleInputChange('volume', e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleCalculate}
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg"
                >
                    {loading ? 'Расчёт...' : 'Рассчитать'}
                </Button>

                {error && (
                    <Alert className="bg-red-900/30 border-red-700">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-300">{error}</AlertDescription>
                    </Alert>
                )}

                {result && (
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-purple-400" />
                            Результат
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700 col-span-2">
                                <p className="text-sm text-purple-300">Требуемая маржа</p>
                                <p className="text-3xl font-bold text-purple-400">
                                    {result.requiredMarginAccountCurrency.toFixed(2)} {formData.accountCurrency}
                                </p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Стоимость позиции</p>
                                <p className="text-lg font-semibold text-white">
                                    ${result.positionValue.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Плечо</p>
                                <p className="text-lg font-semibold text-white">{result.leverageRatio}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-sm text-gray-400">
                    <p className="font-semibold text-gray-300 mb-2">📖 Что такое маржа?</p>
                    <p className="mb-3">
                        Маржа — это залог, который брокер блокирует на вашем счёте для открытия позиции. Чем выше плечо, тем меньше маржа.
                    </p>
                    <p className="font-medium text-gray-300 mb-1">Пример:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-500">
                        <li>Пара: EUR/USD, Курс: 1.0850, Объём: 1 лот (100,000 единиц)</li>
                        <li>Плечо: 1:100</li>
                        <li>Маржа = (100,000 × 1.0850) / 100 = <strong className="text-purple-400">$1,085</strong></li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
