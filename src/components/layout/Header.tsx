
import React from 'react';
import { Eye, Lock, LogIn, UserPlus, BookOpen } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ChartLine from '@/components/icons/ChartLine';

const Header = () => {
  const location = useLocation();
  
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
            { path: '/', label: 'Обзор' },
            { path: '/beginner-training', label: 'Обучение для начинающих' },
            { path: '/indicators', label: 'Индикаторы' },
            { path: '/psychology', label: 'Психология' },
            { path: '/risk-management', label: 'Риск-менеджмент' },
            { path: '/materials-manager', label: 'Материалы' },
            { path: '/course-structure', label: 'Структура курса' }
          ].map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isActive(item.path) ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/login" className="flex items-center space-x-1">
                <LogIn className="h-4 w-4" />
                <span>Войти</span>
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register" className="flex items-center space-x-1">
                <UserPlus className="h-4 w-4" />
                <span>Регистрация</span>
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-1">
            <Eye size={18} className="text-gray-400" />
            <span className="text-xs text-gray-400">Protected View</span>
            <Lock size={16} className="text-gray-400 ml-1" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
