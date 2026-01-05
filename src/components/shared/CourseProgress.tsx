import React from 'react';

interface CourseProgressProps {
    progress: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
}

export const CourseProgress: React.FC<CourseProgressProps> = ({
    progress,
    size = 'md',
    showLabel = true,
    className = ''
}) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    const sizes = {
        sm: { circle: 60, stroke: 4, text: 'text-sm' },
        md: { circle: 80, stroke: 6, text: 'text-lg' },
        lg: { circle: 120, stroke: 8, text: 'text-2xl' }
    };

    const { circle, stroke, text } = sizes[size];
    const radius = (circle - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (clampedProgress / 100) * circumference;

    const getColor = () => {
        if (clampedProgress >= 80) return 'text-green-500';
        if (clampedProgress >= 50) return 'text-blue-500';
        if (clampedProgress >= 25) return 'text-yellow-500';
        return 'text-gray-500';
    };

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg
                className="transform -rotate-90"
                width={circle}
                height={circle}
            >
                {/* Background circle */}
                <circle
                    className="text-gray-700"
                    strokeWidth={stroke}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={circle / 2}
                    cy={circle / 2}
                />
                {/* Progress circle */}
                <circle
                    className={`${getColor()} transition-all duration-500 ease-out`}
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={circle / 2}
                    cy={circle / 2}
                />
            </svg>
            {showLabel && (
                <span className={`absolute ${text} font-bold text-white`}>
                    {Math.round(clampedProgress)}%
                </span>
            )}
        </div>
    );
};

// Linear progress bar variant
interface LinearProgressProps {
    progress: number;
    className?: string;
    showLabel?: boolean;
}

export const LinearProgress: React.FC<LinearProgressProps> = ({
    progress,
    className = '',
    showLabel = false
}) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div className={`w-full ${className}`}>
            {showLabel && (
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Прогрес</span>
                    <span className="text-white font-medium">{Math.round(clampedProgress)}%</span>
                </div>
            )}
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
        </div>
    );
};

export default CourseProgress;
