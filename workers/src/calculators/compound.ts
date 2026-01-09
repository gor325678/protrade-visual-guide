// Калькулятор сложного процента
// finalAmount = initialAmount × (1 + rate/100)^iterations

export interface CompoundCalculatorInput {
    ratePerIteration: number; // доходность за итерацию в %
    iterations: number;
    initialAmount: number;
    initialLot?: number; // начальный лот (опционально, для отображения)
    depositWithdrawPerIteration?: number; // пополнение/снятие за итерацию
    losingIterations?: string; // список убыточных итераций "1,3,5"
}

export interface IterationResult {
    iteration: number;
    startAmount: number;
    endAmount: number;
    profit: number;
    isLosing: boolean;
    depositWithdraw: number;
}

export interface CompoundCalculatorResult {
    // Сводка
    initialAmount: number;
    finalAmount: number;
    totalInvested: number;
    totalProfit: number;
    totalProfitPercent: number;
    absoluteReturn: number; // доходность по отношению к начальной сумме

    // Детализация
    iterations: IterationResult[];

    // Статистика
    winningIterations: number;
    losingIterations: number;
    maxDrawdown: number;
    averageProfit: number;
}

export function calculateCompound(input: CompoundCalculatorInput): CompoundCalculatorResult {
    if (input.iterations <= 0 || input.iterations > 365) {
        throw new Error('Iterations must be between 1 and 365');
    }

    if (input.initialAmount <= 0) {
        throw new Error('Initial amount must be greater than 0');
    }

    // Парсим убыточные итерации
    const losingIterationsSet = new Set<number>();
    if (input.losingIterations) {
        const parts = input.losingIterations.split(',').map(s => s.trim());
        for (const part of parts) {
            const num = parseInt(part, 10);
            if (!isNaN(num) && num >= 1 && num <= input.iterations) {
                losingIterationsSet.add(num);
            }
        }
    }

    const depositPerIteration = input.depositWithdrawPerIteration || 0;
    const rate = input.ratePerIteration / 100;

    const iterationsResults: IterationResult[] = [];
    let currentAmount = input.initialAmount;
    let totalDeposits = input.initialAmount;
    let maxAmount = input.initialAmount;
    let maxDrawdown = 0;
    let winCount = 0;
    let loseCount = 0;

    for (let i = 1; i <= input.iterations; i++) {
        const startAmount = currentAmount;
        const isLosing = losingIterationsSet.has(i);

        // Применяем рост или убыток
        let profit: number;
        if (isLosing) {
            // В убыточной итерации применяем отрицательную доходность
            profit = -startAmount * rate;
            loseCount++;
        } else {
            profit = startAmount * rate;
            winCount++;
        }

        const endAmount = startAmount + profit + depositPerIteration;

        // Учитываем депозиты
        if (depositPerIteration > 0) {
            totalDeposits += depositPerIteration;
        }

        // Обновляем max drawdown
        if (endAmount > maxAmount) {
            maxAmount = endAmount;
        } else {
            const drawdown = ((maxAmount - endAmount) / maxAmount) * 100;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        }

        iterationsResults.push({
            iteration: i,
            startAmount: Number(startAmount.toFixed(2)),
            endAmount: Number(endAmount.toFixed(2)),
            profit: Number(profit.toFixed(2)),
            isLosing,
            depositWithdraw: depositPerIteration
        });

        currentAmount = endAmount;
    }

    const finalAmount = currentAmount;
    const totalProfit = finalAmount - totalDeposits;
    const totalProfitPercent = (totalProfit / totalDeposits) * 100;
    const absoluteReturn = ((finalAmount - input.initialAmount) / input.initialAmount) * 100;
    const averageProfit = totalProfit / input.iterations;

    return {
        initialAmount: input.initialAmount,
        finalAmount: Number(finalAmount.toFixed(2)),
        totalInvested: Number(totalDeposits.toFixed(2)),
        totalProfit: Number(totalProfit.toFixed(2)),
        totalProfitPercent: Number(totalProfitPercent.toFixed(2)),
        absoluteReturn: Number(absoluteReturn.toFixed(2)),
        iterations: iterationsResults,
        winningIterations: winCount,
        losingIterations: loseCount,
        maxDrawdown: Number(maxDrawdown.toFixed(2)),
        averageProfit: Number(averageProfit.toFixed(2))
    };
}
