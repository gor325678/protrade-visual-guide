
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
              GBP/NZD
            </div>
            <div className="px-3 py-1 bg-trading-bull/10 text-trading-bull rounded-md border border-trading-bull/20 text-sm font-medium">
              <div className="flex items-center space-x-1">
                <TrendingDown size={14} />
                <span>Jan 2014</span>
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
                <span>Trend</span>
              </div>
            </div>
          </div>
          
          {/* Real chart image */}
          <div className="mt-12 relative">
            <img 
              src="/lovable-uploads/bc061cd0-6147-4c2b-8788-9fbadd5d9608.png" 
              alt="GBP/NZD Trading Chart with Entry and Exit Points" 
              className="w-full rounded-md border border-gray-800 max-h-[500px] object-contain bg-black"
            />
            
            {/* Labels and markers are now part of the image */}
          </div>
          
          {/* Trade info cards */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Время тренда</span>
                  <span className="text-lg font-semibold text-yellow-400">7 часов</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Размер тренда</span>
                  <span className="text-lg font-semibold text-yellow-400">220 пипсов</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Всего пипсов</span>
                  <span className="text-lg font-semibold text-yellow-400">745</span>
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
