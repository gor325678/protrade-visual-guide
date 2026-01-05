import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CountdownTimerProps {
    targetDate: Date;
    label?: string;
    className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
    targetDate,
    label,
    className = ''
}) => {
    const { t } = useLanguage();
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = targetDate.getTime() - new Date().getTime();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            expired: false
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (timeLeft.expired) {
        return null;
    }

    const TimeBlock = ({ value, labelKey }: { value: number; labelKey: string }) => (
        <div className="flex flex-col items-center">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-lg px-3 py-2 min-w-[50px]">
                <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                    {String(value).padStart(2, '0')}
                </span>
            </div>
            <span className="text-xs text-gray-500 mt-1 uppercase">{t(labelKey)}</span>
        </div>
    );

    return (
        <div className={`bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-800/50 rounded-xl p-4 ${className}`}>
            <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-red-400 animate-pulse" />
                <span className="text-red-400 font-semibold">
                    {label || t('countdown.offer_ends')}
                </span>
            </div>

            <div className="flex justify-center items-center gap-2 md:gap-4">
                <TimeBlock value={timeLeft.days} labelKey="countdown.days" />
                <span className="text-2xl text-gray-600">:</span>
                <TimeBlock value={timeLeft.hours} labelKey="countdown.hours" />
                <span className="text-2xl text-gray-600">:</span>
                <TimeBlock value={timeLeft.minutes} labelKey="countdown.mins" />
                <span className="text-2xl text-gray-600">:</span>
                <TimeBlock value={timeLeft.seconds} labelKey="countdown.secs" />
            </div>
        </div>
    );
};

export default CountdownTimer;
