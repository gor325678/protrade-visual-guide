import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, AlertCircle, DollarSign, Percent } from 'lucide-react';

interface IterationResult {
    iteration: number;
    startAmount: number;
    endAmount: number;
    profit: number;
    isLosing: boolean;
}

interface CompoundResult {
    initialAmount: number;
    finalAmount: number;
    totalInvested: number;
    totalProfit: number;
    totalProfitPercent: number;
    absoluteReturn: number;
    iterations: IterationResult[];
    winningIterations: number;
    losingIterations: number;
    maxDrawdown: number;
}

interface CompoundCalculatorProps {
    apiUrl?: string;
}

// Пресеты
const RATE_PRESETS = [0.5, 1.0, 1.35, 2, 3, 5];
const ITERATION_PRESETS = [5, 7, 12, 30, 100];
const AMOUNT_PRESETS = [50, 100, 500, 1000, 3000];

export default function CompoundCalculator({ apiUrl = '' }: CompoundCalculatorProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CompoundResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const [formData, setFormData] = useState({
        ratePerIteration: '5',
        iterations: '12',
        initialAmount: '100',
        depositWithdraw: '0',
        losingIterations: '',
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
            const rate = parseFloat(formData.ratePerIteration) / 100;
            const iterations = parseInt(formData.iterations);
            const initialAmount = parseFloat(formData.initialAmount);
            const depositPerIteration = parseFloat(formData.depositWithdraw) || 0;

            if (isNaN(rate)) throw new Error('Введите доходность');
            if (!iterations || iterations <= 0) throw new Error('Введите количество итераций');
            if (!initialAmount || initialAmount <= 0) throw new Error('Введите стартовую сумму');
            if (iterations > 365) throw new Error('Максимум 365 итераций');

            // Парсим убыточные итерации
            const losingIterationsSet = new Set<number>();
            if (formData.losingIterations) {
                formData.losingIterations.split(',').forEach(s => {
                    const num = parseInt(s.trim());
                    if (!isNaN(num) && num >= 1 && num <= iterations) {
                        losingIterationsSet.add(num);
                    }
                });
            }

            const iterationsResults: IterationResult[] = [];
            let currentAmount = initialAmount;
            let totalDeposits = initialAmount;
            let maxAmount = initialAmount;
            let maxDrawdown = 0;
            let winCount = 0;
            let loseCount = 0;

            for (let i = 1; i <= iterations; i++) {
                const startAmount = currentAmount;
                const isLosing = losingIterationsSet.has(i);

                let profit: number;
                if (isLosing) {
                    profit = -startAmount * rate;
                    loseCount++;
                } else {
                    profit = startAmount * rate;
                    winCount++;
                }

                const endAmount = startAmount + profit + depositPerIteration;
                if (depositPerIteration > 0) totalDeposits += depositPerIteration;

                if (endAmount > maxAmount) {
                    maxAmount = endAmount;
                } else {
                    const drawdown = ((maxAmount - endAmount) / maxAmount) * 100;
                    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
                }

                iterationsResults.push({
                    iteration: i,
                    startAmount: Number(startAmount.toFixed(2)),
                    endAmount: Number(endAmount.toFixed(2)),
                    profit: Number(profit.toFixed(2)),
                    isLosing,
                });

                currentAmount = endAmount;
            }

            const finalAmount = currentAmount;
            const totalProfit = finalAmount - totalDeposits;
            const totalProfitPercent = (totalProfit / totalDeposits) * 100;
            const absoluteReturn = ((finalAmount - initialAmount) / initialAmount) * 100;

            setResult({
                initialAmount,
                finalAmount: Number(finalAmount.toFixed(2)),
                totalInvested: Number(totalDeposits.toFixed(2)),
                totalProfit: Number(totalProfit.toFixed(2)),
                totalProfitPercent: Number(totalProfitPercent.toFixed(2)),
                absoluteReturn: Number(absoluteReturn.toFixed(2)),
                iterations: iterationsResults,
                winningIterations: winCount,
                losingIterations: loseCount,
                maxDrawdown: Number(maxDrawdown.toFixed(2)),
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
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    Калькулятор сложного процента
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Рассчитайте рост капитала с учётом реинвестирования
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4">
                    {/* Доходность */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Доходность за итерацию (%)</Label>
                        <Input
                            type="number"
                            step="0.1"
                            placeholder="5"
                            value={formData.ratePerIteration}
                            onChange={e => handleInputChange('ratePerIteration', e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                        />
                        <div className="flex flex-wrap gap-2">
                            {RATE_PRESETS.map(r => (
                                <Button
                                    key={r}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleInputChange('ratePerIteration', r.toString())}
                                    className={`text-xs border-gray-600 ${formData.ratePerIteration === r.toString()
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-800 text-gray-300'
                                        }`}
                                >
                                    {r}%
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Количество итераций */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Количество итераций</Label>
                        <Input
                            type="number"
                            placeholder="12"
                            value={formData.iterations}
                            onChange={e => handleInputChange('iterations', e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                        />
                        <div className="flex flex-wrap gap-2">
                            {ITERATION_PRESETS.map(i => (
                                <Button
                                    key={i}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleInputChange('iterations', i.toString())}
                                    className={`text-xs border-gray-600 ${formData.iterations === i.toString()
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-800 text-gray-300'
                                        }`}
                                >
                                    {i}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Стартовая сумма */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Стартовая сумма</Label>
                        <Input
                            type="number"
                            placeholder="100"
                            value={formData.initialAmount}
                            onChange={e => handleInputChange('initialAmount', e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                        />
                        <div className="flex flex-wrap gap-2">
                            {AMOUNT_PRESETS.map(a => (
                                <Button
                                    key={a}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleInputChange('initialAmount', a.toString())}
                                    className={`text-xs border-gray-600 ${formData.initialAmount === a.toString()
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-800 text-gray-300'
                                        }`}
                                >
                                    ${a}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Пополнения */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Пополнение за итерацию (опционально)</Label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={formData.depositWithdraw}
                            onChange={e => handleInputChange('depositWithdraw', e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                        />
                    </div>

                    {/* Убыточные итерации */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Убыточные итерации (напр: 1,3,5)</Label>
                        <Input
                            type="text"
                            placeholder="Оставьте пустым или: 1,3,5"
                            value={formData.losingIterations}
                            onChange={e => handleInputChange('losingIterations', e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleCalculate}
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
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
                        <h3 className="text-lg font-semibold text-white">Результат инвестирования</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-400 flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" /> Сумма на начало
                                </p>
                                <p className="text-xl font-semibold text-white">${result.initialAmount}</p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Всего инвестировано</p>
                                <p className="text-xl font-semibold text-white">${result.totalInvested}</p>
                            </div>
                            <div className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-700 col-span-2">
                                <p className="text-sm text-emerald-300">Сумма на конец периода</p>
                                <p className="text-3xl font-bold text-emerald-400">${result.finalAmount}</p>
                            </div>
                            <div className={`p-4 rounded-lg border ${result.totalProfit >= 0
                                ? 'bg-green-900/30 border-green-700'
                                : 'bg-red-900/30 border-red-700'
                                }`}>
                                <p className={`text-sm ${result.totalProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                    Размер дохода
                                </p>
                                <p className={`text-xl font-bold ${result.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {result.totalProfit >= 0 ? '+' : ''}${result.totalProfit}
                                </p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-400 flex items-center gap-1">
                                    <Percent className="h-3 w-3" /> Доходность
                                </p>
                                <p className="text-xl font-semibold text-white">{result.absoluteReturn}%</p>
                            </div>
                        </div>

                        {/* Статистика */}
                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-700">
                            <div className="text-center">
                                <p className="text-xs text-gray-400">Прибыльных</p>
                                <p className="text-lg font-semibold text-green-400">{result.winningIterations}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400">Убыточных</p>
                                <p className="text-lg font-semibold text-red-400">{result.losingIterations}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400">Макс просадка</p>
                                <p className="text-lg font-semibold text-yellow-400">{result.maxDrawdown}%</p>
                            </div>
                        </div>

                        {/* Детализация по итерациям */}
                        {result.iterations.length <= 20 && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="w-full bg-gray-700 border-gray-600 text-gray-300"
                                >
                                    {showDetails ? 'Скрыть детали' : 'Показать по итерациям'}
                                </Button>

                                {showDetails && (
                                    <div className="max-h-64 overflow-y-auto space-y-2">
                                        {result.iterations.map(iter => (
                                            <div
                                                key={iter.iteration}
                                                className={`flex justify-between items-center p-2 rounded text-sm ${iter.isLosing ? 'bg-red-900/20' : 'bg-gray-800/50'
                                                    }`}
                                            >
                                                <span className="text-gray-400">#{iter.iteration}</span>
                                                <span className="text-white">${iter.startAmount}</span>
                                                <span className={iter.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                                                    {iter.profit >= 0 ? '+' : ''}{iter.profit}
                                                </span>
                                                <span className="text-white font-medium">${iter.endAmount}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-sm text-gray-400">
                    <p className="font-semibold text-gray-300 mb-2">📖 Что такое сложный процент?</p>
                    <p className="mb-3">
                        Сложный процент — это начисление прибыли на прибыль. Вместо вывода прибыли, вы реинвестируете её, что ускоряет рост капитала.
                    </p>
                    <p className="font-medium text-gray-300 mb-1">Пример:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-500">
                        <li>Стартовая сумма: $100, Доходность: 5% за итерацию, Итераций: 12</li>
                        <li>После 12 итераций: $100 × (1.05)^12 = <strong className="text-emerald-400">$179.59</strong></li>
                        <li>Прибыль: +$79.59 (+79.6%)</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
