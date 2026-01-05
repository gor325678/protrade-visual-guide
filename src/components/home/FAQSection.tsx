
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import StartTrainingButton from '@/components/shared/StartTrainingButton';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const FAQSection = () => {
    const { t, language } = useLanguage();
    const totalQuestions = 30;

    return (
        <section className="py-20 bg-black relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-trading-accent/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {t('faq.title')}
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto">
                        {t('faq.subtitle')}
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {Array.from({ length: totalQuestions }).map((_, i) => (
                            <AccordionItem
                                key={i}
                                value={`item-${i + 1}`}
                                className="bg-trading-card/50 border border-white/5 rounded-2xl px-8 py-4 hover:border-trading-accent/30 transition-all duration-300"
                            >
                                <AccordionTrigger className="text-left text-lg md:text-2xl font-medium hover:no-underline hover:text-trading-accent">
                                    {t(`faq.q${i + 1}`)}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-400 text-base md:text-xl leading-relaxed mt-2">
                                    {i === 29 ? (
                                        language === 'uk' ? (
                                            <span>
                                                <a href="#quiz" className="text-trading-accent hover:underline">Пройдіть тест на головній</a> або <a href="https://t.me/forexgbpgpy" target="_blank" rel="noopener noreferrer" className="text-trading-accent hover:underline">підпишіться на Telegram</a>.
                                            </span>
                                        ) : (
                                            <span>
                                                <a href="#quiz" className="text-trading-accent hover:underline">Пройдите тест на главной</a>, посмотрите <Link to="/beginner-training" className="text-trading-accent hover:underline">бесплатные материалы в разделе "Новичкам"</Link> или подпишитесь на наш <a href="https://t.me/forexgbpgpy" target="_blank" rel="noopener noreferrer" className="text-trading-accent hover:underline">Telegram канал</a>.
                                            </span>
                                        )
                                    ) : (
                                        t(`faq.a${i + 1}`)
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="mt-12 text-center">
                        <StartTrainingButton />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
