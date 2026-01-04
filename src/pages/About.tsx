import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Users, Shield, LineChart, Brain, Globe, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <LineChart className="w-8 h-8 text-blue-400" />,
      title: "Real Market Analysis",
      description: "Глубокий анализ рыночных структур и поведения цены в реальном времени."
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      title: "Psychology First",
      description: "Акцент на психологии трейдинга как фундаменте долгосрочного успеха."
    },
    {
      icon: <Target className="w-8 h-8 text-green-400" />,
      title: "Precision Entries",
      description: "Методика входа в сделки с высоким соотношением риск/прибыль."
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-400" />,
      title: "Global Community",
      description: "Сообщество единомышленников и профессиональная поддержка."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white font-sans">
      <Header />

      <main className="flex-grow pt-8 pb-16 px-4">
        {/* Hero Section */}
        <section className={`max-w-6xl mx-auto mb-20 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Badge className="mb-4 bg-trading-accent/10 text-trading-accent hover:bg-trading-accent/20 border-trading-accent/20 px-4 py-1 text-sm">
            Since 2020
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500">
            О Проекте <br /> ProTrader Systems
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Мы не просто учим торговать. Мы создаем экосистему для профессионального роста, где каждый аспект — от технического анализа до психологии — работает на ваш результат.
          </p>
        </section>

        {/* Mission Section */}
        <section className="max-w-6xl mx-auto mb-20 grid md:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-500" />
              Наша Миссия
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Главная цель ProTrader Systems — изменить подход к обучению трейдингу. Мы убрали "воду" и теоретический шум, оставив только то, что действительно работает на реальном рынке.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-green-400 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Безопасность капитала</h4>
                  <p className="text-sm text-gray-400">Первое правило — не потерять. Второе — заработать.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-blue-400 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Системный подход</h4>
                  <p className="text-sm text-gray-400">Трейдинг — это бизнес-процесс, а не игра в угадайку.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-2 gap-4 transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            {features.map((feature, idx) => (
              <Card key={idx} className="bg-trading-card border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                  {feature.icon}
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 md:p-12 border border-white/5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">5+</div>
                <div className="text-sm text-gray-400">Лет опыта</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">1200+</div>
                <div className="text-sm text-gray-400">Студентов</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">85%</div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm text-gray-400">Поддержка</div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default About;
