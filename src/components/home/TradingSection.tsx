
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Target, Brain, Shield } from 'lucide-react';
import TradingReport from './TradingReport';

import { useLanguage } from '@/contexts/LanguageContext';

const TradingSection = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full py-16 px-4 bg-gradient-to-b from-trading-dark to-gray-900 no-select">
      <div className="max-w-4xl mx-auto">
        {/* Descriptive Text */}
        <div className="text-gray-400 text-sm leading-relaxed border-l-2 border-purple-500 pl-4 mb-8">
          {t('trading.effectiveness')}
        </div>

        {/* Trading Report */}
        <TradingReport />
      </div>
    </div>
  );
};

export default TradingSection;
