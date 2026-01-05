import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface StartTrainingButtonProps {
    className?: string;
    size?: 'default' | 'sm' | 'lg' | 'icon';
    text?: string;
}

const StartTrainingButton = ({ className, size = 'lg', text }: StartTrainingButtonProps) => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleStartLearning = () => {
        navigate('/courses');
    };

    return (
        <Button
            onClick={handleStartLearning}
            size={size}
            className={`bg-lime-500 hover:bg-lime-400 text-black font-black text-lg border-none px-10 py-6 shadow-[0_0_20px_rgba(132,204,22,0.6)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(132,204,22,0.8)] ${className}`}
        >
            {text || t('hero.start') || "НАЧАТЬ ОБУЧЕНИЕ"}
        </Button>
    );
};

export default StartTrainingButton;
