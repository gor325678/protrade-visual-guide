// Калькулятор размера лота
// lotSize = riskAmount / (stopLossPips × pipValue)

import { getInstrument, Instrument } from '../data/instruments';

export interface LotCalculatorInput {
    accountCurrency: 'USD' | 'EUR' | 'GBP' | 'UAH';
    accountBalance: number;
    riskPercent?: number;
    riskAmount?: number;
    stopLossPips: number;
    symbol: string;
    currentRate?: number;
    leverage?: number;
    includeSpread?: boolean;
    spreadPips?: number;
}

export interface LotCalculatorResult {
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

// Приблизительные курсы для конвертации (в реальности нужен API)
const approximateRates: Record<string, number> = {
    'EURUSD': 1.08,
    'GBPUSD': 1.27,
    'USDJPY': 148.50,
    'USDCHF': 0.88,
    'USDCAD': 1.36,
    'AUDUSD': 0.66,
    'NZDUSD': 0.61,
    'UAHUSD': 0.024, // 1 UAH = 0.024 USD (approx 41.5 UAH per USD)
    'EURUAH': 45.0,
    'USDUAH': 41.5,
};

function getApproxRate(symbol: string): number {
    return approximateRates[symbol] || 1;
}

// Конвертация pip value в валюту счёта
function convertPipValueToAccountCurrency(
    pipValue: number,
    quoteCurrency: string,
    accountCurrency: string,
    currentRate?: number
): number {
    if (quoteCurrency === accountCurrency) {
        return pipValue;
    }

    // USD-based conversions
    if (quoteCurrency === 'USD' && accountCurrency === 'EUR') {
        const rate = currentRate || getApproxRate('EURUSD');
        return pipValue / rate;
    }

    if (quoteCurrency === 'USD' && accountCurrency === 'UAH') {
        const rate = getApproxRate('USDUAH');
        return pipValue * rate;
    }

    if (quoteCurrency === 'JPY' && accountCurrency === 'USD') {
        const rate = currentRate || getApproxRate('USDJPY');
        return pipValue / rate;
    }

    if (quoteCurrency === 'CHF' && accountCurrency === 'USD') {
        const rate = currentRate || getApproxRate('USDCHF');
        return pipValue / rate;
    }

    if (quoteCurrency === 'CAD' && accountCurrency === 'USD') {
        const rate = currentRate || getApproxRate('USDCAD');
        return pipValue / rate;
    }

    if (quoteCurrency === 'GBP' && accountCurrency === 'USD') {
        const rate = currentRate || getApproxRate('GBPUSD');
        return pipValue * rate;
    }

    // Default: assume 1:1 if no conversion available
    return pipValue;
}

export function calculateLot(input: LotCalculatorInput): LotCalculatorResult {
    const warnings: string[] = [];

    // Получаем инструмент
    const instrument = getInstrument(input.symbol);
    if (!instrument) {
        throw new Error(`Unknown instrument: ${input.symbol}`);
    }

    // Рассчитываем сумму риска
    let riskAmount: number;
    if (input.riskAmount !== undefined && input.riskAmount > 0) {
        riskAmount = input.riskAmount;
    } else if (input.riskPercent !== undefined && input.riskPercent > 0) {
        riskAmount = input.accountBalance * (input.riskPercent / 100);
    } else {
        throw new Error('Either riskPercent or riskAmount must be provided');
    }

    // Проверка на слишком большой риск
    if (riskAmount > input.accountBalance * 0.1) {
        warnings.push('Риск превышает 10% от баланса - это очень агрессивно!');
    }

    // Расчёт pip value в валюте счёта
    const pipValueQuote = instrument.pipValue; // pip value в quote currency
    const pipValueAccount = convertPipValueToAccountCurrency(
        pipValueQuote,
        instrument.quoteCurrency,
        input.accountCurrency,
        input.currentRate
    );

    // Учёт спреда если нужно
    let effectiveStopLoss = input.stopLossPips;
    if (input.includeSpread && input.spreadPips) {
        effectiveStopLoss += input.spreadPips;
        warnings.push(`Спред ${input.spreadPips} пипсов добавлен к стоп-лоссу`);
    }

    // Основная формула: lot = riskAmount / (stopLoss * pipValue)
    const lotSize = riskAmount / (effectiveStopLoss * pipValueAccount);

    // Округляем до допустимого шага лота
    const roundedLot = Math.floor(lotSize / instrument.lotStep) * instrument.lotStep;

    // Проверки на min/max
    let finalLot = roundedLot;
    if (roundedLot < instrument.minLot) {
        finalLot = instrument.minLot;
        warnings.push(`Минимальный лот для ${instrument.symbol}: ${instrument.minLot}`);
    }
    if (roundedLot > instrument.maxLot) {
        finalLot = instrument.maxLot;
        warnings.push(`Максимальный лот для ${instrument.symbol}: ${instrument.maxLot}`);
    }

    // Рассчитываем реальную стоимость стоп-лосса
    const stopLossValue = finalLot * effectiveStopLoss * pipValueAccount;

    return {
        lotSize: Number(finalLot.toFixed(2)),
        riskAmount: Number(riskAmount.toFixed(2)),
        stopLossValue: Number(stopLossValue.toFixed(2)),
        pipValue: pipValueQuote,
        pipValueAccountCurrency: Number(pipValueAccount.toFixed(4)),
        instrument: {
            symbol: instrument.symbol,
            type: instrument.type,
            contractSize: instrument.contractSize,
            pipSize: instrument.pipSize
        },
        warnings
    };
}
