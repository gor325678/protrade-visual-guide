
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Для доступа к этому разделу необходимо войти в систему",
        variant: "destructive",
      });
      
      loginWithRedirect({
        appState: { returnTo: window.location.pathname }
      });
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-trading-dark">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-2 text-white text-lg">Загрузка...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  // This will typically not be rendered as the useEffect above will redirect
  return null;
};

export default AuthGuard;
