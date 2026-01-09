import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Moon, AlertCircle } from 'lucide-react';

const SYMBOLS = [
    { value: 'EURUSD', label: 'EUR/USD' },
    { value: 'GBPUSD', label: 'GBP/USD' },
    { value: 'USDJPY', label: 'USD/JPY' },
    { value: 'AUDUSD', label: 'AUD/USD' },
    { value: 'XAUUSD', label: 'XAU/USD (Gold)' },
    { value: 'BTCUSD', label: 'BTC/USD' },
];

// Примерные свопы (points per lot per night)
const SWAP_RATES: Record<string, { long: number; short: number }> = {
    EURUSD: { long: -6.5, short: 1.2 },
    GBPUSD: { long: -4.8, short: 0.5 },
    USDJPY: { long: 2.1, short: -8.3 },
    AUDUSD: { long: -2.1, short: -1.5 },
    XAUUSD: { long: -25.5, short: 8.2 },
    BTCUSD: { long: -35.0, short: -35.0 },
};

interface SwapResult {
    swapCost: number;
    swapRate: number;
    perNight: number;
    direction: string;
}

interface SwapCalculatorProps {
    apiUrl?: string;
}

export default function SwapCalculator({ apiUrl = '' }: SwapCalculatorProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SwapResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        symbol: 'EURUSD',
        volume: '0.1',
        nights: '1',
        direction: 'buy',
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
            const volume = parseFloat(formData.volume);
            const nights = parseInt(formData.nights);

            if (!volume || isNaN(volume)) {
                throw new Error('Введите объём сделки');
            }
            if (!nights || isNaN(nights)) {
                throw new Error('Введите количество ночей');
            }

            const swapRates = SWAP_RATES[formData.symbol];
            if (!swapRates) {
                throw new Error('Данные о свопах недоступны для этого инструмента');
            }

            const swapRate = formData.direction === 'buy' ? swapRates.long : swapRates.short;
            const pipValue = 10; // упрощённо

            // Своп = лоты × ставка × ночи × pipValue / 10
            const swapCost = volume * swapRate * nights * (pipValue / 10);
            const perNight = swapCost / nights;

            setResult({
                swapCost,
                swapRate,
                perNight,
                direction: formData.direction === 'buy' ? 'Long (Buy)' : 'Short (Sell)',
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
                    <Moon className="h-5 w-5 text-indigo-400" />
                    Калькулятор свопов
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Рассчитайте стоимость переноса позиции через ночь
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
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

                    {/* Направление */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Направление</Label>
                        <Select value={formData.direction} onValueChange={v => handleInputChange('direction', v)}>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="buy" className="text-white hover:bg-gray-700">Buy (Long)</SelectItem>
                                <SelectItem value="sell" className="text-white hover:bg-gray-700">Sell (Short)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Объём */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Объём (лоты)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="0.1"
                            value={formData.volume}
                            onChange={e => handleInputChange('volume', e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                        />
                    </div>

                    {/* Ночи */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Количество ночей</Label>
                        <Input
                            type="number"
                            placeholder="1"
                            value={formData.nights}
                            onChange={e => handleInputChange('nights', e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleCalculate}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg"
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
                            <Moon className="h-5 w-5 text-indigo-400" />
                            Результат
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className={`p-4 rounded-lg border col-span-2 ${result.swapCost >= 0
                                    ? 'bg-green-900/30 border-green-700'
                                    : 'bg-red-900/30 border-red-700'
                                }`}>
                                <p className={`text-sm ${result.swapCost >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                    Общий своп
                                </p>
                                <p className={`text-3xl font-bold ${result.swapCost >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {result.swapCost >= 0 ? '+' : ''}{result.swapCost.toFixed(2)} USD
                                </p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Ставка свопа</p>
                                <p className="text-lg font-semibold text-white">{result.swapRate} points</p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-400">За ночь</p>
                                <p className="text-lg font-semibold text-white">
                                    {result.perNight >= 0 ? '+' : ''}{result.perNight.toFixed(2)} USD
                                </p>
                            </div>
                        </div>

                        <Alert className="bg-blue-900/20 border-blue-800/50">
                            <AlertDescription className="text-xs text-gray-400">
                                ⚠️ Ставки свопов зависят от брокера и могут изменяться. Проверяйте актуальные ставки в терминале.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
