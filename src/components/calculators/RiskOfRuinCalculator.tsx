import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert, AlertCircle, Target, Percent, TrendingDown } from 'lucide-react';

interface RiskOfRuinResult {
    riskOfRuin: number;
    interpretation: string;
    riskLevel: 'low' | 'medium' | 'high' | 'extreme';
}

interface RiskOfRuinCalculatorProps {
    apiUrl?: string;
}

// Presets
const RR_PRESETS = [1, 1.5, 2, 3, 5];
const WINRATE_PRESETS = [40, 50, 55, 60, 70];
const RISK_PRESETS = [0.5, 1, 2, 3, 5];

export default function RiskOfRuinCalculator({ apiUrl = '' }: RiskOfRuinCalculatorProps) {
    const [rewardRiskRatio, setRewardRiskRatio] = useState<string>('2');
    const [winRate, setWinRate] = useState<string>('50');
    const [riskPerTrade, setRiskPerTrade] = useState<string>('2');
    const [result, setResult] = useState<RiskOfRuinResult | null>(null);
    const [error, setError] = useState<string>('');
    const [isCalculating, setIsCalculating] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setError('');
        if (field === 'rewardRiskRatio') setRewardRiskRatio(value);
        if (field === 'winRate') setWinRate(value);
        if (field === 'riskPerTrade') setRiskPerTrade(value);
    };

    const handleCalculate = () => {
        setIsCalculating(true);
        setError('');
        setResult(null);

        try {
            const rr = parseFloat(rewardRiskRatio);
            const wr = parseFloat(winRate) / 100; // Convert to decimal
            const risk = parseFloat(riskPerTrade) / 100; // Convert to decimal

            if (isNaN(rr) || isNaN(wr) || isNaN(risk)) {
                setError('Пожалуйста, введите корректные числовые значения.');
                setIsCalculating(false);
                return;
            }

            if (wr <= 0 || wr >= 1) {
                setError('Процент прибыльных сделок должен быть от 1% до 99%.');
                setIsCalculating(false);
                return;
            }

            if (risk <= 0 || risk >= 1) {
                setError('Риск на сделку должен быть от 0.1% до 99%.');
                setIsCalculating(false);
                return;
            }

            if (rr <= 0) {
                setError('Соотношение Прибыль/Риск должно быть больше 0.');
                setIsCalculating(false);
                return;
            }

            // Risk of Ruin formula (simplified Kelly-based approximation)
            // RoR = ((1 - edge) / (1 + edge))^units
            // where edge = (wr * rr) - (1 - wr)
            // units = 1 / risk (number of "units" in account)

            const edge = (wr * rr) - (1 - wr);
            let riskOfRuin = 0;

            if (edge <= 0) {
                // Negative or zero edge means eventual ruin is certain
                riskOfRuin = 100;
            } else {
                const winAmount = rr;
                const lossAmount = 1;
                const p = wr;
                const q = 1 - wr;

                // Using the formula: RoR = (q/p)^n where n = units at risk
                // Simplified: RoR = ((1 - edge) / (1 + edge))^(1/risk)
                const units = 1 / risk;
                const ratio = (1 - edge) / (1 + edge);

                if (ratio <= 0) {
                    riskOfRuin = 0;
                } else {
                    riskOfRuin = Math.pow(ratio, units) * 100;
                }

                // Clamp to 0-100%
                riskOfRuin = Math.max(0, Math.min(100, riskOfRuin));
            }

            let interpretation = '';
            let riskLevel: 'low' | 'medium' | 'high' | 'extreme' = 'low';

            if (riskOfRuin < 1) {
                interpretation = 'Отличный риск-менеджмент! Вероятность разорения крайне мала.';
                riskLevel = 'low';
            } else if (riskOfRuin < 5) {
                interpretation = 'Хороший уровень риска. Продолжайте придерживаться плана.';
                riskLevel = 'low';
            } else if (riskOfRuin < 15) {
                interpretation = 'Умеренный риск. Рассмотрите снижение риска на сделку.';
                riskLevel = 'medium';
            } else if (riskOfRuin < 30) {
                interpretation = 'Высокий риск! Необходимо пересмотреть стратегию или уменьшить размер позиции.';
                riskLevel = 'high';
            } else {
                interpretation = 'Критический уровень риска! Такой подход с высокой вероятностью приведёт к потере депозита.';
                riskLevel = 'extreme';
            }

            setResult({
                riskOfRuin: parseFloat(riskOfRuin.toFixed(2)),
                interpretation,
                riskLevel
            });

        } catch (err) {
            setError('Ошибка расчёта. Проверьте введённые данные.');
        } finally {
            setIsCalculating(false);
        }
    };

    const getRiskLevelColor = (level: string) => {
        switch (level) {
            case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
            case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
            case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
            case 'extreme': return 'text-red-400 bg-red-500/10 border-red-500/30';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
        }
    };

    return (
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-800">
                <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <div className="p-2 bg-rose-500/20 rounded-lg">
                        <ShieldAlert className="h-6 w-6 text-rose-400" />
                    </div>
                    Калькулятор Risk of Ruin
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Рассчитайте вероятность полной потери депозита при вашей стратегии
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Reward/Risk Ratio */}
                    <div className="space-y-3">
                        <Label htmlFor="rewardRiskRatio" className="text-gray-300 flex items-center gap-2">
                            <Target className="h-4 w-4 text-rose-400" />
                            Соотношение Прибыль/Риск
                        </Label>
                        <Input
                            id="rewardRiskRatio"
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={rewardRiskRatio}
                            onChange={(e) => handleInputChange('rewardRiskRatio', e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="Например: 2"
                        />
                        <div className="flex flex-wrap gap-2">
                            {RR_PRESETS.map((preset) => (
                                <Button
                                    key={preset}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setRewardRiskRatio(preset.toString())}
                                    className={`text-xs border-gray-700 hover:bg-gray-700 ${rewardRiskRatio === preset.toString() ? 'bg-rose-500/20 border-rose-500' : ''}`}
                                >
                                    {preset}:1
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Win Rate */}
                    <div className="space-y-3">
                        <Label htmlFor="winRate" className="text-gray-300 flex items-center gap-2">
                            <Percent className="h-4 w-4 text-rose-400" />
                            Прибыльных сделок (%)
                        </Label>
                        <Input
                            id="winRate"
                            type="number"
                            step="1"
                            min="1"
                            max="99"
                            value={winRate}
                            onChange={(e) => handleInputChange('winRate', e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="Например: 50"
                        />
                        <div className="flex flex-wrap gap-2">
                            {WINRATE_PRESETS.map((preset) => (
                                <Button
                                    key={preset}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setWinRate(preset.toString())}
                                    className={`text-xs border-gray-700 hover:bg-gray-700 ${winRate === preset.toString() ? 'bg-rose-500/20 border-rose-500' : ''}`}
                                >
                                    {preset}%
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Risk Per Trade */}
                    <div className="space-y-3">
                        <Label htmlFor="riskPerTrade" className="text-gray-300 flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-rose-400" />
                            Риск от депозита на сделку (%)
                        </Label>
                        <Input
                            id="riskPerTrade"
                            type="number"
                            step="0.5"
                            min="0.1"
                            max="50"
                            value={riskPerTrade}
                            onChange={(e) => handleInputChange('riskPerTrade', e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="Например: 2"
                        />
                        <div className="flex flex-wrap gap-2">
                            {RISK_PRESETS.map((preset) => (
                                <Button
                                    key={preset}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setRiskPerTrade(preset.toString())}
                                    className={`text-xs border-gray-700 hover:bg-gray-700 ${riskPerTrade === preset.toString() ? 'bg-rose-500/20 border-rose-500' : ''}`}
                                >
                                    {preset}%
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Calculate Button */}
                <div className="mt-8">
                    <Button
                        onClick={handleCalculate}
                        disabled={isCalculating}
                        className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-6 text-lg shadow-lg shadow-rose-900/30"
                    >
                        {isCalculating ? 'Расчёт...' : 'Рассчитать риск разорения'}
                    </Button>
                </div>

                {/* Error */}
                {error && (
                    <Alert className="mt-6 bg-red-500/10 border-red-500/30">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-400">{error}</AlertDescription>
                    </Alert>
                )}

                {/* Result */}
                {result && (
                    <div className={`mt-8 p-6 rounded-xl border ${getRiskLevelColor(result.riskLevel)}`}>
                        <div className="text-center mb-4">
                            <p className="text-gray-400 text-sm mb-2">Риск разорения:</p>
                            <p className="text-5xl font-bold">{result.riskOfRuin}%</p>
                        </div>
                        <p className="text-center text-sm mt-4">{result.interpretation}</p>

                        <div className="mt-6 pt-4 border-t border-current/20 grid grid-cols-3 gap-4 text-center text-sm">
                            <div>
                                <p className="text-gray-500">R:R</p>
                                <p className="font-semibold">{rewardRiskRatio}:1</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Win Rate</p>
                                <p className="font-semibold">{winRate}%</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Риск/Сделка</p>
                                <p className="font-semibold">{riskPerTrade}%</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-sm text-gray-400">
                    <p className="font-semibold text-gray-300 mb-2">💡 Что такое Risk of Ruin?</p>
                    <p>
                        Risk of Ruin (Риск Разорения) — это статистическая вероятность полной потери торгового капитала.
                        Зависит от вашего процента выигрышных сделок, соотношения прибыль/риск и размера риска на каждую сделку.
                        Профессиональные трейдеры стремятся к RoR менее 1%.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
