
import React from 'react';
import { ChartBar, TrendingUp, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleStartLearning = () => {
    navigate('/materials-manager');
  };
  
  return (
    <div className="relative w-full py-12 px-4 md:py-20 overflow-hidden no-select">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-trading-dark via-trading-dark to-purple-900/20 z-0" />
      
      {/* Hero image */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 z-0">
        <img 
          src="/lovable-uploads/a7a07a1f-0f0d-453b-8d07-32767312672d.png" 
          alt="Professional trader" 
          className="w-full h-full object-cover object-left"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-trading-dark"></div>
      </div>
      
      {/* Animated grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(86,70,252,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(86,70,252,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="relative max-w-5xl mx-auto text-center z-10">
        <div className="inline-block mb-4 px-4 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20">
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className="text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Профессиональная торговая система</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 glow-text">
          ProTrader Systems
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
          Полный курс по торговле на Форекс, разработанный профессионалами для достижения стабильных результатов на финансовых рынках
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
          <Button 
            onClick={handleStartLearning}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-none px-8"
          >
            Начать обучение
          </Button>
          
          <Button 
            onClick={() => navigate('/about')}
            variant="outline" 
            size="lg"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 px-8"
          >
            О системе
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { 
              icon: <ChartBar className="h-6 w-6 text-blue-400" />,
              title: "Проверенные стратегии", 
              description: "Торговые системы, проверенные на реальных рынках с высоким процентом успешных сделок" 
            },
            { 
              icon: <TrendingUp className="h-6 w-6 text-green-400" />,
              title: "Индикаторы и анализ", 
              description: "Собственные индикаторы и методы технического анализа для точного определения точек входа" 
            },
            { 
              icon: <LineChart className="h-6 w-6 text-purple-400" />,
              title: "Риск-менеджмент", 
              description: "Система управления капиталом для защиты депозита и максимизации прибыли" 
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center p-5 bg-trading-card border border-gray-800 rounded-lg animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="p-3 mb-4 rounded-full bg-gray-800">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-100">{feature.title}</h3>
              <p className="text-sm text-gray-400 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
