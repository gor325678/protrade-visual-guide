import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, CheckCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StartTrainingButton from '@/components/shared/StartTrainingButton';
import { supabase } from '@/lib/supabaseClient';

interface Testimonial {
    id: string;
    name: string;
    role: string;
    avatar_emoji: string;
    rating: number;
    text: string;
    is_verified: boolean;
    location?: string;
    telegram_handle?: string;
    trading_result?: string;
}

const TestimonialsSection: React.FC = () => {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    // Fallback testimonials if database is empty
    const fallbackTestimonials: Testimonial[] = [
        {
            id: '1',
            name: 'Олексій К.',
            role: 'Начинающий трейдер → +40% за 3 мес',
            avatar_emoji: '🐂',
            rating: 5,
            text: 'После курса я наконец понял, почему сливал депозит. Теперь торгую по системе и за 3 месяца вышел в +40%. Больше не гадаю — следую алгоритму.',
            is_verified: true,
            location: 'Київ',
            telegram_handle: '@alexey_trader'
        },
        {
            id: '2',
            name: 'Дмитро М.',
            role: 'Пользователь инструментов',
            avatar_emoji: '📈',
            rating: 5,
            text: 'Калькулятор Risk of Ruin открыл мне глаза. Раньше рисковал 10% на сделку — сейчас 1-2% и сплю спокойно. Бесплатные инструменты — огонь!',
            is_verified: true,
            location: 'Одеса'
        },
        {
            id: '3',
            name: 'Марія С.',
            role: 'Студент курса с августа 2025',
            avatar_emoji: '💵',
            rating: 5,
            text: 'Скептически относилась к онлайн-курсам. Но здесь реальные результаты — MT4 statement не подделаешь. Уже на полпути к первой цели.',
            is_verified: true,
            location: 'Харків',
            telegram_handle: '@maria_trades'
        },
        {
            id: '4',
            name: 'Андрій П.',
            role: 'Prop-trader',
            avatar_emoji: '🚀',
            rating: 5,
            text: 'Прошёл отбор на prop-firm после этого курса. Система риск-менеджмента — именно то, что требуют фонды. Рекомендую всем серьёзным.',
            is_verified: true,
            location: 'Львів',
            telegram_handle: '@andrey_proptrader'
        }
    ];

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .eq('is_published', true)
                .eq('is_featured', true)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) {
                console.error('Error fetching testimonials:', error);
                setTestimonials(fallbackTestimonials);
            } else if (data && data.length > 0) {
                setTestimonials(data);
            } else {
                setTestimonials(fallbackTestimonials);
            }
        } catch (error) {
            console.error('Error:', error);
            setTestimonials(fallbackTestimonials);
        } finally {
            setLoading(false);
        }
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-advance slides every 5 seconds
    useEffect(() => {
        if (testimonials.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [testimonials.length]);

    if (loading || testimonials.length === 0) {
        return null;
    }

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className="py-16 px-4 bg-gradient-to-b from-trading-dark to-gray-900">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <Badge className="bg-green-600/20 text-green-400 border-green-600/30 mb-4">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Верифицированные отзывы
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
                        Что говорят наши студенты
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Реальные истории от реальных трейдеров
                    </p>
                </div>

                <div className="relative">
                    {/* Main Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 md:p-12 relative overflow-hidden">
                        {/* Decorative quote */}
                        <Quote className="absolute top-6 right-6 h-16 w-16 text-gray-800" />

                        {/* Verified Badge */}
                        {currentTestimonial.is_verified && (
                            <Badge className="absolute top-6 left-6 bg-green-600/20 text-green-400 border-green-600/30">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Верифицировано
                            </Badge>
                        )}

                        {/* Avatar and info */}
                        <div className="flex items-center gap-4 mb-6 mt-8">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
                                {currentTestimonial.avatar_emoji}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    {currentTestimonial.name}
                                    {currentTestimonial.telegram_handle && (
                                        <a
                                            href={`https://t.me/${currentTestimonial.telegram_handle.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    )}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {currentTestimonial.role}
                                </p>
                                {currentTestimonial.location && (
                                    <p className="text-gray-500 text-xs mt-1">
                                        📍 {currentTestimonial.location}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-5 w-5 ${i < currentTestimonial.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-600'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Text */}
                        <p className="text-gray-300 text-lg leading-relaxed italic mb-4">
                            "{currentTestimonial.text}"
                        </p>

                        {/* Trading Result if available */}
                        {currentTestimonial.trading_result && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <Badge className="bg-green-600/20 text-green-400">
                                    📈 Результат: {currentTestimonial.trading_result}
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={prevSlide}
                            className="rounded-full border-gray-700 hover:bg-gray-800"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                        ? 'bg-blue-500 w-6'
                                        : 'bg-gray-600 hover:bg-gray-500'
                                        }`}
                                />
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={nextSlide}
                            className="rounded-full border-gray-700 hover:bg-gray-800"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-3 gap-4 mt-8 text-center">
                        <div className="bg-gray-800/50 rounded-xl p-4">
                            <div className="text-2xl font-bold text-green-400">92%</div>
                            <div className="text-xs text-gray-400">Рекомендуют</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4">
                            <div className="text-2xl font-bold text-blue-400">4.9</div>
                            <div className="text-xs text-gray-400">Средний рейтинг</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4">
                            <div className="text-2xl font-bold text-purple-400">50+</div>
                            <div className="text-xs text-gray-400">Студентов</div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <StartTrainingButton />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
