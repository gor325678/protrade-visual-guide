import React, { useState, useEffect } from 'react';
import { Eye, Lock, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import ChartLine from '@/components/icons/ChartLine';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import PreRegistrationModal from './PreRegistrationModal';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check auth state on mount and listen for changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: t('nav.logout-success'), description: t('nav.goodbye') });
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', labelKey: 'nav.overview' },
    { path: '/courses', labelKey: 'nav.courses' },
    { path: '/beginner-training', labelKey: 'nav.beginner-training' },
    { path: '/psychology', labelKey: 'nav.psychology' }
  ];

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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium hover:text-primary transition-colors ${isActive(item.path) ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-400'
                  }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Desktop Auth Buttons */}
            {user ? (
              <>
                <Link to="/account">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex bg-gray-800 border-gray-700 hover:bg-gray-700"
                  >
                    <User className="mr-2 h-4 w-4" />
                    {t('nav.account')}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex bg-red-900/20 text-red-400 border-red-800 hover:bg-red-900/30"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex bg-trading-accent/10 text-trading-accent border-trading-accent/20 hover:bg-trading-accent/20"
                  onClick={() => setIsModalOpen(true)}
                >
                  {t('nav.pre-registration')}
                </Button>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex bg-blue-900/20 text-blue-400 border-blue-800 hover:bg-blue-900/30"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    {t('nav.login')}
                  </Button>
                </Link>
              </>
            )}

            <LanguageSwitcher />

            <div className="hidden md:flex items-center space-x-1">
              <Eye size={18} className="text-gray-400" />
              <span className="text-xs text-gray-400">{t('nav.protected-view')}</span>
              <Lock size={16} className="text-gray-400 ml-1" />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute left-0 right-0 top-full bg-trading-card border-b border-gray-800 transition-all duration-300 ease-in-out ${isMobileMenuOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
        >
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-gray-300 hover:bg-gray-800'
                  }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}

            <div className="border-t border-gray-800 my-2 pt-2">
              {user ? (
                <>
                  <Link
                    to="/account"
                    className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800"
                  >
                    <User className="mr-3 h-4 w-4" />
                    {t('nav.account')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-3 rounded-lg text-sm font-medium text-trading-accent hover:bg-trading-accent/10"
                  >
                    {t('nav.pre-registration')}
                  </button>
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-blue-400 hover:bg-blue-900/20"
                  >
                    <LogIn className="mr-3 h-4 w-4" />
                    {t('nav.login')}
                  </Link>
                </>
              )}
            </div>
          </nav>
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
