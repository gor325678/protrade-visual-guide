import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus } from 'lucide-react';
import ChartLine from '@/components/icons/ChartLine';
import ProtectionOverlay from '@/components/shared/ProtectionOverlay';

const Register = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  
  // Якщо користувач вже авторизований, перенаправляємо на головну сторінку
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
        redirect_uri: "http://localhost:8082"
      },
      appState: { returnTo: '/' }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-trading-dark">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-2 text-white text-lg">Завантаження...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <ProtectionOverlay />
      
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-trading-card border-gray-800">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-2">
              <Link to="/" className="flex items-center space-x-2">
                <ChartLine className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                  ProTrader Systems
                </span>
              </Link>
            </div>
            <CardTitle className="text-2xl">Реєстрація</CardTitle>
            <CardDescription className="text-gray-400">
              Створіть обліковий запис для доступу до освітніх матеріалів
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Button 
              onClick={handleRegister} 
              className="w-full flex items-center justify-center space-x-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Зареєструватися через Auth0</span>
            </Button>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-gray-400 text-center">
              Вже є обліковий запис?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Увійти
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
