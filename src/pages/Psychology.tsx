
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const Psychology = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />
      <main className="flex-grow p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{t('psychology.title')}</h1>
          <p className="text-gray-400">{t('psychology.description')}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Psychology;
