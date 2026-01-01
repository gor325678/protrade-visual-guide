import React from 'react';
import { Target, TrendingUp, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PhilosophySection = () => {
    const { t } = useLanguage();

    return (
        <section className="w-full py-20 px-4 bg-trading-dark relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-900/10 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* Text Content */}
                <div className="space-y-8 animate-fade-in-right">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400 leading-tight">
                            Философия и цели <br />
                            <span className="text-white">системы ProTrader Systems</span>
                        </h2>
                        <div className="h-1 w-20 bg-purple-500 rounded-full" />
                    </div>

                    <div className="space-y-6 text-lg text-gray-300 leading-relaxed font-light">
                        <p>
                            Торговая система <span className="text-white font-medium">ProTrader Systems</span> представляет собой комплексный, основанный на строгих правилах подход к трейдингу. Ее основная цель — идентификация и использование устойчивых трендовых движений, так называемых <span className="text-purple-400">"истинных трендов"</span>, на различных таймфреймах с особым акцентом на дисциплинированном управлении рисками.
                        </p>
                        <p>
                            Система создана для того, чтобы дать трейдеру четкое преимущество за счет своевременного входа в зарождающийся тренд и грамотного сопровождения позиции до его завершения.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-lg border border-white/10">
                                <Target className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                                <p className="text-sm">Торговля по тренду</p>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-lg border border-white/10">
                                <TrendingUp className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                                <p className="text-sm">Максимизация прибыли</p>
                            </div>
                        </div>

                        <p>
                            Ключевая философия системы заключается в торговле исключительно по направлению основного тренда, отказе от предопределенных целей по прибыли и стремлении захватить значительную часть трендового движения, каким бы длинным оно ни оказалось.
                        </p>
                        <p>
                            Вместо того чтобы пытаться предсказать, где развернется цена, система предлагает набор инструментов и правил для динамического управления позицией, позволяя прибыли расти и своевременно фиксируя ее при появлении признаков ослабления тренда.
                        </p>
                    </div>
                </div>

                {/* Image/Visual */}
                <div className="relative animate-fade-in-left group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                        <img
                            src="/images/trading_philosophy.png"
                            alt="Abstract Trading Philosophy"
                            className="w-full h-auto object-cover transform hover:scale-105 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-trading-dark/80 via-transparent to-transparent" />

                        {/* Floating Badge */}
                        <div className="absolute bottom-8 left-8 right-8 bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10">
                            <div className="flex items-center space-x-4">
                                <Shield className="w-8 h-8 text-yellow-500" />
                                <div>
                                    <h4 className="text-white font-semibold">Дисциплина и Риск-менеджмент</h4>
                                    <p className="text-sm text-gray-400">Основа стабильного успеха</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default PhilosophySection;
