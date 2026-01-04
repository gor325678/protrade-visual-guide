import React, { useState, useEffect } from 'react';
import { Eye, Lock, LogIn, LogOut, User } from 'lucide-react';
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
  const [user, setUser] = useState<any>(null);

  // Check auth state on mount and listen for changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Вихід виконано", description: "До побачення!" });
    navigate('/');
  };

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
              { path: '/psychology', labelKey: 'nav.psychology' }
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
            {user ? (
              <>
                <Link to="/account">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex bg-gray-800 border-gray-700 hover:bg-gray-700"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Акаунт
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex bg-red-900/20 text-red-400 border-red-800 hover:bg-red-900/30"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Вихід
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
                    Вхід
                  </Button>
                </Link>
              </>
            )}

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
