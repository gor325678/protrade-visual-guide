
import React from 'react';
import { Eye, Lock } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import ChartLine from '@/components/icons/ChartLine';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-trading-card py-3 px-4 border-b border-gray-800 no-select">
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
            { path: '/beginner-training', labelKey: 'nav.beginner-training' },
            { path: '/my-courses', labelKey: 'nav.my-courses' },
            { path: '/psychology', labelKey: 'nav.psychology' },
            { path: '/risk-management', labelKey: 'nav.risk-management' },
            { path: '/materials-manager', labelKey: 'nav.materials' },
            { path: '/course-structure', labelKey: 'nav.course-structure' }
          ].map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isActive(item.path) ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-400'
              }`}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <div className="flex items-center space-x-1">
            <Eye size={18} className="text-gray-400" />
            <span className="text-xs text-gray-400">{t('nav.protected-view')}</span>
            <Lock size={16} className="text-gray-400 ml-1" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
