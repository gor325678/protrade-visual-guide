
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-6 animate-fade-in relative">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-in">
              <span className="text-trading-accent font-medium text-sm md:text-base">
                Профессиональная торговая система
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#818cf8] to-[#c084fc] text-3d-static pb-4 drop-shadow-[0_0_25px_rgba(129,140,248,0.5)]">
              ProTrader Systems
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t('about.intro')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-trading-accent/50 transition-colors duration-300">
              <div className="w-12 h-12 bg-trading-accent/20 rounded-xl flex items-center justify-center mb-6 text-2xl">
                📈
              </div>
              <h3 className="text-xl font-bold mb-4 text-trading-accent">{t('about.experience.title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('about.experience.content')}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-trading-accent/50 transition-colors duration-300">
              <div className="w-12 h-12 bg-trading-accent/20 rounded-xl flex items-center justify-center mb-6 text-2xl">
                🌍
              </div>
              <h3 className="text-xl font-bold mb-4 text-trading-accent">{t('about.strategy.title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('about.strategy.content')}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-trading-accent/50 transition-colors duration-300">
              <div className="w-12 h-12 bg-trading-accent/20 rounded-xl flex items-center justify-center mb-6 text-2xl">
                🧠
              </div>
              <h3 className="text-xl font-bold mb-4 text-trading-accent">{t('about.psychology.title')}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t('about.psychology.content')}
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-12">
            <a
              href="https://t.me/forexgbpgpy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-trading-accent hover:bg-trading-accent/80 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-trading-accent/25"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.66 14.23 15.24 16.48C15.06 17.43 14.7 17.75 14.36 17.78C13.62 17.84 13.06 17.29 12.34 16.82C11.22 16.08 10.58 15.62 9.5 14.9C8.24 14.07 9.06 13.61 9.78 12.86C9.96 12.67 12.7 10.19 12.76 9.97C12.77 9.94 12.77 9.84 12.71 9.79C12.65 9.73 12.56 9.75 12.5 9.77C12.41 9.79 11.05 10.68 8.41 12.47C8.03 12.74 7.68 12.87 7.28 12.86C6.84 12.85 6 12.61 5.38 12.41C4.61 12.16 4 12.03 4.05 11.61C4.08 11.39 4.38 11.16 5.2 10.84C9.05 9.07 11.61 8.01 12.89 7.66C15.96 6.83 16.59 6.83 16.79 6.83C16.84 6.83 16.95 6.84 17.02 6.9C17.09 6.96 17.11 7.04 17.12 7.1C17.12 7.15 17.13 7.29 17.11 7.42L16.64 8.8Z" fill="currentColor" />
              </svg>
              {t('about.cta')}
            </a>
          </div>
        </div>
      </main >
      <Footer />
    </div >
  );
};

export default About;
