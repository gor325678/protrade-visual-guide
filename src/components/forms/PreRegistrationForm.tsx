import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, User, Mail, Phone, Send } from 'lucide-react';

interface PreRegistrationFormProps {
    onSuccess?: () => void;
}

const PreRegistrationForm: React.FC<PreRegistrationFormProps> = ({ onSuccess }) => {
    const { t } = useLanguage();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        telegram: '',
        termsAccepted: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Введите ваше имя';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Введите email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Неверный формат email';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Введите номер телефона';
        }

        if (!formData.termsAccepted) {
            newErrors.terms = 'Необходимо принять условия';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Save to Supabase
            const { error } = await supabase
                .from('pre_registrations')
                .insert([
                    {
                        name: formData.name.trim(),
                        email: formData.email.trim().toLowerCase(),
                        phone: formData.phone.trim(),
                        telegram: formData.telegram.trim() || null,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                console.error('Supabase error:', error);

                // If table doesn't exist, show helpful message
                if (error.code === '42P01') {
                    toast({
                        title: 'Ошибка',
                        description: 'Таблица не найдена. Создайте таблицу pre_registrations в Supabase.',
                        variant: 'destructive'
                    });
                } else {
                    throw error;
                }
                return;
            }

            setIsSubmitted(true);
            toast({
                title: 'Успешно!',
                description: 'Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.',
            });

            if (onSuccess) {
                setTimeout(onSuccess, 2000);
            }

        } catch (error) {
            console.error('Submit error:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось отправить заявку. Попробуйте позже.',
                variant: 'destructive'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Заявка отправлена!
                </h3>
                <p className="text-gray-400">
                    Мы свяжемся с вами в ближайшее время
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t('modal.name')}
                </label>
                <Input
                    type="text"
                    placeholder={t('modal.name_placeholder')}
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {t('modal.email')}
                </label>
                <Input
                    type="email"
                    placeholder={t('modal.email_placeholder')}
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {t('modal.phone')}
                </label>
                <Input
                    type="tel"
                    placeholder="+380..."
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
            </div>

            {/* Telegram (optional) */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                    {t('modal.telegram')}
                </label>
                <Input
                    type="text"
                    placeholder="@username"
                    value={formData.telegram}
                    onChange={(e) => handleChange('telegram', e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
            </div>

            {/* Terms checkbox */}
            <div className="space-y-2">
                <div className="flex items-start gap-3">
                    <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => handleChange('termsAccepted', !!checked)}
                        className="mt-1 border-gray-600 data-[state=checked]:bg-blue-600"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer leading-relaxed">
                        {t('modal.terms')}
                    </label>
                </div>
                {errors.terms && <p className="text-red-400 text-xs">{errors.terms}</p>}
            </div>

            {/* Submit button */}
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Отправка...
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4 mr-2" />
                        {t('modal.submit')}
                    </>
                )}
            </Button>
        </form>
    );
};

export default PreRegistrationForm;
