import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Send } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
            const { error } = await supabase
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

            if (error) throw error;

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

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Анкета отправлена!</h3>
                <p className="text-gray-400">Мы свяжемся с вами в ближайшее время</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo */}
            <div className="flex justify-center mb-4">
                <img
                    src="/logo-healer.png"
                    alt="Logo"
                    className="w-20 h-20 object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
            </div>

            {/* Title */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-400">Анкета записи к целителю</h2>
                <p className="text-gray-400 mt-1">целитель: Игорь</p>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-gray-300">Имя <span className="text-red-500">*</span></Label>
                    <Input
                        placeholder="Имя"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className={`bg-gray-800/50 border-gray-700 text-white ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && <p className="text-red-400 text-xs">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                    <Label className="text-gray-300">Фамилия</Label>
                    <Input
                        placeholder="Фамилия"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white"
                    />
                </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
                <Label className="text-gray-300">Email <span className="text-red-500">*</span></Label>
                <Input
                    type="email"
                    placeholder="example@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`bg-gray-800/50 border-gray-700 text-white ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
            </div>

            {/* Messenger Choice */}
            <div className="space-y-3">
                <Label className="text-gray-300">На какой мессенджер вам позвонить? <span className="text-red-500">*</span></Label>
                <RadioGroup value={formData.messenger} onValueChange={(v) => handleChange('messenger', v)}>
                    {['WhatsApp', 'Telegram', 'Viber'].map((m) => (
                        <div key={m} className="flex items-center space-x-2">
                            <RadioGroupItem value={m} id={m} className="border-gray-600" />
                            <Label htmlFor={m} className="text-gray-300 cursor-pointer">{m}</Label>
                        </div>
                    ))}
                </RadioGroup>
                {errors.messenger && <p className="text-red-400 text-xs">{errors.messenger}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
                <Label className="text-gray-300">Номер телефона для консультации (WhatsApp,Telegram, Viber) <span className="text-red-500">*</span></Label>
                <Input
                    type="tel"
                    placeholder="+0000000000"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`bg-gray-800/50 border-gray-700 text-white ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
            </div>

            {/* Telegram */}
            <div className="space-y-2">
                <Label className="text-gray-300">ник в Telegram (или ссылка)</Label>
                <Input
                    placeholder="@username"
                    value={formData.telegram}
                    onChange={(e) => handleChange('telegram', e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                />
            </div>

            {/* Instagram */}
            <div className="space-y-2">
                <Label className="text-gray-300">ник в Instagram (или ссылка)</Label>
                <Input
                    placeholder="@username"
                    value={formData.instagram}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                />
            </div>

            {/* Income */}
            <div className="space-y-3">
                <Label className="text-gray-300">Ваш среднемесячный заработок? <span className="text-red-500">*</span></Label>
                <RadioGroup value={formData.income} onValueChange={(v) => handleChange('income', v)}>
                    {['до 500 $', 'от 500$ до 1.000$', 'от 1.000$ до 2.000$', 'более 2.000$'].map((opt) => (
                        <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`income-${opt}`} className="border-gray-600" />
                            <Label htmlFor={`income-${opt}`} className="text-gray-300 cursor-pointer">{opt}</Label>
                        </div>
                    ))}
                </RadioGroup>
                {errors.income && <p className="text-red-400 text-xs">{errors.income}</p>}
            </div>

            {/* Problems */}
            <div className="space-y-3">
                <Label className="text-gray-300">Какие основные проблемы вы испытываете в жизни? <span className="text-red-500">*</span></Label>
                <div className="space-y-2">
                    {PROBLEMS_OPTIONS.map((problem) => (
                        <div key={problem} className="flex items-center space-x-2">
                            <Checkbox
                                id={problem}
                                checked={formData.problems.includes(problem)}
                                onCheckedChange={() => toggleProblem(problem)}
                                className="border-gray-600"
                            />
                            <Label htmlFor={problem} className="text-gray-300 cursor-pointer">{problem}</Label>
                        </div>
                    ))}
                </div>
                {errors.problems && <p className="text-red-400 text-xs">{errors.problems}</p>}
            </div>

            {/* Expected Result */}
            <div className="space-y-2">
                <Label className="text-gray-300">К какому результату после работы с целителем вы хотите прийти? <span className="text-red-500">*</span></Label>
                <Textarea
                    placeholder="опишите ваши цели и ожидания"
                    value={formData.expectedResult}
                    onChange={(e) => handleChange('expectedResult', e.target.value)}
                    className={`bg-gray-800/50 border-gray-700 text-white min-h-[100px] ${errors.expectedResult ? 'border-red-500' : ''}`}
                />
                {errors.expectedResult && <p className="text-red-400 text-xs">{errors.expectedResult}</p>}
            </div>

            {/* Key Factor */}
            <div className="space-y-2">
                <Label className="text-gray-300">Что будет ключевым фактором при принятии решения о прохождении курса исцеления? <span className="text-red-500">*</span></Label>
                <Textarea
                    placeholder="укажите, что для вас наиболее важно"
                    value={formData.keyFactor}
                    onChange={(e) => handleChange('keyFactor', e.target.value)}
                    className={`bg-gray-800/50 border-gray-700 text-white min-h-[100px] ${errors.keyFactor ? 'border-red-500' : ''}`}
                />
                {errors.keyFactor && <p className="text-red-400 text-xs">{errors.keyFactor}</p>}
            </div>

            {/* Main Request */}
            <div className="space-y-2">
                <Label className="text-gray-300">Какой у вас главный запрос на исцеление? <span className="text-red-500">*</span></Label>
                <Textarea
                    placeholder="опишите, чего вы хотите достичь"
                    value={formData.mainRequest}
                    onChange={(e) => handleChange('mainRequest', e.target.value)}
                    className={`bg-gray-800/50 border-gray-700 text-white min-h-[100px] ${errors.mainRequest ? 'border-red-500' : ''}`}
                />
                {errors.mainRequest && <p className="text-red-400 text-xs">{errors.mainRequest}</p>}
            </div>

            {/* Why Choose You */}
            <div className="space-y-2">
                <Label className="text-gray-300">Почему мы должны выбрать вас/почему это важно сейчас? <span className="text-red-500">*</span></Label>
                <Textarea
                    placeholder="расскажите о себе"
                    value={formData.whyChooseYou}
                    onChange={(e) => handleChange('whyChooseYou', e.target.value)}
                    className={`bg-gray-800/50 border-gray-700 text-white min-h-[100px] ${errors.whyChooseYou ? 'border-red-500' : ''}`}
                />
                {errors.whyChooseYou && <p className="text-red-400 text-xs">{errors.whyChooseYou}</p>}
            </div>

            {/* Ready to Invest */}
            <div className="space-y-3">
                <Label className="text-gray-300">Готовы ли вы выделить время/средства на результат? <span className="text-red-500">*</span></Label>
                <RadioGroup value={formData.readyToInvest} onValueChange={(v) => handleChange('readyToInvest', v)}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ready" id="ready" className="border-gray-600" />
                        <Label htmlFor="ready" className="text-gray-300 cursor-pointer">да я уже прямо сейчас готов(-а) платить</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="consultation" id="consultation" className="border-gray-600" />
                        <Label htmlFor="consultation" className="text-gray-300 cursor-pointer">я ещё не принял(-ла) решение, мне нужна консультация</Label>
                    </div>
                </RadioGroup>
                {errors.readyToInvest && <p className="text-red-400 text-xs">{errors.readyToInvest}</p>}
            </div>

            {/* Submit */}
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
            >
                {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Отправка...</>
                ) : (
                    <><Send className="w-4 h-4 mr-2" />Отправить</>
                )}
            </Button>
        </form>
    );
};

export default PreRegistrationForm;
