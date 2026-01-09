import { describe, it, expect } from 'vitest';
import { calculateLot } from '../src/calculators/lot';
import { calculateMargin } from '../src/calculators/margin';
import { calculateSwap } from '../src/calculators/swap';
import { calculateCompound } from '../src/calculators/compound';

describe('Lot Calculator', () => {
    it('should calculate correct lot size for EURUSD', () => {
        const result = calculateLot({
            accountCurrency: 'USD',
            accountBalance: 10000,
            riskPercent: 2, // $200
            stopLossPips: 50,
            symbol: 'EURUSD',
            includeSpread: false
        });

        // Risk = 200
        // Pip Value = 10 (approx for EURUSD)
        // Lot = 200 / (50 * 10) = 0.4
        expect(result.lotSize).toBe(0.4);
        expect(result.riskAmount).toBe(200);
    });

    it('should handle risk amount instead of percent', () => {
        const result = calculateLot({
            accountCurrency: 'USD',
            accountBalance: 10000,
            riskAmount: 100,
            stopLossPips: 20,
            symbol: 'EURUSD'
        });

        // Lot = 100 / (20 * 10) = 0.5
        expect(result.lotSize).toBe(0.5);
    });

    it('should account for spread', () => {
        const result = calculateLot({
            accountCurrency: 'USD',
            accountBalance: 10000,
            riskPercent: 1, // $100
            stopLossPips: 8,
            symbol: 'EURUSD',
            includeSpread: true,
            spreadPips: 2
        });

        // Effective SL = 8 + 2 = 10
        // Lot = 100 / (10 * 10) = 1.0
        expect(result.lotSize).toBe(1.0);
        expect(result.warnings).toContain('Спред 2 пипсов добавлен к стоп-лоссу');
    });
});

describe('Margin Calculator', () => {
    it('should calculate required margin for Forex', () => {
        const result = calculateMargin({
            accountCurrency: 'USD',
            symbol: 'EURUSD',
            currentRate: 1.1000,
            leverage: 100,
            volume: 1
        });

        // Position Value = 100,000 * 1 * 1.10 = 110,000
        // Margin = 110,000 / 100 = 1,100
        expect(result.requiredMargin).toBe(1100);
        expect(result.requiredMarginAccountCurrency).toBe(1100);
    });

    it('should convert margin to account currency (EUR)', () => {
        // Mock approx rate EURUSD = 1.08 inside the function, 
        // but here we input currentRate.
        // Let's assume calculateMargin uses internal conversion for account currency

        const result = calculateMargin({
            accountCurrency: 'EUR',
            symbol: 'EURUSD',
            currentRate: 1.08,
            leverage: 100,
            volume: 1
        });

        // Required Margin in USD = 108,000 / 100 = 1080 USD
        // Converted to EUR = 1080 / 1.08 = 1000 EUR
        expect(result.requiredMarginAccountCurrency).toBeCloseTo(1000, 1);
    });
});

describe('Swap Calculator', () => {
    it('should calculate swap cost for Long', () => {
        const result = calculateSwap({
            symbol: 'EURUSD',
            volume: 1,
            nights: 1,
            direction: 'buy'
        });

        // Using hardcoded rates from source: EURUSD Long = -6.5 points
        // Swap = 1 * -6.5 * 1 * (10 / 10) = -6.5 USD
        expect(result.swapCost).toBe(-6.5);
    });

    it('should calculate swap cost for Short', () => {
        const result = calculateSwap({
            symbol: 'EURUSD',
            volume: 1,
            nights: 10,
            direction: 'sell'
        });

        // EURUSD Short = 1.2 points
        // Swap = 1 * 1.2 * 10 * 1 = 12 USD
        expect(result.swapCost).toBe(12);
    });
});

describe('Compound Calculator', () => {
    it('should calculate compound interest correctly', () => {
        const result = calculateCompound({
            ratePerIteration: 10,
            iterations: 2,
            initialAmount: 100
        });

        // Iter 1: 100 + 10 = 110
        // Iter 2: 110 + 11 = 121
        expect(result.finalAmount).toBe(121);
        expect(result.totalProfit).toBe(21);
    });

    it('should handle deposits', () => {
        const result = calculateCompound({
            ratePerIteration: 10,
            iterations: 2,
            initialAmount: 100,
            depositWithdrawPerIteration: 50
        });

        // Iter 1: 100 + 10 + 50 = 160
        // Iter 2: 160 + 16 + 50 = 226
        expect(result.finalAmount).toBe(226);
    });

    it('should handle losing iterations', () => {
        const result = calculateCompound({
            ratePerIteration: 10,
            iterations: 2,
            initialAmount: 100,
            losingIterations: "2"
        });

        // Iter 1 (Win): 100 + 10 = 110
        // Iter 2 (Lose): 110 - 11 = 99
        expect(result.finalAmount).toBe(99);
        expect(result.totalProfit).toBe(-1);
        expect(result.losingIterations).toBe(1);
    });
});
