
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Separator } from "@/components/ui/separator";
import StartTrainingButton from '@/components/shared/StartTrainingButton';
import PreRegistrationModal from '@/components/layout/PreRegistrationModal';

const InfoSection = () => {
    const { t, language } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="py-20 bg-[#0A0A0A] text-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-4 max-w-6xl">

                {/* Section 1 */}
                <div className="mb-24">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                        {t('info.title1')}
                    </h2>
                    <h3 className="text-xl md:text-2xl text-gray-300 mb-8 font-medium">
                        {t('info.subtitle1')}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-8 rounded-3xl bg-trading-card/40 border border-white/5 hover:border-blue-500/30 transition-all duration-300">
                                <div className="text-5xl font-bold text-gray-800 mb-4 opacity-50">0{i}</div>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    {t(`info.p${i}`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="bg-gray-800/50 mb-24" />

                {/* Section 2 */}
                <div className="mb-24">
                    <h2 className="text-3xl md:text-5xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                        {t('info.title2')}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2.5 mr-4 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    {t(`info.sub2.p${i}`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="bg-gray-800/50 mb-24" />

                {/* Section 3 */}
                <div className="mb-24">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">
                        {t('info.title3')}
                    </h2>
                    <h3 className="text-xl md:text-2xl text-gray-300 mb-8 font-medium">
                        {t('info.subtitle3')}
                    </h3>

                    <ul className="space-y-6 mb-12 pl-4 border-l-2 border-amber-500/20">
                        {[1, 2, 3].map((i) => (
                            <li key={i} className="text-xl text-gray-300 pl-6 relative">
                                <span className="absolute -left-[29px] top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full border-4 border-[#0A0A0A]"></span>
                                {t(`info.sub3.p${i}`)}
                            </li>
                        ))}
                    </ul>

                    <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                        <p className="text-xl md:text-3xl font-light text-center text-amber-100 italic">
                            "{t('info.stat')}"
                        </p>
                    </div>
                </div>

                {/* Section 4 */}
                <div className="text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">
                        {t('info.title4')}
                    </h2>

                    <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-4xl mx-auto mb-10">
                        {language === 'uk' ? (
                            <>
                                Трейдинг — це ваш шлях до фінансової незалежності. Pro Trader Systems дає не просто знання, а готовий алгоритм дій. Якщо ви початківець — почніть із <button onClick={() => setIsModalOpen(true)} className="text-trading-accent hover:underline focus:outline-none bg-transparent border-none p-0 inline font-medium">безкоштовної консультації</button>. Якщо вже маєте досвід — обирайте інтенсив, щоб масштабувати свій прибуток.
                            </>
                        ) : (
                            <>
                                Трейдинг — это ваш путь к финансовой независимости. Pro Trader Systems дает не просто знания, а готовый алгоритм действий. Если вы новичок — начните с <button onClick={() => setIsModalOpen(true)} className="text-trading-accent hover:underline focus:outline-none bg-transparent border-none p-0 inline font-medium">бесплатной консультации</button>. Если уже имеете опыт — выбирайте интенсив, чтобы масштабировать свою прибыль.
                            </>
                        )}
                    </p>
                    <StartTrainingButton />
                </div>

                <PreRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            </div>
        </section>
    );
};

export default InfoSection;
