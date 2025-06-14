
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Имитация API запроса
    setTimeout(() => {
      console.log('Login attempt:', formData);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Card className="bg-trading-card border-gray-800 w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Вход в аккаунт</CardTitle>
        <p className="text-gray-400">Войдите, чтобы получить доступ к своим курсам</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Введите пароль"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10 pr-10 bg-gray-800 border-gray-700"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-400">Запомнить меня</span>
            </label>
            <button type="button" className="text-blue-400 hover:text-blue-300">
              Забыли пароль?
            </button>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        <Separator className="my-6 bg-gray-700" />

        <div className="text-center">
          <p className="text-gray-400 mb-4">Нет аккаунта?</p>
          <Button 
            variant="outline" 
            onClick={onToggleMode}
            className="w-full border-gray-700"
          >
            Создать аккаунт
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
