import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const VintageQuoteSection = () => {
    const { t } = useLanguage();

    return (
        <section className="w-full relative min-h-[500px] flex items-center justify-center py-20 bg-cover bg-center bg-no-repeat bg-fixed border-t border-gray-800"
            style={{
                backgroundImage: 'url("/vintage-office.jpg")',
            }}>
            <div className="absolute inset-0 bg-black/60" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <blockquote className="max-w-4xl mx-auto">
                    <p className="text-xl md:text-3xl text-gray-100 leading-relaxed italic font-serif">
                        "Обучение в этой системе напоминает сборку высокоточного механизма: сначала вы изучаете каждую деталь (индикаторы), затем понимаете среду, в которой он работает (режимы цены), и только после этого приступаете к запуску (входам) сопровождению и управлению процессом (выходам)."
                    </p>
                </blockquote>
            </div>
        </section>
    );
};

export default VintageQuoteSection;
