import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Eye, Send, CheckCircle2, Sparkles, MessageCircle, Phone, User, Mail, DollarSign, Target, Heart, Check } from 'lucide-react';

const PreRegistration = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        messenger: '',
        phone: '',
        telegramNick: '',
        instagramNick: '',
        income: '',
        problems: [] as string[],
        mainRequest: '',
        desiredResult: '',
        whyNow: '',
        readyToPay: ''
    });

    const incomeOptions = [
        'до 500 $',
        'от 500$ до 1.000$',
        'от 1.000$ до 2.000$',
        'более 2.000$'
    ];

    const problemOptions = [
        'Финансовые трудности',
        'Проблемы в отношениях',
        'Прокрастинация',
        'Депрессия, апатия',
        'Лень, отсутствие интереса к жизни',
        'Страхи и тревоги',
        'Низкая самооценка',
        'Проблемы со здоровьем',
        'Другой'
    ];

    const messengerOptions = ['WhatsApp', 'Telegram', 'Viber'];

    const handleProblemToggle = (problem: string) => {
        setFormData(prev => ({
            ...prev,
            problems: prev.problems.includes(problem)
                ? prev.problems.filter(p => p !== problem)
                : [...prev.problems, problem]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Create an AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

        try {
            // Here you would send to your backend/n8n
            // Using the new domain as per migration plan: n8n.protradersystems.com
            const response = await fetch('https://n8n.protradersystems.com/webhook/pre-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                setIsSubmitted(true);
                toast({
                    title: "Заявка отправлена!",
                    description: "Мы свяжемся с вами в ближайшее время.",
                });
            } else {
                throw new Error('Failed to submit: ' + response.statusText);
            }
        } catch (error: any) {
            clearTimeout(timeoutId);
            console.error("Submission error:", error);

            let errorMessage = "Не удалось отправить заявку. Попробуйте позже.";

            if (error.name === 'AbortError') {
                errorMessage = "Превышено время ожидания сервера (Timeout). Проверьте интернет.";
            } else if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
                errorMessage = "Ошибка соединения. Возможно, проблема с DNS или блокировщиком рекламы.";
            } else if (error.message) {
                errorMessage = `Ошибка: ${error.message}`;
            }

            toast({
                title: "Ошибка отправки",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-trading-dark">
                <Header />
                <div className="flex items-center justify-center min-h-[80vh] px-4">
                    <div className="text-center max-w-md">
                        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center animate-pulse">
                            <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">Заявка отправлена!</h1>
                        <p className="text-gray-400 mb-8">
                            Спасибо за доверие! Мы свяжемся с вами в ближайшее время для обсуждения деталей.
                        </p>
                        <Button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90"
                        >
                            Вернуться на главную
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-trading-dark">
            <Header />

            {/* Hero Section */}
            <div className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-trading-dark to-cyan-900/20" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(86,70,252,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(86,70,252,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    {/* Mystical Eye Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-600/20 border border-amber-500/30 flex items-center justify-center">
                        <Eye className="w-10 h-10 text-amber-400" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-purple-200">
                        Анкета записи к целителю
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Заполните анкету ниже, и мы свяжемся с вами для обсуждения вашего пути к исцелению
                    </p>
                </div>
            </div>

            {/* Form Section */}
            <div className="relative py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Personal Info Card */}
                        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                    <User className="w-5 h-5 text-cyan-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Контактная информация</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Имя *</Label>
                                    <Input
                                        required
                                        placeholder="Ваше имя"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Фамилия *</Label>
                                    <Input
                                        required
                                        placeholder="Ваша фамилия"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300 flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email *
                                    </Label>
                                    <Input
                                        type="email"
                                        required
                                        placeholder="example@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300 flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Номер телефона *
                                    </Label>
                                    <Input
                                        type="tel"
                                        required
                                        placeholder="+380 XX XXX XX XX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <Label className="text-gray-300 flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" /> На какой мессенджер вам позвонить? *
                                </Label>
                                <RadioGroup
                                    value={formData.messenger}
                                    onValueChange={(value) => setFormData({ ...formData, messenger: value })}
                                    className="flex flex-wrap gap-4 mt-3"
                                >
                                    {messengerOptions.map((option) => (
                                        <div key={option} className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value={option}
                                                id={option}
                                                className="border-gray-500 text-cyan-500"
                                            />
                                            <Label htmlFor={option} className="text-gray-300 cursor-pointer">{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Ник в Telegram (или ссылка)</Label>
                                    <Input
                                        placeholder="@username"
                                        value={formData.telegramNick}
                                        onChange={(e) => setFormData({ ...formData, telegramNick: e.target.value })}
                                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Ник в Instagram (или ссылка)</Label>
                                    <Input
                                        placeholder="@username"
                                        value={formData.instagramNick}
                                        onChange={(e) => setFormData({ ...formData, instagramNick: e.target.value })}
                                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Income Card */}
                        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-green-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Ваш среднемесячный заработок? *</h2>
                            </div>

                            <RadioGroup
                                value={formData.income}
                                onValueChange={(value) => setFormData({ ...formData, income: value })}
                                className="grid md:grid-cols-2 gap-3"
                            >
                                {incomeOptions.map((option) => (
                                    <div
                                        key={option}
                                        className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${formData.income === option
                                            ? 'border-cyan-500 bg-cyan-500/10'
                                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                            }`}
                                    >
                                        <RadioGroupItem
                                            value={option}
                                            id={`income-${option}`}
                                            className="border-gray-500 text-cyan-500"
                                        />
                                        <Label htmlFor={`income-${option}`} className="text-gray-300 cursor-pointer flex-1">{option}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        {/* Problems Card */}
                        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-purple-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Какие основные проблемы вы испытываете в жизни? *</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                {problemOptions.map((problem) => (
                                    <label
                                        key={problem}
                                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors
                                            ${formData.problems.includes(problem)
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.problems.includes(problem)}
                                            onChange={() => handleProblemToggle(problem)}
                                            className="w-5 h-5 rounded border-gray-500 bg-transparent text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                                        />
                                        <span className="text-gray-300">{problem}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Goals Card */}
                        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-amber-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Ваши цели и ожидания</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Какой у вас главный запрос на исцеление? *</Label>
                                    <Textarea
                                        required
                                        placeholder="Опишите, чего вы хотите достичь..."
                                        value={formData.mainRequest}
                                        onChange={(e) => setFormData({ ...formData, mainRequest: e.target.value })}
                                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500 min-h-[100px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-300">К какому результату после работы с целителем вы хотите прийти? *</Label>
                                    <Textarea
                                        required
                                        placeholder="Опишите ваши цели и ожидания..."
                                        value={formData.desiredResult}
                                        onChange={(e) => setFormData({ ...formData, desiredResult: e.target.value })}
                                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500 min-h-[100px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-300">Почему мы должны выбрать вас / почему это важно сейчас? *</Label>
                                    <Textarea
                                        required
                                        placeholder="Укажите, что для вас наиболее важно..."
                                        value={formData.whyNow}
                                        onChange={(e) => setFormData({ ...formData, whyNow: e.target.value })}
                                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500 min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ready to Pay Card */}
                        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-cyan-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Готовы ли вы выделить время/средства на результат? *</h2>
                            </div>

                            <RadioGroup
                                value={formData.readyToPay}
                                onValueChange={(value) => setFormData({ ...formData, readyToPay: value })}
                                className="space-y-3"
                            >
                                <div
                                    className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${formData.readyToPay === 'ready'
                                        ? 'border-cyan-500 bg-cyan-500/10'
                                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                        }`}
                                >
                                    <RadioGroupItem
                                        value="ready"
                                        id="ready"
                                        className="border-gray-500 text-cyan-500"
                                    />
                                    <Label htmlFor="ready" className="text-gray-300 cursor-pointer flex-1">
                                        Да, я уже прямо сейчас готов(а) платить
                                    </Label>
                                </div>
                                <div
                                    className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${formData.readyToPay === 'need-consultation'
                                        ? 'border-cyan-500 bg-cyan-500/10'
                                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                        }`}
                                >
                                    <RadioGroupItem
                                        value="need-consultation"
                                        id="need-consultation"
                                        className="border-gray-500 text-cyan-500"
                                    />
                                    <Label htmlFor="need-consultation" className="text-gray-300 cursor-pointer flex-1">
                                        Я ещё не принял(а) решение, мне нужна консультация
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Submit Button */}
                        <div className="text-center pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                size="lg"
                                className="bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 hover:opacity-90 text-white font-semibold px-12 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Отправка...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Send className="w-5 h-5" />
                                        Отправить заявку
                                    </span>
                                )}
                            </Button>
                        </div>

                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PreRegistration;
