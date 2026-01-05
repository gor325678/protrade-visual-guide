import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TELEGRAM_SUPPORT_URL = 'https://t.me/forexgbpgpy';

export const SupportButton: React.FC = () => {
    const { t } = useLanguage();
    const [isHovered, setIsHovered] = useState(false);

    const openTelegram = () => {
        window.open(TELEGRAM_SUPPORT_URL, '_blank');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Tooltip */}
            <div
                className={`bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 shadow-2xl max-w-xs transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
            >
                <p className="text-sm text-white font-medium mb-1">
                    {t('support.title')}
                </p>
                <p className="text-xs text-gray-400">
                    {t('support.description')}
                </p>
            </div>

            {/* Main Button */}
            <button
                onClick={openTelegram}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110"
            >
                {/* Pulse animation */}
                <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-25"></span>

                {/* Icon */}
                <Send className="h-6 w-6 relative z-10" />

                {/* Telegram badge */}
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    TG
                </span>
            </button>
        </div>
    );
};

export default SupportButton;
