import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Mail, Lock, User, Phone, Gift, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface RegisterFormProps {
  onToggleMode: () => void;
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode, onClose }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralDiscount, setReferralDiscount] = useState(false);

  // Check for referral code in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode.toUpperCase());
      setReferralDiscount(true);
      // Store in localStorage for checkout
      localStorage.setItem('referral_code', refCode.toUpperCase());
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Ошибка",
        description: "Пароль должен содержать минимум 6 символов",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
            phone: formData.phone,
            referral_code: referralCode
          }
        }
      });

      if (authError) {
        throw authError;
      }

      // If referral code exists, create referral record
      if (referralCode && authData.user) {
        try {
          // Call n8n webhook to process referral
          await fetch('https://your-n8n-url.com/webhook/new-referral-signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              referral_code: referralCode,
              referred_email: formData.email,
              referred_user_id: authData.user.id,
              referred_name: `${formData.firstName} ${formData.lastName}`.trim(),
              timestamp: new Date().toISOString()
            })
          });
        } catch (webhookError) {
          console.log('Referral webhook skipped');
        }

        // Also try to insert directly into Supabase
        const { error: referralError } = await supabase
          .from('referrals')
          .insert({
            referral_code: referralCode,
            referred_email: formData.email,
            referred_user_id: authData.user.id,
            status: 'registered'
          });

        if (referralError) {
          console.error('Referral insert error:', referralError);
        }
      }

      toast({
        title: "Аккаунт создан! 🎉",
        description: referralCode
          ? "Проверьте email для подтверждения. Скидка 10% будет применена при покупке!"
          : "Проверьте вашу почту для подтверждения аккаунта"
      });

      onClose();

    } catch (error: any) {
      console.error('Registration error:', error);

      let errorMessage = "Не удалось создать аккаунт";

      if (error.message.includes('already registered')) {
        errorMessage = "Этот email уже зарегистрирован";
      } else if (error.message.includes('invalid')) {
        errorMessage = "Неверный формат email";
      }

      toast({
        title: "Ошибка регистрации",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-trading-card border-gray-800 w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Создать аккаунт</CardTitle>
        <p className="text-gray-400">Зарегистрируйтесь для доступа к курсам</p>

        {/* Referral Discount Banner */}
        {referralDiscount && (
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/50">
            <div className="flex items-center justify-center gap-2">
              <Gift className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-semibold">Скидка 10% активирована!</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Реферальный код: <code className="text-green-300">{referralCode}</code>
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="firstName">Имя</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  placeholder="Иван"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="lastName">Фамилия</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="lastName"
                  placeholder="Иванов"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700"
                  required
                />
              </div>
            </div>
          </div>

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
            <Label htmlFor="phone">Телефон (необязательно)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="+380 (99) 123-45-67"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700"
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
                placeholder="Минимум 6 символов"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10 pr-10 bg-gray-800 border-gray-700"
                required
                minLength={6}
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

          <div>
            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="pl-10 pr-10 bg-gray-800 border-gray-700"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="text-sm">
            <label className="flex items-start gap-2">
              <input type="checkbox" className="rounded mt-0.5" required />
              <span className="text-gray-400">
                Я соглашаюсь с{' '}
                <a href="/public-offer" className="text-blue-400 hover:text-blue-300">публичной офертой</a>
                {' '}и{' '}
                <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300">политикой конфиденциальности</a>
              </span>
            </label>
          </div>

          <Button
            type="submit"
            className={`w-full ${referralDiscount
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
            disabled={isLoading}
          >
            {isLoading ? 'Создание аккаунта...' : (
              referralDiscount ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Создать аккаунт со скидкой 10%
                </>
              ) : 'Создать аккаунт'
            )}
          </Button>
        </form>

        <Separator className="my-6 bg-gray-700" />

        <div className="text-center">
          <p className="text-gray-400 mb-4">Уже есть аккаунт?</p>
          <Button
            variant="outline"
            onClick={onToggleMode}
            className="w-full border-gray-700"
          >
            Войти
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
