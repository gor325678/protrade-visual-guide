import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function AuthForm() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [resetMode, setResetMode] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (resetMode) {
                // --- PASSWORD RESET ---
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) throw error;

                toast({
                    title: "Лист надіслано!",
                    description: "Перевірте вашу пошту для скидання паролю."
                });
                setResetMode(false);
            } else if (isLogin) {
                // --- LOGIN ---
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                toast({ title: "Успішний вхід!", description: "Раді вас бачити." });
                navigate('/');
                window.location.reload(); // Refresh to update auth state
            } else {
                // --- REGISTRATION ---
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: email.split('@')[0] },
                    },
                });
                if (error) throw error;

                toast({
                    title: "Реєстрація успішна!",
                    description: "Перевірте email для підтвердження (якщо потрібно) і увійдіть."
                });
                setIsLogin(true);
            }
        } catch (error: any) {
            toast({
                title: "Помилка",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (resetMode) {
        return (
            <div className="w-full max-w-md mx-auto p-8 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl">
                <button
                    onClick={() => setResetMode(false)}
                    className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Назад до входу
                </button>

                <h2 className="text-3xl font-bold text-white mb-2">
                    Відновлення паролю
                </h2>
                <p className="text-gray-400 mb-8">
                    Введіть email, на який зареєстрований ваш акаунт
                </p>

                <form onSubmit={handleAuth} className="space-y-6">
                    <div>
                        <Label htmlFor="reset-email" className="text-gray-300">Email</Label>
                        <div className="relative mt-2">
                            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                            <Input
                                id="reset-email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10 bg-gray-800 border-gray-700 text-white h-12"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-medium"
                        disabled={loading}
                    >
                        {loading ? 'Надсилання...' : 'Надіслати посилання'}
                    </Button>
                </form>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-8 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
                {isLogin ? 'Вхід у систему' : 'Новий акаунт'}
            </h2>
            <p className="text-gray-400 mb-8 text-center">
                {isLogin ? 'Увійдіть, щоб отримати доступ до курсів' : 'Створіть акаунт для початку навчання'}
            </p>

            <form onSubmit={handleAuth} className="space-y-6">
                <div>
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <div className="relative mt-2">
                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-10 bg-gray-800 border-gray-700 text-white h-12"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="password" className="text-gray-300">Пароль</Label>
                    <div className="relative mt-2">
                        <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white h-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {!isLogin && (
                        <p className="text-xs text-gray-500 mt-1">Мінімум 6 символів</p>
                    )}
                </div>

                {isLogin && (
                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => setResetMode(true)}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Забули пароль?
                        </button>
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-medium"
                    disabled={loading}
                >
                    {loading ? 'Обробка...' : (isLogin ? 'Увійти' : 'Зареєструватися')}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-gray-400 hover:text-white underline transition-colors"
                >
                    {isLogin ? 'Немає акаунту? Створити' : 'Вже є акаунт? Увійти'}
                </button>
            </div>
        </div>
    );
}
