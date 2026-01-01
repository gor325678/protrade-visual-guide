import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from '@/contexts/LanguageContext';

export interface ProblemSolutionItem {
    problem: string;
    problemDesc: string;
    solution: string;
    solutionDesc: string;
}

interface ProblemSolutionCardProps {
    item: ProblemSolutionItem;
    index: number;
    total: number;
    style?: React.CSSProperties;
}

const ProblemSolutionCard: React.FC<ProblemSolutionCardProps> = ({ item, index, total, style }) => {
    const { t } = useLanguage();

    return (
        <div
            className="w-full max-w-5xl flex flex-col items-center p-4" // Wrapper for positioning
            style={style}
        >
            <div
                className="w-auto max-w-5xl px-6 py-10 md:px-12 md:py-14 rounded-[3rem] bg-[#1A1A1A] border border-gray-800 flex flex-col items-center relative group shadow-2xl animate-float-card mx-4"
            >
                {/* Problem Section */}
                <div className="flex flex-col items-center w-full">
                    <Badge variant="outline" className="mb-4 text-red-500 border-red-500/20 bg-red-500/10 px-4 py-1 rounded-full text-base font-medium">
                        {t('problems.badge.problem')}
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                        {item.problem}
                    </h3>
                    <p className="text-2xl md:text-3xl text-gray-400 leading-relaxed mb-6 text-center max-w-3xl">
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
                    <p className="text-2xl md:text-3xl text-gray-400 leading-relaxed text-center max-w-3xl">
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

export default ProblemSolutionCard;
