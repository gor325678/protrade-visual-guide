
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Target, Brain, Shield } from 'lucide-react';

const TradingSection = () => {
  return (
    <div className="w-full py-16 px-4 bg-gradient-to-b from-trading-dark to-gray-900 no-select">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden border border-gray-800">
              <img 
                src="/lovable-uploads/dec6ea7b-15c1-42fe-b092-6dfe12df13f1.png" 
                alt="Trader analyzing charts" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
            </div>
            
            {/* Floating stats */}
            <div className="absolute -bottom-4 -right-4 bg-trading-card border border-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-sm text-gray-400">Успешность</div>
                  <div className="text-lg font-bold text-green-400">87%</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Профессиональный подход к торговле
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Наши методы основаны на глубоком анализе рынка, проверенных стратегиях 
                и строгом соблюдении принципов риск-менеджмента
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Target className="h-6 w-6 text-blue-400" />,
                  title: "Точные сигналы",
                  description: "Высокоточные точки входа и выхода"
                },
                {
                  icon: <Brain className="h-6 w-6 text-purple-400" />,
                  title: "Психология",
                  description: "Контроль эмоций и дисциплина"
                },
                {
                  icon: <Shield className="h-6 w-6 text-green-400" />,
                  title: "Защита капитала",
                  description: "Строгое управление рисками"
                },
                {
                  icon: <TrendingUp className="h-6 w-6 text-yellow-400" />,
                  title: "Рост прибыли",
                  description: "Стабильное увеличение депозита"
                }
              ].map((item, index) => (
                <Card key={index} className="bg-trading-card/50 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-gray-800">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSection;
