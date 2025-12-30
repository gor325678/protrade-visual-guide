
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from '@/contexts/LanguageContext';

const ProblemSolutionSection = () => {
    const { t } = useLanguage();

    const problemsSolutions = [
        {
            problem: t('problems.base.problem'),
            problemDesc: t('problems.base.problemDesc'),
            solution: t('problems.base.solution'),
            solutionDesc: t('problems.base.solutionDesc'),
        },
        {
            problem: t('problems.system.problem'),
            problemDesc: t('problems.system.problemDesc'),
            solution: t('problems.system.solution'),
            solutionDesc: t('problems.system.solutionDesc'),
        },
        {
            problem: t('problems.isolation.problem'),
            problemDesc: t('problems.isolation.problemDesc'),
            solution: t('problems.isolation.solution'),
            solutionDesc: t('problems.isolation.solutionDesc'),
        },
        {
            problem: t('problems.deposit.problem'),
            problemDesc: t('problems.deposit.problemDesc'),
            solution: t('problems.deposit.solution'),
            solutionDesc: t('problems.deposit.solutionDesc'),
        },
        {
            problem: t('problems.burnout.problem'),
            problemDesc: t('problems.burnout.problemDesc'),
            solution: t('problems.burnout.solution'),
            solutionDesc: t('problems.burnout.solutionDesc'),
        },
        {
            problem: t('problems.chaos.problem'),
            problemDesc: t('problems.chaos.problemDesc'),
            solution: t('problems.chaos.solution'),
            solutionDesc: t('problems.chaos.solutionDesc'),
        },
        {
            problem: t('problems.time.problem'),
            problemDesc: t('problems.time.problemDesc'),
            solution: t('problems.time.solution'),
            solutionDesc: t('problems.time.solutionDesc'),
        },
        {
            problem: t('problems.signals.problem'),
            problemDesc: t('problems.signals.problemDesc'),
            solution: t('problems.signals.solution'),
            solutionDesc: t('problems.signals.solutionDesc'),
        },
    ];

    return (
        <section className="bg-trading-dark relative">
            <div className="container mx-auto px-4 pt-20 pb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 pb-2">
                    {t('problems.title')}
                </h2>
                <h3 className="text-xl md:text-2xl text-center font-normal text-gray-400 mb-12">
                    {t('problems.subtitle')}
                </h3>
            </div>

            <div className="w-full relative">
                {problemsSolutions.map((item, index) => (
                    <Card key={index} item={item} index={index} />
                ))}
            </div>

            <div className="h-20"></div> {/* Spacer at bottom */}
        </section>
    );
};

const Card = ({ item, index }: { item: any, index: number }) => {
    const { t } = useLanguage();

    return (
        <div
            className="sticky top-0 h-screen flex items-center justify-center sticky-card-container"
            style={{
                zIndex: index + 1,
            }}
        >
            <div
                className="w-full max-w-xl p-8 rounded-3xl bg-[#0F0F0F] border border-gray-800 flex flex-col items-center relative group shadow-2xl transition-all duration-500 transform"
                style={{
                    marginTop: `${index * 20}px`,
                }}
            >
                {/* Problem Section */}
                <div className="flex flex-col items-center w-full">
                    <Badge variant="outline" className="mb-4 text-red-500 border-red-500/20 bg-red-500/10 px-4 py-1 rounded-full text-sm font-medium">
                        {t('problems.badge.problem')}
                    </Badge>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-center">
                        {item.problem}
                    </h3>
                    <p className="text-base text-gray-400 leading-relaxed mb-6 text-center">
                        {item.problemDesc}
                    </p>
                </div>

                <Separator className="bg-gray-800 my-6 w-full" />

                {/* Solution Section */}
                <div className="flex flex-col items-center w-full">
                    <Badge variant="outline" className="mb-4 text-emerald-500 border-emerald-500/20 bg-emerald-500/10 px-4 py-1 rounded-full text-sm font-medium">
                        {t('problems.badge.solution')}
                    </Badge>
                    <h3 className="text-xl md:text-2xl font-bold text-emerald-400 mb-3 text-center">
                        {item.solution}
                    </h3>
                    <p className="text-base text-gray-400 leading-relaxed text-center">
                        {item.solutionDesc}
                    </p>
                </div>
                {/* Card Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-emerald-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
        </div>
    );
};

export default ProblemSolutionSection;
