import React, { useState } from 'react';
import { Copy, Share2, Gift, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';

interface ReferralSectionProps {
    userId: string;
    referralCount?: number;
    earnedDiscount?: number;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({
    userId,
    referralCount = 0,
    earnedDiscount = 0
}) => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    // Generate referral link
    const referralCode = userId.slice(0, 8).toUpperCase();
    const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            toast({
                title: t('referral.copied'),
                description: t('referral.copied_desc')
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'ProTrader Systems',
                    text: t('referral.share_text'),
                    url: referralLink
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            copyToClipboard();
        }
    };

    return (
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-600/20 rounded-xl">
                    <Gift className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{t('referral.title')}</h3>
                    <p className="text-sm text-gray-400">{t('referral.subtitle')}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">{referralCount}</div>
                    <div className="text-xs text-gray-400">{t('referral.friends_invited')}</div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{earnedDiscount}%</div>
                    <div className="text-xs text-gray-400">{t('referral.discount_earned')}</div>
                </div>
            </div>

            {/* Referral Link */}
            <div className="bg-gray-900 rounded-lg p-3 mb-4 flex items-center gap-2">
                <code className="flex-1 text-sm text-gray-300 truncate">{referralLink}</code>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                    className="shrink-0"
                >
                    {copied ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                    )}
                </Button>
            </div>

            <div className="flex gap-3">
                <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="flex-1 border-purple-700 text-purple-400 hover:bg-purple-900/30"
                >
                    <Copy className="h-4 w-4 mr-2" />
                    {t('referral.copy')}
                </Button>
                <Button
                    onClick={shareLink}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                    <Share2 className="h-4 w-4 mr-2" />
                    {t('referral.share')}
                </Button>
            </div>

            {/* How it works */}
            <div className="mt-6 pt-6 border-t border-gray-800">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">{t('referral.how_it_works')}</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 text-xs flex items-center justify-center">1</span>
                        {t('referral.step1')}
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 text-xs flex items-center justify-center">2</span>
                        {t('referral.step2')}
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 text-xs flex items-center justify-center">3</span>
                        {t('referral.step3')}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ReferralSection;
