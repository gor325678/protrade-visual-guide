
import React, { useRef, useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from '@/contexts/LanguageContext';

const ProblemSolutionSection = () => {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

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

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const { top, height } = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Start animating when the section is at the top of the viewport
            // We want the pinning to happen roughly when top is near 0.
            const scrolled = -top;
            const totalScrollable = height - windowHeight;

            if (totalScrollable <= 0) return;

            // Calculate 0..1 progress
            const rawProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));

            // Optimization: Only update if changed significantly
            setProgress(rawProgress);
        };

        window.addEventListener('scroll', handleScroll);
        // Call once to init
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Layout configuration
    // We want a long scroll area.
    // Each card gets a 'segment' of the scroll.
    const segmentLength = 1 / problemsSolutions.length;

    return (
        <section
            ref={containerRef}
            className="bg-trading-dark relative"
            style={{ height: `${problemsSolutions.length * 80 + 100}vh` }} // Dynamic height
        >
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

                {/* Header - Stays at top */}
                <div className="absolute top-8 left-0 right-0 z-30 transition-opacity duration-300"
                    style={{ opacity: Math.max(0, 1 - progress * 4) }}>
                    {/* Fades out as we scroll deep? Or stays? User said "Problem/Solution section". 
                         Usually header stays or scrolls away. If sticky container is h-screen, header inside it stays.
                         Let's keep it visible but maybe fade slightly if cards go over it. 
                         Actually, if cards go UP, they go over header. So header should be z-30 (above cards?).
                         No, card moves UP, covering header? 
                         If card moves up, it goes off screen.
                         Let's keep header z-index low?
                     */}
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
                        // Calculate this card's specific progress
                        // total cards = N
                        // progress 0..1
                        const globalPos = progress * (problemsSolutions.length);
                        const offset = globalPos - index;

                        // offset < 0: Upcoming
                        // offset 0..1: Active (Moving up)
                        // offset > 1: Done (Moved up)

                        let style: React.CSSProperties = {
                            position: 'absolute',
                            zIndex: problemsSolutions.length - index,
                            transition: 'transform 0.1s linear, opacity 0.1s linear, filter 0.2s',
                            willChange: 'transform, opacity',
                            // Center using flex parent, but absolute needs explicit coords if we want robust animation
                            // actually flex center + absolute works if we don't set top/left
                        };

                        if (offset < 0) {
                            // Upcoming: Wait at center.
                            // Add slight scale variance for "stack" look
                            const dist = -offset;
                            // dist 1 means 1 full card away.
                            // Stack them behind: Scale down, translate down slightly?
                            // User: "Appear from middle". 
                            // So they sit in middle.
                            if (dist > 2) {
                                // Far away: Hidden or very small
                                style.opacity = 0;
                                style.transform = `scale(0.8) translateY(100px)`;
                                style.pointerEvents = 'none';
                            } else {
                                // Approaching:
                                style.opacity = Math.max(0, 1 - dist * 0.5);
                                style.transform = `scale(${0.9 + (1 - dist) * 0.1}) translateY(${dist * 20}px)`;
                            }
                        } else if (offset >= 0) {
                            // Active or Past
                            // Move UP (-Y) and Shrink
                            // offset 0 -> 1
                            const moveUp = offset * 120; // 120% of card height? Or viewport? 
                            // Use units relative to card roughly (say 400px)
                            style.transform = `translateY(-${moveUp}%) scale(${1 - offset * 0.1})`;
                            style.opacity = 1 - (offset * 0.5); // Fade out as it goes up

                            if (offset > 1.5) {
                                style.opacity = 0;
                                style.pointerEvents = 'none';
                            }
                        }

                        return (
                            <Card
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

const Card = ({ item, index, total, style }: { item: any, index: number, total: number, style?: React.CSSProperties }) => {
    const { t } = useLanguage();

    return (
        <div
            className="w-full max-w-5xl flex flex-col items-center p-4" // Wrapper for positioning
            style={style}
        >
            <div
                className="w-auto max-w-5xl px-6 py-10 md:px-12 md:py-14 rounded-[3rem] bg-[#1A1A1A] border border-gray-800 flex flex-col items-center relative group shadow-2xl animate-float-card mx-4"
            // Kept animate-float-card for the idle bobbing effect
            >
                {/* Problem Section */}
                <div className="flex flex-col items-center w-full">
                    <Badge variant="outline" className="mb-4 text-red-500 border-red-500/20 bg-red-500/10 px-4 py-1 rounded-full text-base font-medium">
                        {t('problems.badge.problem')}
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                        {item.problem}
                    </h3>
                    <p className="text-lg text-gray-400 leading-relaxed mb-6 text-center max-w-3xl">
                        {item.problemDesc}
                    </p>
                </div>

                <Separator className="bg-gray-800 my-6 w-full" />

                {/* Solution Section */}
                <div className="flex flex-col items-center w-full">
                    <Badge variant="outline" className="mb-4 text-emerald-500 border-emerald-500/20 bg-emerald-500/10 px-4 py-1 rounded-full text-base font-medium">
                        {t('problems.badge.solution')}
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-2 text-center">
                        {item.solution}
                    </h3>
                    <p className="text-lg text-gray-400 leading-relaxed text-center max-w-3xl">
                        {item.solutionDesc}
                    </p>
                </div>
                {/* Card Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 via-transparent to-emerald-500/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Visual card counter */}
                <div className="absolute top-6 right-8 text-gray-700 font-mono text-sm">
                    {index + 1}/{total}
                </div>
            </div>
        </div>
    );
};

export default ProblemSolutionSection;
