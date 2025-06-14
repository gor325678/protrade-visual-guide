
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
        
        <div className="relative bg-trading-dark border border-gray-800 rounded-xl p-4 overflow-hidden max-w-fit mx-auto">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="px-3 py-1 bg-trading-card rounded-md border border-gray-800 text-sm font-medium text-gray-300">
              GBP/USD
            </div>
            <div className="px-3 py-1 bg-trading-bull/10 text-trading-bull rounded-md border border-trading-bull/20 text-sm font-medium">
              <div className="flex items-center space-x-1">
                <TrendingUp size={14} />
                <span>May 2025</span>
              </div>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <div className="px-3 py-1 bg-trading-card rounded-md border border-gray-800 text-sm font-medium text-gray-300">
              M5
            </div>
            <div className="px-3 py-1 bg-trading-bear/10 text-trading-bear rounded-md border border-trading-bear/20 text-sm font-medium">
              <div className="flex items-center space-x-1">
                <TrendingUp size={14} />
                <span>Trend</span>
              </div>
            </div>
          </div>
          
          {/* Chart image */}
          <div className="mt-12 relative">
            <img 
              src="/lovable-uploads/e3150010-676f-47ab-90d7-681f3065484a.png" 
              alt="GBP/USD торговый график с отмеченными точками входа" 
              className="rounded-md border border-gray-800 bg-black block"
            />
          </div>
          
          {/* Trade info cards */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Время тренда</span>
                  <span className="text-lg font-semibold text-yellow-400">8 часов</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Размер тренда</span>
                  <span className="text-lg font-semibold text-yellow-400">285 пипсов</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Всего пипсов</span>
                  <span className="text-lg font-semibold text-yellow-400">920</span>
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
