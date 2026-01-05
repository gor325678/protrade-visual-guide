import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import StartTrainingButton from '@/components/shared/StartTrainingButton';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    avatar: string;
    rating: number;
    text: string;
}

const TestimonialsSection: React.FC = () => {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: t('testimonials.1.name'),
            role: t('testimonials.1.role'),
            avatar: '🐂',
            rating: 5,
            text: t('testimonials.1.text')
        },
        {
            id: 2,
            name: t('testimonials.2.name'),
            role: t('testimonials.2.role'),
            avatar: '📈',
            rating: 5,
            text: t('testimonials.2.text')
        },
        {
            id: 3,
            name: t('testimonials.3.name'),
            role: t('testimonials.3.role'),
            avatar: '💵',
            rating: 5,
            text: t('testimonials.3.text')
        },
        {
            id: 4,
            name: t('testimonials.4.name'),
            role: t('testimonials.4.role'),
            avatar: '🚀',
            rating: 5,
            text: t('testimonials.4.text')
        }
    ];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className="py-16 px-4 bg-gradient-to-b from-trading-dark to-gray-900">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
                        {t('testimonials.title')}
                    </h2>
                    <p className="text-gray-400 text-lg">
                        {t('testimonials.subtitle')}
                    </p>
                </div>

                <div className="relative">
                    {/* Main Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 md:p-12 relative overflow-hidden">
                        {/* Decorative quote */}
                        <Quote className="absolute top-6 right-6 h-16 w-16 text-gray-800" />

                        {/* Avatar and info */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl">
                                {currentTestimonial.avatar}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    {currentTestimonial.name}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {currentTestimonial.role}
                                </p>
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
                        <p className="text-gray-300 text-lg leading-relaxed italic">
                            "{currentTestimonial.text}"
                        </p>
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

                    <div className="mt-12 text-center">
                        <StartTrainingButton />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
