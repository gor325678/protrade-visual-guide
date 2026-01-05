
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, PieChart, Activity, Calculator } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AnalyticsSection = () => {
  const { t } = useLanguage();

  const analyticsData = [
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-400" />,
      title: t('analytics.technical.title'),
      description: t('analytics.technical.desc'),
      value: t('analytics.technical.value')
    },
    {
      icon: <PieChart className="h-6 w-6 text-green-400" />,
      title: t('analytics.portfolio.title'),
      description: t('analytics.portfolio.desc'),
      value: t('analytics.portfolio.value')
    },
    {
      icon: <Activity className="h-6 w-6 text-purple-400" />,
      title: t('analytics.activity.title'),
      description: t('analytics.activity.desc'),
      value: t('analytics.activity.value')
    },
    {
      icon: <Calculator className="h-6 w-6 text-yellow-400" />,
      title: t('analytics.position.title'),
      description: t('analytics.position.desc'),
      value: t('analytics.position.value')
    }
  ];

  return (
    <div className="w-full py-16 px-4 no-select">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {t('analytics.title')}
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            {t('analytics.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analyticsData.map((item, index) => (
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
                src="/images/premium_trading_setup.png"
                alt="Premium trading analytics monitoring setup"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
