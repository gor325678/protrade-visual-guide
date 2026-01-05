
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'uk' : 'ru');
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      className="bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 font-bold px-4 py-2 text-sm"
    >
      {language === 'ru' ? 'УКР' : 'РУС'}
    </Button>
  );
};

export default LanguageSwitcher;
