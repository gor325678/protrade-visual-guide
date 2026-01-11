import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, AlertCircle, TrendingUp } from 'lucide-react';

const SYMBOLS = [
    // Forex Majors
    { value: 'EURUSD', label: 'EUR/USD', type: 'forex' },
    { value: 'GBPUSD', label: 'GBP/USD', type: 'forex' },
    { value: 'USDJPY', label: 'USD/JPY', type: 'forex' },
    { value: 'USDCHF', label: 'USD/CHF', type: 'forex' },
    { value: 'AUDUSD', label: 'AUD/USD', type: 'forex' },
    { value: 'USDCAD', label: 'USD/CAD', type: 'forex' },
    { value: 'NZDUSD', label: 'NZD/USD', type: 'forex' },
    // Crosses
    { value: 'EURGBP', label: 'EUR/GBP', type: 'forex' },
    { value: 'EURJPY', label: 'EUR/JPY', type: 'forex' },
    { value: 'GBPJPY', label: 'GBP/JPY', type: 'forex' },
    // Crypto
    { value: 'BTCUSD', label: 'BTC/USD', type: 'crypto' },
    { value: 'ETHUSD', label: 'ETH/USD', type: 'crypto' },
    // Metals
    { value: 'XAUUSD', label: 'XAU/USD (Gold)', type: 'cfd' },
    { value: 'XAGUSD', label: 'XAG/USD (Silver)', type: 'cfd' },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'UAH'];

interface CalculatorResult {
    lotSize: number;
    riskAmount: number;
    stopLossValue: number;
    pipValue: number;
    pipValueAccountCurrency: number;
    instrument: {
        symbol: string;
        type: string;
        contractSize: number;
        pipSize: number;
    };
    warnings: string[];
}

interface LotCalculatorProps {
    apiUrl?: string;
}

export default function LotCalculator({ apiUrl = '' }: LotCalculatorProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CalculatorResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        accountCurrency: 'USD',
        accountBalance: '',
        riskPercent: '2',
        riskAmount: '',
        stopLossPips: '',
        symbol: 'EURUSD',
        includeSpread: false,
        spreadPips: '',
    });

    const [useRiskAmount, setUseRiskAmount] = useState(false);

    const handleInputChange = (field: string, value: string | boolean) => {
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
                accountBalance: parseFloat(formData.accountBalance),
                riskPercent: useRiskAmount ? undefined : parseFloat(formData.riskPercent),
                riskAmount: useRiskAmount ? parseFloat(formData.riskAmount) : undefined,
                stopLossPips: parseFloat(formData.stopLossPips),
                symbol: formData.symbol,
                includeSpread: formData.includeSpread,
                spreadPips: formData.includeSpread ? parseFloat(formData.spreadPips) || 0 : undefined,
            };

            // Валидация
            if (!payload.accountBalance || isNaN(payload.accountBalance)) {
                throw new Error('Введите размер счёта');
            }
            if (!payload.stopLossPips || isNaN(payload.stopLossPips)) {
                throw new Error('Введите размер стоп-лосса в пипсах');
            }
            if (useRiskAmount) {
                if (!payload.riskAmount || isNaN(payload.riskAmount)) {
                    throw new Error('Введите сумму риска');
                }
            } else {
                if (!payload.riskPercent || isNaN(payload.riskPercent)) {
                    throw new Error('Введите процент риска');
                }
            }

            // Если API URL не указан, делаем локальный расчёт
            if (!apiUrl) {
                // Локальный расчёт для демо
                const riskAmt = useRiskAmount
                    ? payload.riskAmount!
                    : payload.accountBalance * (payload.riskPercent! / 100);

                const pipValue = 10; // упрощённо для USD pairs
                let effectiveSL = payload.stopLossPips;
                if (payload.includeSpread && payload.spreadPips) {
                    effectiveSL += payload.spreadPips;
                }

                const lotSize = riskAmt / (effectiveSL * pipValue);
                const roundedLot = Math.floor(lotSize * 100) / 100;

                setResult({
                    lotSize: roundedLot,
                    riskAmount: riskAmt,
                    stopLossValue: roundedLot * effectiveSL * pipValue,
                    pipValue: pipValue,
                    pipValueAccountCurrency: pipValue,
                    instrument: {
                        symbol: payload.symbol,
                        type: 'forex',
                        contractSize: 100000,
                        pipSize: 0.0001
                    },
                    warnings: payload.includeSpread ? [`Спред ${payload.spreadPips} pips добавлен`] : []
                });
            } else {
                // API запрос
                const response = await fetch(`${apiUrl}/api/calculate/lot`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                if (!response.ok || data.error) {
                    throw new Error(data.error || 'Ошибка расчёта');
                }

                setResult(data);
            }
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
                    <Calculator className="h-5 w-5 text-blue-400" />
                    Калькулятор лота
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Рассчитайте оптимальный размер позиции на основе вашего риска
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Форма */}
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

                    {/* Размер счёта */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Размер счёта</Label>
                        <Input
                            type="number"
                            placeholder="10000"
                            value={formData.accountBalance}
                            onChange={e => handleInputChange('accountBalance', e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                        />
                    </div>

                    {/* Риск */}
                    <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-gray-300">
                                {useRiskAmount ? 'Риск в деньгах' : 'Риск в %'}
                            </Label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">%</span>
                                <Switch
                                    checked={useRiskAmount}
                                    onCheckedChange={setUseRiskAmount}
                                />
                                <span className="text-xs text-gray-400">$</span>
                            </div>
                        </div>
                        {useRiskAmount ? (
                            <Input
                                type="number"
                                placeholder="200"
                                value={formData.riskAmount}
                                onChange={e => handleInputChange('riskAmount', e.target.value)}
                                className="bg-gray-800 border-gray-600 text-white"
                            />
                        ) : (
                            <Input
                                type="number"
                                placeholder="2"
                                value={formData.riskPercent}
                                onChange={e => handleInputChange('riskPercent', e.target.value)}
                                className="bg-gray-800 border-gray-600 text-white"
                            />
                        )}
                    </div>

                    {/* Стоп-лосс */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Стоп-лосс (pips)</Label>
                        <Input
                            type="number"
                            placeholder="50"
                            value={formData.stopLossPips}
                            onChange={e => handleInputChange('stopLossPips', e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                        />
                    </div>

                    {/* Инструмент */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Валютная пара</Label>
                        <Select value={formData.symbol} onValueChange={v => handleInputChange('symbol', v)}>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                                {SYMBOLS.map(s => (
                                    <SelectItem key={s.value} value={s.value} className="text-white hover:bg-gray-700">
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Учитывать спред */}
                    <div className="md:col-span-2 space-y-3">
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={formData.includeSpread}
                                onCheckedChange={v => handleInputChange('includeSpread', v)}
                            />
                            <Label className="text-gray-300">Учитывать спред</Label>
                        </div>
                        {formData.includeSpread && (
                            <Input
                                type="number"
                                placeholder="Спред в pips"
                                value={formData.spreadPips}
                                onChange={e => handleInputChange('spreadPips', e.target.value)}
                                className="bg-gray-800 border-gray-600 text-white max-w-[200px]"
                            />
                        )}
                    </div>
                </div>

                {/* Кнопка расчёта */}
                <Button
                    onClick={handleCalculate}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                >
                    {loading ? 'Расчёт...' : 'Рассчитать'}
                </Button>

                {/* Ошибка */}
                {error && (
                    <Alert className="bg-red-900/30 border-red-700">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-300">{error}</AlertDescription>
                    </Alert>
                )}

                {/* Результат */}
                {result && (
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-400" />
                            Результат
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
                                <p className="text-sm text-green-300">Размер лота</p>
                                <p className="text-3xl font-bold text-green-400">{result.lotSize}</p>
                            </div>
                            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
                                <p className="text-sm text-blue-300">Сумма риска</p>
                                <p className="text-2xl font-bold text-blue-400">
                                    {result.riskAmount.toFixed(2)} {formData.accountCurrency}
                                </p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Pip Value</p>
                                <p className="text-lg font-semibold text-white">
                                    {result.pipValueAccountCurrency.toFixed(2)} {formData.accountCurrency}
                                </p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Стоп-лосс</p>
                                <p className="text-lg font-semibold text-white">
                                    {result.stopLossValue.toFixed(2)} {formData.accountCurrency}
                                </p>
                            </div>
                        </div>

                        {result.warnings && result.warnings.length > 0 && (
                            <Alert className="bg-yellow-900/30 border-yellow-700">
                                <AlertCircle className="h-4 w-4 text-yellow-400" />
                                <AlertDescription className="text-yellow-300">
                                    {result.warnings.join('. ')}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-sm text-gray-400">
                    <p className="font-semibold text-gray-300 mb-2">📖 Как использовать калькулятор лота?</p>
                    <p className="mb-3">
                        Калькулятор помогает определить оптимальный размер позиции (лот) на основе вашего допустимого риска и размера стоп-лосса.
                    </p>
                    <p className="font-medium text-gray-300 mb-1">Пример:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-500">
                        <li>Счёт: $10,000, Риск: 2% ($200), Стоп-лосс: 50 pips</li>
                        <li>Pip Value для EUR/USD ≈ $10 за лот</li>
                        <li>Лот = $200 / (50 × $10) = <strong className="text-blue-400">0.40 лота</strong></li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
