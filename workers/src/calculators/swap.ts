// Калькулятор свопов
// swapCost = lots × swapRate × nights × pipValue

import { getInstrument, getSwapRate } from '../data/instruments';

export interface SwapCalculatorInput {
    symbol: string;
    volume: number; // в лотах
    nights: number;
    direction: 'buy' | 'sell';
    accountCurrency?: 'USD' | 'EUR' | 'GBP' | 'UAH';
}

export interface SwapCalculatorResult {
    swapCost: number; // в валюте счёта
    swapRate: number; // points per lot per night
    totalPips: number;
    perNight: number;
    direction: string;
    instrument: {
        symbol: string;
        type: string;
    };
    warning?: string;
}

// Курсы для конвертации
const rates: Record<string, number> = {
    'USDUAH': 41.5,
    'EURUSD': 1.08,
    'GBPUSD': 1.27,
};

function convertToAccountCurrency(usdValue: number, accountCurrency: string): number {
    if (accountCurrency === 'USD') return usdValue;
    if (accountCurrency === 'UAH') return usdValue * rates['USDUAH'];
    if (accountCurrency === 'EUR') return usdValue / rates['EURUSD'];
    if (accountCurrency === 'GBP') return usdValue / rates['GBPUSD'];
    return usdValue;
}

export function calculateSwap(input: SwapCalculatorInput): SwapCalculatorResult {
    const instrument = getInstrument(input.symbol);
    if (!instrument) {
        throw new Error(`Unknown instrument: ${input.symbol}`);
    }

    const swapRate = getSwapRate(input.symbol);

    let warning: string | undefined;
    let swapPoints: number;

    if (!swapRate) {
        // Если нет данных о свопе, используем примерное значение
        warning = `Точные ставки свопов для ${input.symbol} недоступны. Используется примерное значение.`;
        swapPoints = input.direction === 'buy' ? -5 : -5; // примерное значение
    } else {
        swapPoints = input.direction === 'buy' ? swapRate.swapLong : swapRate.swapShort;
    }

    // Расчёт стоимости свопа
    // swap = lots × swapPoints × pipValue × nights
    const pipValue = instrument.pipValue;
    const totalSwapPips = swapPoints * input.nights;

    // Стоимость в quote currency
    let swapCostQuote = input.volume * Math.abs(totalSwapPips) * (pipValue / 10);

    // Если своп отрицательный (платим), делаем значение отрицательным
    if (swapPoints < 0) {
        swapCostQuote = -swapCostQuote;
    }

    // Конвертация в валюту счёта
    const accountCurrency = input.accountCurrency || 'USD';
    const swapCostAccount = convertToAccountCurrency(swapCostQuote, accountCurrency);
    const perNight = swapCostAccount / input.nights;

    return {
        swapCost: Number(swapCostAccount.toFixed(2)),
        swapRate: swapPoints,
        totalPips: Number(totalSwapPips.toFixed(2)),
        perNight: Number(perNight.toFixed(2)),
        direction: input.direction === 'buy' ? 'Long (Buy)' : 'Short (Sell)',
        instrument: {
            symbol: instrument.symbol,
            type: instrument.type
        },
        warning
    };
}
