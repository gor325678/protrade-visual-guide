// Калькулятор маржи
// margin = (contractSize × lots × currentRate) / leverage

import { getInstrument } from '../data/instruments';

export interface MarginCalculatorInput {
    accountCurrency: 'USD' | 'EUR' | 'GBP' | 'UAH';
    symbol: string;
    currentRate: number;
    leverage: number; // 1, 10, 50, 100, 200, 500, 1000
    volume: number; // в лотах
}

export interface MarginCalculatorResult {
    requiredMargin: number;
    requiredMarginAccountCurrency: number;
    positionValue: number;
    leverageRatio: string;
    instrument: {
        symbol: string;
        type: string;
        contractSize: number;
    };
}

// Приблизительные курсы
const approximateRates: Record<string, number> = {
    'EURUSD': 1.08,
    'GBPUSD': 1.27,
    'USDUAH': 41.5,
};

function convertToAccountCurrency(
    value: number,
    fromCurrency: string,
    accountCurrency: string
): number {
    if (fromCurrency === accountCurrency) return value;

    if (fromCurrency === 'USD' && accountCurrency === 'EUR') {
        return value / (approximateRates['EURUSD'] || 1.08);
    }
    if (fromCurrency === 'USD' && accountCurrency === 'UAH') {
        return value * (approximateRates['USDUAH'] || 41.5);
    }
    if (fromCurrency === 'EUR' && accountCurrency === 'USD') {
        return value * (approximateRates['EURUSD'] || 1.08);
    }
    if (fromCurrency === 'GBP' && accountCurrency === 'USD') {
        return value * (approximateRates['GBPUSD'] || 1.27);
    }

    return value; // default 1:1
}

export function calculateMargin(input: MarginCalculatorInput): MarginCalculatorResult {
    const instrument = getInstrument(input.symbol);
    if (!instrument) {
        throw new Error(`Unknown instrument: ${input.symbol}`);
    }

    if (input.leverage <= 0) {
        throw new Error('Leverage must be greater than 0');
    }

    if (input.volume <= 0) {
        throw new Error('Volume must be greater than 0');
    }

    // Полная стоимость позиции
    // Для forex: contractSize × lots × currentRate (если base != USD)
    // Для CFD/crypto: зависит от инструмента
    let positionValue: number;

    if (instrument.type === 'forex') {
        // Forex: позиция в quote currency или base в зависимости от пары
        if (instrument.quoteCurrency === 'USD' || instrument.baseCurrency === 'USD') {
            // Если USD в паре, расчёт проще
            if (instrument.baseCurrency === 'USD') {
                // USDXXX pairs: position value в долларах
                positionValue = instrument.contractSize * input.volume;
            } else {
                // XXXUSD pairs: нужно умножить на курс
                positionValue = instrument.contractSize * input.volume * input.currentRate;
            }
        } else {
            // Cross pairs: нужна дополнительная конвертация
            positionValue = instrument.contractSize * input.volume * input.currentRate;
        }
    } else {
        // CFD и Crypto
        positionValue = instrument.contractSize * input.volume * input.currentRate;
    }

    // Маржа = стоимость позиции / плечо
    const requiredMarginUSD = positionValue / input.leverage;

    // Конвертируем в валюту счёта
    const requiredMarginAccountCurrency = convertToAccountCurrency(
        requiredMarginUSD,
        'USD',
        input.accountCurrency
    );

    return {
        requiredMargin: Number(requiredMarginUSD.toFixed(2)),
        requiredMarginAccountCurrency: Number(requiredMarginAccountCurrency.toFixed(2)),
        positionValue: Number(positionValue.toFixed(2)),
        leverageRatio: `${input.leverage}:1`,
        instrument: {
            symbol: instrument.symbol,
            type: instrument.type,
            contractSize: instrument.contractSize
        }
    };
}
