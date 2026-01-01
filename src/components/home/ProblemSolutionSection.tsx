import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProblemSolutionCard, { ProblemSolutionItem } from './ProblemSolutionCard';

const ProblemSolutionSection = () => {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    const problemsSolutions: ProblemSolutionItem[] = [
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

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const { top, height } = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const scrolled = -top;
            const totalScrollable = height - windowHeight;

            if (totalScrollable <= 0) return;

            const rawProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));
            setProgress(rawProgress);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section
            ref={containerRef}
            className="bg-trading-dark relative"
            style={{ height: `${problemsSolutions.length * 80 + 100}vh` }}
        >
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

                {/* Header - Stays at top */}
                <div className="absolute top-8 left-0 right-0 z-30 transition-opacity duration-300"
                    style={{ opacity: Math.max(0, 1 - progress * 4) }}>
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 pb-2">
                            {t('problems.title')}
                        </h2>
                        <h3 className="text-xl md:text-3xl text-center font-normal text-gray-400">
                            {t('problems.subtitle')}
                        </h3>
                    </div>
                </div>

                {/* Cards Container */}
                <div className="w-full h-full flex items-center justify-center relative perspective-1000">
                    {problemsSolutions.map((item, index) => {
                        const globalPos = progress * (problemsSolutions.length);
                        const offset = globalPos - index;

                        let style: React.CSSProperties = {
                            position: 'absolute',
                            zIndex: problemsSolutions.length - index,
                            transition: 'transform 0.1s linear, opacity 0.1s linear, filter 0.2s',
                            willChange: 'transform, opacity',
                        };

                        if (offset < 0) {
                            // Upcoming
                            const dist = -offset;
                            if (dist > 2) {
                                style.opacity = 0;
                                style.transform = `scale(0.8) translateY(100px)`;
                                style.pointerEvents = 'none';
                            } else {
                                style.opacity = Math.max(0, 1 - dist * 0.5);
                                style.transform = `scale(${0.9 + (1 - dist) * 0.1}) translateY(${dist * 20}px)`;
                            }
                        } else if (offset >= 0) {
                            // Active or Past
                            const moveUp = offset * 120;
                            style.transform = `translateY(-${moveUp}%) scale(${1 - offset * 0.1})`;
                            style.opacity = 1 - (offset * 0.5);

                            if (offset > 1.5) {
                                style.opacity = 0;
                                style.pointerEvents = 'none';
                            }
                        }

                        return (
                            <ProblemSolutionCard
                                key={index}
                                item={item}
                                index={index}
                                total={problemsSolutions.length}
                                style={style}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProblemSolutionSection;
