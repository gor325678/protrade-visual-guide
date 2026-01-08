
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, Target, Shield, AlertTriangle, TrendingUp, Heart } from 'lucide-react';

const Psychology = () => {
  const { t } = useLanguage();

  const psychologyPrinciples = [
    {
      icon: <Brain className="w-8 h-8" />,
      titleKey: 'psychology.principle1.title',
      descKey: 'psychology.principle1.desc',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: <Target className="w-8 h-8" />,
      titleKey: 'psychology.principle2.title',
      descKey: 'psychology.principle2.desc',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      titleKey: 'psychology.principle3.title',
      descKey: 'psychology.principle3.desc',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      titleKey: 'psychology.principle4.title',
      descKey: 'psychology.principle4.desc',
      color: 'from-orange-500 to-amber-600'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      titleKey: 'psychology.principle5.title',
      descKey: 'psychology.principle5.desc',
      color: 'from-teal-500 to-green-600'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      titleKey: 'psychology.principle6.title',
      descKey: 'psychology.principle6.desc',
      color: 'from-pink-500 to-rose-600'
    }
  ];

  const psychologyTraps = [
    { titleKey: 'psychology.trap1.title', descKey: 'psychology.trap1.desc' },
    { titleKey: 'psychology.trap2.title', descKey: 'psychology.trap2.desc' },
    { titleKey: 'psychology.trap3.title', descKey: 'psychology.trap3.desc' },
    { titleKey: 'psychology.trap4.title', descKey: 'psychology.trap4.desc' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-trading-dark to-indigo-900/20" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-block px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm font-medium mb-6">
              {t('psychology.badge')}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              {t('psychology.title')}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {t('psychology.intro')}
            </p>
          </div>
        </section>

        {/* Key Principles */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">{t('psychology.principles.title')}</h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">{t('psychology.principles.subtitle')}</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {psychologyPrinciples.map((principle, index) => (
                <div
                  key={index}
                  className="group bg-trading-card rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${principle.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                    {principle.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t(principle.titleKey)}</h3>
                  <p className="text-gray-400 leading-relaxed">{t(principle.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Psychology Traps */}
        <section className="py-16 px-6 bg-gradient-to-b from-trading-dark to-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">{t('psychology.traps.title')}</h2>
            <p className="text-gray-400 text-center mb-12">{t('psychology.traps.subtitle')}</p>

            <div className="space-y-4">
              {psychologyTraps.map((trap, index) => (
                <div
                  key={index}
                  className="bg-trading-card rounded-xl p-6 border border-gray-800 hover:border-red-500/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-400 mb-2">{t(trap.titleKey)}</h3>
                      <p className="text-gray-400">{t(trap.descKey)}</p>
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
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/20">
              <h2 className="text-2xl font-bold mb-4">{t('psychology.cta.title')}</h2>
              <p className="text-gray-300 mb-6">{t('psychology.cta.desc')}</p>
              <a
                href="https://t.me/forexgbpgpy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all"
              >
                {t('psychology.cta.button')}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Psychology;
