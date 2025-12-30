import React from 'react';
import { ChartBar, TrendingUp, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleStartLearning = () => {
    navigate('/courses');
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
        {/* Left Side Mist Effect */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1/3 h-full pointer-events-none overflow-hidden -z-10 opacity-60">
          <div className="absolute inset-0 bg-blue-500/10 blur-[80px] animate-fog-flow rounded-full mix-blend-screen" />
          <div className="absolute top-1/4 left-0 w-full h-1/2 bg-purple-500/10 blur-[60px] animate-fog-flow animation-delay-2000 rounded-full mix-blend-screen" />
        </div>

        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-in">
          <span className="text-trading-accent font-medium text-sm md:text-base">
            {t('hero.badge')}
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-10 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-cyan-400 text-3d-static pb-4 drop-shadow-[0_0_25px_rgba(34,211,238,0.5)]">
          {t('hero.title')}
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
          <Button
            onClick={handleStartLearning}
            size="lg"
            className="bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-500 hover:to-emerald-500 text-black font-bold text-lg border-none px-10 py-6 shadow-[0_0_20px_rgba(163,230,53,0.5)] transition-all duration-300 hover:scale-105"
          >
            {t('hero.start')}
          </Button>

          <Button
            onClick={() => navigate('/about')}
            variant="outline"
            size="lg"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 px-8"
          >
            {t('hero.about')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: <ChartBar className="h-6 w-6 text-blue-400" />,
              title: t('hero.features.strategies.title'),
              description: t('hero.features.strategies.desc')
            },
            {
              icon: <TrendingUp className="h-6 w-6 text-green-400" />,
              title: t('hero.features.indicators.title'),
              description: t('hero.features.indicators.desc')
            },
            {
              icon: <LineChart className="h-6 w-6 text-purple-400" />,
              title: t('hero.features.risk.title'),
              description: t('hero.features.risk.desc')
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
