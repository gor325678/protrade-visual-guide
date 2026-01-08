
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Calculator, Percent, TrendingDown, AlertCircle, Target } from 'lucide-react';

const RiskManagement = () => {
  const { t } = useLanguage();

  const riskRules = [
    {
      icon: <Percent className="w-8 h-8" />,
      titleKey: 'risk.rule1.title',
      descKey: 'risk.rule1.desc',
      valueKey: 'risk.rule1.value',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <Target className="w-8 h-8" />,
      titleKey: 'risk.rule2.title',
      descKey: 'risk.rule2.desc',
      valueKey: 'risk.rule2.value',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      titleKey: 'risk.rule3.title',
      descKey: 'risk.rule3.desc',
      valueKey: 'risk.rule3.value',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: <TrendingDown className="w-8 h-8" />,
      titleKey: 'risk.rule4.title',
      descKey: 'risk.rule4.desc',
      valueKey: 'risk.rule4.value',
      color: 'from-orange-500 to-amber-600'
    }
  ];

  const mistakes = [
    { titleKey: 'risk.mistake1.title', descKey: 'risk.mistake1.desc' },
    { titleKey: 'risk.mistake2.title', descKey: 'risk.mistake2.desc' },
    { titleKey: 'risk.mistake3.title', descKey: 'risk.mistake3.desc' },
    { titleKey: 'risk.mistake4.title', descKey: 'risk.mistake4.desc' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-trading-dark to-blue-900/20" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-block px-4 py-2 bg-green-500/20 rounded-full text-green-300 text-sm font-medium mb-6">
              {t('risk.badge')}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
              {t('risk.title')}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {t('risk.intro')}
            </p>
          </div>
        </section>

        {/* Key Rules */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">{t('risk.rules.title')}</h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">{t('risk.rules.subtitle')}</p>

            <div className="grid md:grid-cols-2 gap-6">
              {riskRules.map((rule, index) => (
                <div
                  key={index}
                  className="group bg-trading-card rounded-xl p-6 border border-gray-800 hover:border-green-500/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${rule.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      {rule.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{t(rule.titleKey)}</h3>
                      <p className="text-gray-400 mb-3">{t(rule.descKey)}</p>
                      <div className="inline-block px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm font-medium">
                        {t(rule.valueKey)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Risk Formula */}
        <section className="py-16 px-6 bg-gradient-to-b from-trading-dark to-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">{t('risk.formula.title')}</h2>

            <div className="bg-trading-card rounded-2xl p-8 border border-gray-800">
              <div className="text-center mb-8">
                <div className="inline-block bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl px-8 py-6 border border-green-500/30">
                  <p className="text-2xl md:text-3xl font-mono text-green-400">
                    {t('risk.formula.equation')}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <p className="text-sm text-gray-400 mb-2">{t('risk.formula.deposit')}</p>
                  <p className="text-2xl font-bold text-white">$1,000</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <p className="text-sm text-gray-400 mb-2">{t('risk.formula.riskPercent')}</p>
                  <p className="text-2xl font-bold text-green-400">1%</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <p className="text-sm text-gray-400 mb-2">{t('risk.formula.maxLoss')}</p>
                  <p className="text-2xl font-bold text-orange-400">$10</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">{t('risk.mistakes.title')}</h2>
            <p className="text-gray-400 text-center mb-12">{t('risk.mistakes.subtitle')}</p>

            <div className="space-y-4">
              {mistakes.map((mistake, index) => (
                <div
                  key={index}
                  className="bg-trading-card rounded-xl p-6 border border-gray-800 hover:border-red-500/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-400 mb-2">{t(mistake.titleKey)}</h3>
                      <p className="text-gray-400">{t(mistake.descKey)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-2xl p-8 border border-green-500/20">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">{t('risk.cta.title')}</h2>
              <p className="text-gray-300 mb-6">{t('risk.cta.desc')}</p>
              <a
                href="https://t.me/forexgbpgpy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg font-semibold hover:from-green-500 hover:to-teal-500 transition-all"
              >
                {t('risk.cta.button')}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RiskManagement;
