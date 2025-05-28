
import React from 'react';
import { Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="w-full bg-trading-card py-3 px-4 border-t border-gray-800 mt-auto no-select">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          <Info size={14} />
          <p>{t('footer.rights')}</p>
        </div>
        
        <div className="flex items-center">
          <p>{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
