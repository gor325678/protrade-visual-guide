// Cloudflare Workers API - Trading Calculators
// Main router with CORS handling

import { calculateLot, LotCalculatorInput } from './calculators/lot';
import { calculateMargin, MarginCalculatorInput } from './calculators/margin';
import { calculateSwap, SwapCalculatorInput } from './calculators/swap';
import { calculateCompound, CompoundCalculatorInput } from './calculators/compound';
import { allInstruments, getInstrumentsByType } from './data/instruments';

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

// Helper to create JSON response
function jsonResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
        },
    });
}

// Error response helper
function errorResponse(message: string, status = 400): Response {
    return jsonResponse({ error: message, success: false }, status);
}

// Parse JSON body safely
async function parseBody<T>(request: Request): Promise<T> {
    try {
        const text = await request.text();
        if (!text) {
            throw new Error('Empty request body');
        }
        return JSON.parse(text) as T;
    } catch {
        throw new Error('Invalid JSON in request body');
    }
}

// Main fetch handler
export default {
    async fetch(request: Request): Promise<Response> {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        try {
            // GET /api/health - Health check
            if (path === '/api/health' && request.method === 'GET') {
                return jsonResponse({
                    status: 'ok',
                    version: '1.0.0',
                    timestamp: new Date().toISOString(),
                });
            }

            // GET /api/instruments - List all instruments
            if (path === '/api/instruments' && request.method === 'GET') {
                const type = url.searchParams.get('type') as 'forex' | 'cfd' | 'crypto' | null;
                const instruments = type ? getInstrumentsByType(type) : allInstruments;
                return jsonResponse({
                    success: true,
                    count: instruments.length,
                    instruments: instruments.map(i => ({
                        symbol: i.symbol,
                        type: i.type,
                        description: i.description,
                        contractSize: i.contractSize,
                        minLot: i.minLot,
                        maxLot: i.maxLot,
                    })),
                });
            }

            // POST /api/calculate/lot - Calculate lot size
            if (path === '/api/calculate/lot' && request.method === 'POST') {
                const input = await parseBody<LotCalculatorInput>(request);

                // Validate required fields
                if (!input.accountBalance || !input.stopLossPips || !input.symbol) {
                    return errorResponse('Missing required fields: accountBalance, stopLossPips, symbol');
                }
                if (!input.riskPercent && !input.riskAmount) {
                    return errorResponse('Either riskPercent or riskAmount is required');
                }

                const result = calculateLot({
                    accountCurrency: input.accountCurrency || 'USD',
                    accountBalance: input.accountBalance,
                    riskPercent: input.riskPercent,
                    riskAmount: input.riskAmount,
                    stopLossPips: input.stopLossPips,
                    symbol: input.symbol.toUpperCase(),
                    currentRate: input.currentRate,
                    leverage: input.leverage,
                    includeSpread: input.includeSpread,
                    spreadPips: input.spreadPips,
                });

                return jsonResponse({ success: true, ...result });
            }

            // POST /api/calculate/margin - Calculate margin
            if (path === '/api/calculate/margin' && request.method === 'POST') {
                const input = await parseBody<MarginCalculatorInput>(request);

                if (!input.symbol || !input.currentRate || !input.leverage || !input.volume) {
                    return errorResponse('Missing required fields: symbol, currentRate, leverage, volume');
                }

                const result = calculateMargin({
                    accountCurrency: input.accountCurrency || 'USD',
                    symbol: input.symbol.toUpperCase(),
                    currentRate: input.currentRate,
                    leverage: input.leverage,
                    volume: input.volume,
                });

                return jsonResponse({ success: true, ...result });
            }

            // POST /api/calculate/swap - Calculate swap
            if (path === '/api/calculate/swap' && request.method === 'POST') {
                const input = await parseBody<SwapCalculatorInput>(request);

                if (!input.symbol || !input.volume || !input.nights || !input.direction) {
                    return errorResponse('Missing required fields: symbol, volume, nights, direction');
                }

                const result = calculateSwap({
                    symbol: input.symbol.toUpperCase(),
                    volume: input.volume,
                    nights: input.nights,
                    direction: input.direction,
                    accountCurrency: input.accountCurrency,
                });

                return jsonResponse({ success: true, ...result });
            }

            // POST /api/calculate/compound - Calculate compound interest
            if (path === '/api/calculate/compound' && request.method === 'POST') {
                const input = await parseBody<CompoundCalculatorInput>(request);

                if (input.ratePerIteration === undefined || !input.iterations || !input.initialAmount) {
                    return errorResponse('Missing required fields: ratePerIteration, iterations, initialAmount');
                }

                const result = calculateCompound({
                    ratePerIteration: input.ratePerIteration,
                    iterations: input.iterations,
                    initialAmount: input.initialAmount,
                    initialLot: input.initialLot,
                    depositWithdrawPerIteration: input.depositWithdrawPerIteration,
                    losingIterations: input.losingIterations,
                });

                return jsonResponse({ success: true, ...result });
            }

            // 404 for unknown routes
            return errorResponse(`Not found: ${path}`, 404);

        } catch (error) {
            console.error('API Error:', error);
            const message = error instanceof Error ? error.message : 'Internal server error';
            return errorResponse(message, 500);
        }
    },
};
