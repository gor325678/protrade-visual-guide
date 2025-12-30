import React, { useState } from 'react';
import { Eye, Lock } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import ChartLine from '@/components/icons/ChartLine';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import PreRegistrationModal from './PreRegistrationModal';

const Header = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="w-full bg-trading-card py-3 px-4 border-b border-gray-800 no-select sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ChartLine className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
              ProTrader Systems
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {[
              { path: '/', labelKey: 'nav.overview' },
              { path: '/courses', labelKey: 'Каталог курсов трейдинга' },
              { path: '/beginner-training', labelKey: 'nav.beginner-training' },

              { path: '/psychology', labelKey: 'nav.psychology' },
              { path: '/materials-manager', labelKey: 'nav.materials' },
              { path: '/course-structure', labelKey: 'nav.course-structure' }
            ].map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium hover:text-primary transition-colors ${isActive(item.path) ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-400'
                  }`}
              >
                {item.labelKey.startsWith('nav.') ? t(item.labelKey) : item.labelKey}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex bg-trading-accent/10 text-trading-accent border-trading-accent/20 hover:bg-trading-accent/20"
              onClick={() => setIsModalOpen(true)}
            >
              {t('nav.pre-registration')}
            </Button>

            <LanguageSwitcher />
            <div className="flex items-center space-x-1">
              <Eye size={18} className="text-gray-400" />
              <span className="text-xs text-gray-400">{t('nav.protected-view')}</span>
              <Lock size={16} className="text-gray-400 ml-1" />
            </div>
          </div>
        </div>
      </header>

      <PreRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Header;
