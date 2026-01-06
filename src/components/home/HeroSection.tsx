import React from 'react';
import { ChartBar, TrendingUp, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StartTrainingButton from '@/components/shared/StartTrainingButton';
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
      {/* Hero image */}
      {/* Hero image with fixed background styling */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: 'url(/hero-mansion.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />

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

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-10 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-cyan-400 text-3d-cyan pb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] filter">
          {t('hero.title')}
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-white font-medium max-w-3xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
          <StartTrainingButton />

          <Button
            onClick={() => navigate('/about')}
            variant="outline"
            size="lg"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 px-8"
          >
            {t('hero.about')}
          </Button>
        </div>


      </div>
    </div>
  );
};

export default HeroSection;
