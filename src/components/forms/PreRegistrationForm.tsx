import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Send, Sparkles, Check } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// Web3Forms Access Key
const WEB3FORMS_ACCESS_KEY = '4ac5598f-e101-4897-869e-7d01f5a52abf';

interface PreRegistrationFormProps {
    onSuccess?: () => void;
}

const PROBLEMS_OPTIONS = [
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

const PreRegistrationForm: React.FC<PreRegistrationFormProps> = ({ onSuccess }) => {
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        messenger: '',
        phone: '',
        telegram: '',
        instagram: '',
        income: '',
        problems: [] as string[],
        expectedResult: '',
        keyFactor: '',
        mainRequest: '',
        whyChooseYou: '',
        readyToInvest: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'Обязательное поле';
        if (!formData.email.trim()) {
            newErrors.email = 'Обязательное поле';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Неверный формат email';
        }
        if (!formData.messenger) newErrors.messenger = 'Выберите мессенджер';
        if (!formData.phone.trim()) newErrors.phone = 'Обязательное поле';
        if (!formData.income) newErrors.income = 'Выберите вариант';
        if (formData.problems.length === 0) newErrors.problems = 'Выберите хотя бы один вариант';
        if (!formData.expectedResult.trim()) newErrors.expectedResult = 'Обязательное поле';
        if (!formData.keyFactor.trim()) newErrors.keyFactor = 'Обязательное поле';
        if (!formData.mainRequest.trim()) newErrors.mainRequest = 'Обязательное поле';
        if (!formData.whyChooseYou.trim()) newErrors.whyChooseYou = 'Обязательное поле';
        if (!formData.readyToInvest) newErrors.readyToInvest = 'Выберите вариант';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Send email via Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: `Новая заявка: ${formData.firstName} ${formData.lastName}`,
                    from_name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    phone: formData.phone,
                    messenger: formData.messenger,
                    telegram: formData.telegram || 'Не указан',
                    instagram: formData.instagram || 'Не указан',
                    income: formData.income,
                    problems: formData.problems.join(', '),
                    expected_result: formData.expectedResult,
                    key_factor: formData.keyFactor,
                    main_request: formData.mainRequest,
                    why_choose_you: formData.whyChooseYou,
                    ready_to_invest: formData.readyToInvest === 'ready' ? 'Готов платить сейчас' : 'Нужна консультация',
                    date: new Date().toLocaleString('ru-RU')
                })
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Web3Forms error');
            }

            // Also save to Supabase (optional)
            try {
                await supabase
                    .from('pre_registrations')
                    .insert([{
                        first_name: formData.firstName.trim(),
                        last_name: formData.lastName.trim(),
                        email: formData.email.trim().toLowerCase(),
                        messenger: formData.messenger,
                        phone: formData.phone.trim(),
                        telegram: formData.telegram.trim() || null,
                        instagram: formData.instagram.trim() || null,
                        income: formData.income,
                        problems: formData.problems,
                        expected_result: formData.expectedResult.trim(),
                        key_factor: formData.keyFactor.trim(),
                        main_request: formData.mainRequest.trim(),
                        why_choose_you: formData.whyChooseYou.trim(),
                        ready_to_invest: formData.readyToInvest,
                        created_at: new Date().toISOString()
                    }]);
            } catch (dbError) {
                console.log('Supabase save skipped:', dbError);
            }

            setIsSubmitted(true);
            toast({
                title: 'Успешно!',
                description: 'Ваша анкета отправлена. Мы свяжемся с вами в ближайшее время.',
            });

            if (onSuccess) setTimeout(onSuccess, 2000);
        } catch (error) {
            console.error('Submit error:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось отправить анкету. Попробуйте позже.',
                variant: 'destructive'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const toggleProblem = (problem: string) => {
        const newProblems = formData.problems.includes(problem)
            ? formData.problems.filter(p => p !== problem)
            : [...formData.problems, problem];
        handleChange('problems', newProblems);
    };

    // Styled input classes
    const inputClass = "bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition-all duration-200 rounded-xl";
    const inputErrorClass = "border-red-500/50 focus:border-red-400";
    const labelClass = "text-sm font-medium text-gray-200 flex items-center gap-1";
    const sectionClass = "p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 space-y-4";

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Анкета отправлена!</h3>
                <p className="text-gray-400 text-lg">Мы свяжемся с вами в ближайшее время</p>
                <div className="mt-6 flex items-center gap-2 text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Благодарим за доверие</span>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header with Logo */}
            <div className="text-center pb-6 border-b border-white/10">
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
                        <img
                            src="/logo-healer.png"
                            alt="Logo"
                            className="relative w-24 h-24 object-contain drop-shadow-2xl"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    </div>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Анкета записи к целителю
                </h2>
            </div>

            {/* Section 1: Personal Info */}
            <div className={sectionClass}>
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">1</span>
                    Личная информация
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className={labelClass}>Имя <span className="text-pink-400">*</span></Label>
                        <Input
                            placeholder="Ваше имя"
                            value={formData.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                            className={`${inputClass} ${errors.firstName ? inputErrorClass : ''}`}
                        />
                        {errors.firstName && <p className="text-pink-400 text-xs">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className={labelClass}>Фамилия</Label>
                        <Input
                            placeholder="Ваша фамилия"
                            value={formData.lastName}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className={labelClass}>Email <span className="text-pink-400">*</span></Label>
                    <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={`${inputClass} ${errors.email ? inputErrorClass : ''}`}
                    />
                    {errors.email && <p className="text-pink-400 text-xs">{errors.email}</p>}
                </div>
            </div>

            {/* Section 2: Contact */}
            <div className={sectionClass}>
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">2</span>
                    Контактные данные
                </div>

                <div className="space-y-3">
                    <Label className={labelClass}>Предпочитаемый мессенджер <span className="text-pink-400">*</span></Label>
                    <RadioGroup value={formData.messenger} onValueChange={(v) => handleChange('messenger', v)} className="flex flex-wrap gap-3">
                        {['WhatsApp', 'Telegram', 'Viber'].map((m) => (
                            <div key={m} className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all cursor-pointer ${formData.messenger === m ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/10 hover:border-white/20'}`}>
                                <RadioGroupItem value={m} id={m} className="border-white/30 text-indigo-400" />
                                <Label htmlFor={m} className="text-gray-200 cursor-pointer text-sm">{m}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                    {errors.messenger && <p className="text-pink-400 text-xs">{errors.messenger}</p>}
                </div>

                <div className="space-y-2">
                    <Label className={labelClass}>Телефон <span className="text-pink-400">*</span></Label>
                    <Input
                        type="tel"
                        placeholder="+380 XX XXX XX XX"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className={`${inputClass} ${errors.phone ? inputErrorClass : ''}`}
                    />
                    {errors.phone && <p className="text-pink-400 text-xs">{errors.phone}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className={labelClass}>Telegram</Label>
                        <Input
                            placeholder="@username"
                            value={formData.telegram}
                            onChange={(e) => handleChange('telegram', e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className={labelClass}>Instagram</Label>
                        <Input
                            placeholder="@username"
                            value={formData.instagram}
                            onChange={(e) => handleChange('instagram', e.target.value)}
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>

            {/* Section 3: Financial */}
            <div className={sectionClass}>
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">3</span>
                    Финансовая информация
                </div>

                <div className="space-y-3">
                    <Label className={labelClass}>Среднемесячный доход <span className="text-pink-400">*</span></Label>
                    <RadioGroup value={formData.income} onValueChange={(v) => handleChange('income', v)} className="grid grid-cols-2 gap-2">
                        {['до 500 $', '500$ - 1.000$', '1.000$ - 2.000$', 'более 2.000$'].map((opt) => (
                            <div key={opt} className={`flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all cursor-pointer ${formData.income === opt ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/10 hover:border-white/20'}`}>
                                <RadioGroupItem value={opt} id={`income-${opt}`} className="border-white/30 text-indigo-400" />
                                <Label htmlFor={`income-${opt}`} className="text-gray-200 cursor-pointer text-sm">{opt}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                    {errors.income && <p className="text-pink-400 text-xs">{errors.income}</p>}
                </div>
            </div>

            {/* Section 4: Problems */}
            <div className={sectionClass}>
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">4</span>
                    Ваши запросы
                </div>

                <div className="space-y-3">
                    <Label className={labelClass}>Какие проблемы вы испытываете? <span className="text-pink-400">*</span></Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {PROBLEMS_OPTIONS.map((problem) => (
                            <div
                                key={problem}
                                onClick={() => toggleProblem(problem)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all cursor-pointer ${formData.problems.includes(problem) ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/10 hover:border-white/20'}`}
                            >
                                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${formData.problems.includes(problem) ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-white/30'}`}>
                                    {formData.problems.includes(problem) && <Check className="w-3 h-3" />}
                                </div>
                                <span className="text-gray-200 cursor-pointer text-sm flex-1 select-none">{problem}</span>
                            </div>
                        ))}
                    </div>
                    {errors.problems && <p className="text-pink-400 text-xs">{errors.problems}</p>}
                </div>
            </div>

            {/* Section 5: Detailed Questions */}
            <div className={sectionClass}>
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">5</span>
                    Расскажите о себе
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className={labelClass}>К какому результату вы хотите прийти? <span className="text-pink-400">*</span></Label>
                        <Textarea
                            placeholder="Опишите ваши цели и ожидания..."
                            value={formData.expectedResult}
                            onChange={(e) => handleChange('expectedResult', e.target.value)}
                            className={`${inputClass} min-h-[80px] resize-none ${errors.expectedResult ? inputErrorClass : ''}`}
                        />
                        {errors.expectedResult && <p className="text-pink-400 text-xs">{errors.expectedResult}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClass}>Ключевой фактор принятия решения <span className="text-pink-400">*</span></Label>
                        <Textarea
                            placeholder="Что для вас наиболее важно..."
                            value={formData.keyFactor}
                            onChange={(e) => handleChange('keyFactor', e.target.value)}
                            className={`${inputClass} min-h-[80px] resize-none ${errors.keyFactor ? inputErrorClass : ''}`}
                        />
                        {errors.keyFactor && <p className="text-pink-400 text-xs">{errors.keyFactor}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClass}>Главный запрос на исцеление <span className="text-pink-400">*</span></Label>
                        <Textarea
                            placeholder="Чего вы хотите достичь..."
                            value={formData.mainRequest}
                            onChange={(e) => handleChange('mainRequest', e.target.value)}
                            className={`${inputClass} min-h-[80px] resize-none ${errors.mainRequest ? inputErrorClass : ''}`}
                        />
                        {errors.mainRequest && <p className="text-pink-400 text-xs">{errors.mainRequest}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClass}>Почему это важно именно сейчас? <span className="text-pink-400">*</span></Label>
                        <Textarea
                            placeholder="Расскажите о себе..."
                            value={formData.whyChooseYou}
                            onChange={(e) => handleChange('whyChooseYou', e.target.value)}
                            className={`${inputClass} min-h-[80px] resize-none ${errors.whyChooseYou ? inputErrorClass : ''}`}
                        />
                        {errors.whyChooseYou && <p className="text-pink-400 text-xs">{errors.whyChooseYou}</p>}
                    </div>
                </div>
            </div>

            {/* Section 6: Ready to Invest */}
            <div className={sectionClass}>
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">6</span>
                    Готовность к работе
                </div>

                <div className="space-y-3">
                    <Label className={labelClass}>Готовы ли вы выделить время и средства? <span className="text-pink-400">*</span></Label>
                    <RadioGroup value={formData.readyToInvest} onValueChange={(v) => handleChange('readyToInvest', v)} className="space-y-2">
                        <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border transition-all cursor-pointer ${formData.readyToInvest === 'ready' ? 'border-green-400 bg-green-500/10' : 'border-white/10 hover:border-white/20'}`}>
                            <RadioGroupItem value="ready" id="ready" className="border-white/30 text-green-400" />
                            <Label htmlFor="ready" className="text-gray-200 cursor-pointer">Да, готов(а) начать прямо сейчас</Label>
                        </div>
                        <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border transition-all cursor-pointer ${formData.readyToInvest === 'consultation' ? 'border-amber-400 bg-amber-500/10' : 'border-white/10 hover:border-white/20'}`}>
                            <RadioGroupItem value="consultation" id="consultation" className="border-white/30 text-amber-400" />
                            <Label htmlFor="consultation" className="text-gray-200 cursor-pointer">Нужна консультация для принятия решения</Label>
                        </div>
                    </RadioGroup>
                    {errors.readyToInvest && <p className="text-pink-400 text-xs">{errors.readyToInvest}</p>}
                </div>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-[1.02]"
            >
                {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Отправка...</>
                ) : (
                    <><Send className="w-5 h-5 mr-2" />Отправить анкету</>
                )}
            </Button>
        </form>
    );
};

export default PreRegistrationForm;
