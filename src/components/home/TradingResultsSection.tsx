import React from 'react';
import { TrendingUp, Target, Shield, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TradingResultsSection = () => {
    const { t } = useLanguage();

    const stats = [
        {
            icon: TrendingUp,
            value: '70-85%',
            label: t('results.winrate'),
            color: 'text-green-400'
        },
        {
            icon: Shield,
            value: '0.5-2%',
            label: t('results.max_risk'),
            color: 'text-yellow-400'
        },
        {
            icon: Clock,
            value: '1-12',
            label: t('results.trades_day'),
            color: 'text-purple-400'
        },
        {
            icon: Target,
            value: '21+',
            label: t('results.hours_content'),
            color: 'text-blue-400'
        }
    ];

    const features = [
        t('results.feature1'),
        t('results.feature2'),
        t('results.feature3'),
        t('results.feature4')
    ];

    return (
        <section className="py-16 px-4 bg-gradient-to-b from-trading-dark via-gray-900/50 to-trading-dark">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
                        {t('results.title')}
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {t('results.subtitle')}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center hover:border-gray-700 transition-all hover:scale-105"
                        >
                            <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                            <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-400">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Features List */}
                <div className="bg-gradient-to-r from-blue-900/20 to-green-900/20 border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-white mb-6 text-center">
                        {t('results.what_you_get')}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                                <span className="text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TradingResultsSection;
