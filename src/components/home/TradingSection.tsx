
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Target, Brain, Shield } from 'lucide-react';
import TradingReport from './TradingReport';

import { useLanguage } from '@/contexts/LanguageContext';

const TradingSection = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full py-16 px-4 relative no-select overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'url("/vintage_trading_bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-trading-dark/95 via-trading-dark/80 to-gray-900/95 z-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Descriptive Text */}
        <div className="text-gray-400 text-sm leading-relaxed border-l-2 border-purple-500 pl-4 mb-8">
          {t('trading.effectiveness')}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
            {t('home.chart.headline')}
          </h2>
          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto font-medium">
            {t('home.chart.subheadline')}
          </p>
        </div>

        {/* Trading Report */}
        <TradingReport />
      </div>
    </div>
  );
};

export default TradingSection;
