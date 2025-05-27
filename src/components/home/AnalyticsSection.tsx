
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, PieChart, Activity, Calculator } from 'lucide-react';

const AnalyticsSection = () => {
  return (
    <div className="w-full py-16 px-4 no-select">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Глубокая аналитика рынка
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Используйте профессиональные инструменты анализа для принятия обоснованных торговых решений
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <BarChart3 className="h-6 w-6 text-blue-400" />,
                  title: "Технический анализ",
                  description: "Комплексный анализ графиков и паттернов",
                  value: "15+ индикаторов"
                },
                {
                  icon: <PieChart className="h-6 w-6 text-green-400" />,
                  title: "Портфельный анализ",
                  description: "Диверсификация и оптимизация портфеля",
                  value: "5-8 валютных пар"
                },
                {
                  icon: <Activity className="h-6 w-6 text-purple-400" />,
                  title: "Рыночная активность",
                  description: "Мониторинг волатильности и объемов",
                  value: "24/7 мониторинг"
                },
                {
                  icon: <Calculator className="h-6 w-6 text-yellow-400" />,
                  title: "Расчет позиций",
                  description: "Автоматический расчет размера позиций",
                  value: "1-3% риск"
                }
              ].map((item, index) => (
                <Card key={index} className="bg-trading-card border-gray-800 hover:border-gray-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-gray-800">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                        <div className="text-xs font-medium text-primary">{item.value}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Right side - Image */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden border border-gray-800">
              <img 
                src="/lovable-uploads/cc2b5ae9-e199-45de-b86f-79807e893c3e.png" 
                alt="Trader making analysis" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
            </div>
            
            {/* Floating info card */}
            <div className="absolute -bottom-6 -left-6 bg-trading-card border border-gray-800 rounded-lg p-4 max-w-xs">
              <div className="text-sm text-gray-400 mb-1">Время анализа</div>
              <div className="text-2xl font-bold text-white mb-1">2.5 часа</div>
              <div className="text-xs text-gray-500">Ежедневная подготовка к торгам</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
