
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const FAQSection = () => {
    const { t } = useLanguage();
    const totalQuestions = 30;

    // Split questions into two columns roughly
    const midPoint = Math.ceil(totalQuestions / 2);
    const firstColIndices = Array.from({ length: midPoint }, (_, i) => i + 1);
    const secondColIndices = Array.from({ length: totalQuestions - midPoint }, (_, i) => midPoint + i + 1);

    const renderAccordionItem = (index: number) => (
        <AccordionItem
            key={index}
            value={`item-${index}`}
            className="bg-trading-card/50 border border-white/5 rounded-xl px-4 py-1 mb-4 hover:border-trading-accent/30 transition-all duration-300"
        >
            <AccordionTrigger className="text-left text-base md:text-lg font-medium hover:no-underline hover:text-trading-accent">
                {t(`faq.q${index}`)}
            </AccordionTrigger>
            <AccordionContent className="text-gray-400 text-sm md:text-base leading-relaxed">
                {t(`faq.a${index}`)}
            </AccordionContent>
        </AccordionItem>
    );

    return (
        <section className="py-20 bg-black relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-trading-accent/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {t('faq.title')}
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        {t('faq.subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-x-8 items-start">
                    <Accordion type="single" collapsible className="w-full">
                        {firstColIndices.map(index => renderAccordionItem(index))}
                    </Accordion>

                    <Accordion type="single" collapsible className="w-full">
                        {secondColIndices.map(index => renderAccordionItem(index))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
