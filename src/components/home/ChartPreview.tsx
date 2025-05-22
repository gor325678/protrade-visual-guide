
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ChartPreview = () => {
  return (
    <div className="w-full py-12 px-4 no-select">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Торговые инструменты</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Профессиональные инструменты анализа и торговли, разработанные опытными трейдерами
          </p>
        </div>
        
        <div className="relative bg-trading-dark border border-gray-800 rounded-xl p-4 overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="px-3 py-1 bg-trading-card rounded-md border border-gray-800 text-sm font-medium text-gray-300">
              EUR/USD
            </div>
            <div className="px-3 py-1 bg-trading-bull/10 text-trading-bull rounded-md border border-trading-bull/20 text-sm font-medium">
              <div className="flex items-center space-x-1">
                <TrendingUp size={14} />
                <span>Buy</span>
              </div>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <div className="px-3 py-1 bg-trading-card rounded-md border border-gray-800 text-sm font-medium text-gray-300">
              H4
            </div>
            <div className="px-3 py-1 bg-trading-bear/10 text-trading-bear rounded-md border border-trading-bear/20 text-sm font-medium">
              <div className="flex items-center space-x-1">
                <TrendingDown size={14} />
                <span>Sell</span>
              </div>
            </div>
          </div>
          
          {/* Chart mockup */}
          <div className="mt-12 h-[400px] w-full relative">
            {/* Create chart bars */}
            <div className="absolute inset-0 flex items-end space-x-1">
              {[...Array(60)].map((_, i) => {
                const height = 20 + Math.random() * 60;
                const isGreen = Math.random() > 0.4;
                return (
                  <div 
                    key={i} 
                    className={`w-3 rounded-t ${isGreen ? 'bg-trading-bull' : 'bg-trading-bear'}`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
            
            {/* Chart line */}
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <path
                d={`M0,${400 - Math.random() * 200} ${[...Array(20)].map((_, i) => {
                  const x = (i + 1) * (100 / 20);
                  const y = 400 - Math.random() * 200;
                  return `L${x},${y}`;
                }).join(' ')} L100,${400 - Math.random() * 200}`}
                stroke="rgba(14, 165, 233, 0.8)"
                strokeWidth="2"
                fill="none"
                className="w-full"
              />
            </svg>
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 chart-gradient-bg opacity-40"></div>
            
            {/* Indicators */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-indigo-500/30 flex items-center justify-center animate-pulse-glow">
              <div className="w-16 h-16 rounded-full border-2 border-indigo-400/50 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/70"></div>
              </div>
            </div>
          </div>
          
          {/* Trade info cards */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Entry Point</span>
                  <span className="text-lg font-semibold text-white">1.0876</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Stop Loss</span>
                  <span className="text-lg font-semibold text-trading-bear">1.0810</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Take Profit</span>
                  <span className="text-lg font-semibold text-trading-bull">1.0950</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPreview;
