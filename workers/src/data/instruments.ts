// Справочник торговых инструментов
// pip values, contract sizes для Forex/CFD/Crypto

export interface Instrument {
    symbol: string;
    type: 'forex' | 'cfd' | 'crypto';
    baseCurrency: string;
    quoteCurrency: string;
    contractSize: number;
    pipSize: number; // размер одного пипса
    pipValue: number; // стоимость пипса для 1 лота в quote currency
    minLot: number;
    maxLot: number;
    lotStep: number;
    description: string;
}

// Forex Major Pairs
export const forexMajors: Instrument[] = [
    {
        symbol: 'EURUSD',
        type: 'forex',
        baseCurrency: 'EUR',
        quoteCurrency: 'USD',
        contractSize: 100000,
        pipSize: 0.0001,
        pipValue: 10, // $10 per pip for 1 lot
        minLot: 0.01,
        maxLot: 100,
        lotStep: 0.01,
        description: 'Euro vs US Dollar'
    },
    {
        symbol: 'GBPUSD',
        type: 'forex',
        baseCurrency: 'GBP',
        quoteCurrency: 'USD',
        contractSize: 100000,
        pipSize: 0.0001,
        pipValue: 10,
        minLot: 0.01,
        maxLot: 100,
        lotStep: 0.01,
        description: 'British Pound vs US Dollar'
    },
    {
        symbol: 'USDJPY',
        type: 'forex',
        baseCurrency: 'USD',
        quoteCurrency: 'JPY',
        contractSize: 100000,
        pipSize: 0.01,
        pipValue: 1000, // ¥1000 per pip, needs conversion
        minLot: 0.01,
        maxLot: 100,
        lotStep: 0.01,
        description: 'US Dollar vs Japanese Yen'
    },
    {
        symbol: 'USDCHF',
        type: 'forex',
        baseCurrency: 'USD',
        quoteCurrency: 'CHF',
        contractSize: 100000,
        pipSize: 0.0001,
        pipValue: 10, // needs conversion from CHF
        minLot: 0.01,
        maxLot: 100,
        lotStep: 0.01,
        description: 'US Dollar vs Swiss Franc'
    },
    {
        symbol: 'AUDUSD',
        type: 'forex',
        baseCurrency: 'AUD',
        quoteCurrency: 'USD',
        contractSize: 100000,
        pipSize: 0.0001,
        pipValue: 10,
        minLot: 0.01,
        maxLot: 100,
        lotStep: 0.01,
        description: 'Australian Dollar vs US Dollar'
    },
    {
        symbol: 'USDCAD',
        type: 'forex',
        baseCurrency: 'USD',
        quoteCurrency: 'CAD',
        contractSize: 100000,
        pipSize: 0.0001,
        pipValue: 10, // needs conversion from CAD
        minLot: 0.01,
        maxLot: 100,
        lotStep: 0.01,
        description: 'US Dollar vs Canadian Dollar'
    },
    {
        symbol: 'NZDUSD',
        type: 'forex',
        baseCurrency: 'NZD',
        quoteCurrency: 'USD',
        contractSize: 100000,
        pipSize: 0.0001,
        pipValue: 10,
        minLot: 0.01,
        maxLot: 100,
        lotStep: 0.01,
        description: 'New Zealand Dollar vs US Dollar'
    }
];

// Forex Cross Pairs
export const forexCrosses: Instrument[] = [
    {
        symbol: 'EURGBP',
        type: 'forex',
        baseCurrency: 'EUR',
        quoteCurrency: 'GBP',
        contractSize: 100000,
        pipSize: 0.0001,
        pipValue: 10, // in GBP
        minLot: 0.01,
        maxLot: 100,
        lotStep: 0.01,
        description: 'Euro vs British Pound'
    },
    {
        symbol: 'EURJPY',
        type: 'forex',
        baseCurrency: 'EUR',
        quoteCurrency: 'JPY',
        contractSize: 100000,
        pipSize: 0.01,
        pipValue: 1000,
        minLot: 0.01,
        maxLot: 100,
        lotStep: 0.01,
        description: 'Euro vs Japanese Yen'
    },
    {
        symbol: 'GBPJPY',
        type: 'forex',
        baseCurrency: 'GBP',
        quoteCurrency: 'JPY',
        contractSize: 100000,
        pipSize: 0.01,
        pipValue: 1000,
        minLot: 0.01,
        maxLot: 100,
        lotStep: 0.01,
        description: 'British Pound vs Japanese Yen'
    },
    {
        symbol: 'EURCHF',
        type: 'forex',
        baseCurrency: 'EUR',
        quoteCurrency: 'CHF',
        contractSize: 100000,
        pipSize: 0.0001,
        pipValue: 10,
        minLot: 0.01,
        maxLot: 100,
        lotStep: 0.01,
        description: 'Euro vs Swiss Franc'
    },
    {
        symbol: 'AUDCAD',
        type: 'forex',
        baseCurrency: 'AUD',
        quoteCurrency: 'CAD',
        contractSize: 100000,
        pipSize: 0.0001,
        pipValue: 10,
        minLot: 0.01,
        maxLot: 100,
        lotStep: 0.01,
        description: 'Australian Dollar vs Canadian Dollar'
    }
];

// Crypto pairs
export const cryptoPairs: Instrument[] = [
    {
        symbol: 'BTCUSD',
        type: 'crypto',
        baseCurrency: 'BTC',
        quoteCurrency: 'USD',
        contractSize: 1,
        pipSize: 1,
        pipValue: 1, // $1 per pip for 1 BTC
        minLot: 0.001,
        maxLot: 10,
        lotStep: 0.001,
        description: 'Bitcoin vs US Dollar'
    },
    {
        symbol: 'ETHUSD',
        type: 'crypto',
        baseCurrency: 'ETH',
        quoteCurrency: 'USD',
        contractSize: 1,
        pipSize: 0.01,
        pipValue: 0.01,
        minLot: 0.01,
        maxLot: 100,
        lotStep: 0.01,
        description: 'Ethereum vs US Dollar'
    },
    {
        symbol: 'XRPUSD',
        type: 'crypto',
        baseCurrency: 'XRP',
        quoteCurrency: 'USD',
        contractSize: 1,
        pipSize: 0.0001,
        pipValue: 0.0001,
        minLot: 100,
        maxLot: 1000000,
        lotStep: 100,
        description: 'Ripple vs US Dollar'
    },
    {
        symbol: 'SOLUSD',
        type: 'crypto',
        baseCurrency: 'SOL',
        quoteCurrency: 'USD',
        contractSize: 1,
        pipSize: 0.01,
        pipValue: 0.01,
        minLot: 0.1,
        maxLot: 1000,
        lotStep: 0.1,
        description: 'Solana vs US Dollar'
    }
];

// CFD Indices
export const cfdIndices: Instrument[] = [
    {
        symbol: 'US500',
        type: 'cfd',
        baseCurrency: 'USD',
        quoteCurrency: 'USD',
        contractSize: 1,
        pipSize: 0.1,
        pipValue: 0.1,
        minLot: 0.1,
        maxLot: 100,
        lotStep: 0.1,
        description: 'S&P 500 Index'
    },
    {
        symbol: 'US30',
        type: 'cfd',
        baseCurrency: 'USD',
        quoteCurrency: 'USD',
        contractSize: 1,
        pipSize: 1,
        pipValue: 1,
        minLot: 0.1,
        maxLot: 100,
        lotStep: 0.1,
        description: 'Dow Jones Industrial Average'
    },
    {
        symbol: 'GER40',
        type: 'cfd',
        baseCurrency: 'EUR',
        quoteCurrency: 'EUR',
        contractSize: 1,
        pipSize: 0.1,
        pipValue: 0.1,
        minLot: 0.1,
        maxLot: 100,
        lotStep: 0.1,
        description: 'DAX 40 Index'
    },
    {
        symbol: 'XAUUSD',
        type: 'cfd',
        baseCurrency: 'XAU',
        quoteCurrency: 'USD',
        contractSize: 100, // 100 oz per lot
        pipSize: 0.01,
        pipValue: 1, // $1 per $0.01 move for 1 lot
        minLot: 0.01,
        maxLot: 50,
        lotStep: 0.01,
        description: 'Gold vs US Dollar'
    },
    {
        symbol: 'XAGUSD',
        type: 'cfd',
        baseCurrency: 'XAG',
        quoteCurrency: 'USD',
        contractSize: 5000, // 5000 oz per lot
        pipSize: 0.001,
        pipValue: 5,
        minLot: 0.01,
        maxLot: 50,
        lotStep: 0.01,
        description: 'Silver vs US Dollar'
    },
    {
        symbol: 'USOIL',
        type: 'cfd',
        baseCurrency: 'OIL',
        quoteCurrency: 'USD',
        contractSize: 1000, // 1000 barrels
        pipSize: 0.01,
        pipValue: 10,
        minLot: 0.01,
        maxLot: 100,
        lotStep: 0.01,
        description: 'WTI Crude Oil'
    }
];

// All instruments combined
export const allInstruments: Instrument[] = [
    ...forexMajors,
    ...forexCrosses,
    ...cryptoPairs,
    ...cfdIndices
];

// Helper to find instrument by symbol
export function getInstrument(symbol: string): Instrument | undefined {
    return allInstruments.find(i => i.symbol.toUpperCase() === symbol.toUpperCase());
}

// Get instruments by type
export function getInstrumentsByType(type: 'forex' | 'cfd' | 'crypto'): Instrument[] {
    return allInstruments.filter(i => i.type === type);
}

// Swap rates (примерные, обновляются вручную)
export interface SwapRate {
    symbol: string;
    swapLong: number;  // points per lot per night
    swapShort: number;
}

export const swapRates: SwapRate[] = [
    { symbol: 'EURUSD', swapLong: -6.5, swapShort: 1.2 },
    { symbol: 'GBPUSD', swapLong: -4.8, swapShort: 0.5 },
    { symbol: 'USDJPY', swapLong: 2.1, swapShort: -8.3 },
    { symbol: 'USDCHF', swapLong: 3.2, swapShort: -7.1 },
    { symbol: 'AUDUSD', swapLong: -2.1, swapShort: -1.5 },
    { symbol: 'USDCAD', swapLong: -1.8, swapShort: -2.4 },
    { symbol: 'NZDUSD', swapLong: -1.2, swapShort: -2.0 },
    { symbol: 'XAUUSD', swapLong: -25.5, swapShort: 8.2 },
    { symbol: 'BTCUSD', swapLong: -35.0, swapShort: -35.0 },
    { symbol: 'ETHUSD', swapLong: -25.0, swapShort: -25.0 },
];

export function getSwapRate(symbol: string): SwapRate | undefined {
    return swapRates.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
}
