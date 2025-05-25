
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const checkUserAccess = (user: any) => {
    // Проверяем, есть ли у пользователя доступ к материалам
    const userMetadata = user?.['https://protrader.com/user_metadata'] || {};
    const hasAccess = userMetadata.paid_access === true || 
                     user?.email_verified && 
                     (user?.email?.includes('premium') || userMetadata.subscription === 'active');
    
    return hasAccess;
  };
  
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Необходима авторизация",
        description: "Для доступа к этому разделу необходимо войти в систему",
        variant: "destructive",
      });
      
      loginWithRedirect({
        appState: { returnTo: window.location.pathname },
        authorizationParams: {
          redirect_uri: window.location.origin,
          scope: 'openid profile email'
        }
      });
    } else if (!isLoading && isAuthenticated && user && !checkUserAccess(user)) {
      toast({
        title: "Доступ ограничен",
        description: "У вас нет доступа к материалам. Необходимо оформить подписку.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, navigate, toast, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-trading-dark">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-2 text-white text-lg">Загрузка...</span>
      </div>
    );
  }

  if (isAuthenticated && user && checkUserAccess(user)) {
    return <>{children}</>;
  }

  return null;
};

export default AuthGuard;
