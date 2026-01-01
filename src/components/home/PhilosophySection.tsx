import React from 'react';
import { Target, TrendingUp, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PhilosophySection = () => {
    const { t } = useLanguage();

    return (
        <section className="w-full bg-trading-dark pb-20 relative overflow-hidden">
            {/* 1. Full Width Image Banner */}
            <div className="w-full h-[65vh] md:h-[90vh] relative">
                <img
                    src="/images/philosophy_vintage.jpg"
                    alt="Trading Philosophy - Compass and Discipline"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* 2. Content Container - Centered */}
            <div className="max-w-5xl mx-auto px-4 relative z-20 -mt-20 md:-mt-32">

                {/* Discipline & Risk Badge - Featured Card */}
                <div className="w-fit mx-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 mb-12 shadow-2xl animate-fade-in-up">
                    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-center md:text-left">
                        <div className="p-4 bg-yellow-500/10 rounded-full">
                            <Shield className="w-12 h-12 text-yellow-500" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-white mb-2">Дисциплина и Риск-менеджмент</h4>
                            <p className="text-gray-300 text-lg">Основа стабильного успеха и долгосрочного роста капитала</p>
                        </div>
                    </div>
                </div>

                {/* Main Philosophy Text */}
                <div className="space-y-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Философия и цели <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                                системы ProTrader Systems
                            </span>
                        </h2>
                        <div className="h-1 w-24 bg-purple-500 rounded-full mx-auto" />
                    </div>

                    {/* Text Blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-gray-300 leading-relaxed font-light">
                        <div className="space-y-6">
                            <p>
                                Торговая система <span className="text-white font-medium">ProTrader Systems</span> представляет собой комплексный, основанный на строгих правилах подход к трейдингу. Ее основная цель — идентификация и использование устойчивых трендовых движений, так называемых <span className="text-purple-400">"истинных трендов"</span>.
                            </p>
                            <p>
                                Система создана для того, чтобы дать трейдеру четкое преимущество за счет своевременного входа в зарождающийся тренд и грамотного сопровождения позиции до его завершения, используя динамические правила управления.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <p>
                                Ключевая философия системы заключается в торговле исключительно по направлению основного тренда. Мы отказываемся от предопределенных целей по прибыли в пользу стремления захватить значительную часть движения, каким бы длинным оно ни оказалось.
                            </p>

                            {/* Icons within text column */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg border border-white/10">
                                    <Target className="w-5 h-5 text-purple-400" />
                                    <span className="text-sm font-medium">Торговля по тренду</span>
                                </div>
                                <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg border border-white/10">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                    <span className="text-sm font-medium">Максимизация прибыли</span>
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
