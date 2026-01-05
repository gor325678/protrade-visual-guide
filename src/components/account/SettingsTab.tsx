import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Shield, User, Eye, EyeOff, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

// Trader avatars
const TRADER_AVATARS = [
    { id: 'bull', emoji: '🐂', label: 'Бик' },
    { id: 'bear', emoji: '🐻', label: 'Ведмідь' },
    { id: 'candle', emoji: '📊', label: 'Свічка' },
    { id: 'chart', emoji: '📈', label: 'Графік' },
    { id: 'dollar', emoji: '💵', label: 'Долар' },
    { id: 'rocket', emoji: '🚀', label: 'Ракета' },
];

interface SettingsTabProps {
    currentAvatar?: string;
    onAvatarChange?: (avatarId: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
    currentAvatar = 'bull',
    onAvatarChange
}) => {
    const { t } = useLanguage();
    const { toast } = useToast();

    // Password change state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Avatar state
    const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            toast({
                title: t('settings.error'),
                description: t('settings.passwords_not_match'),
                variant: 'destructive'
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                title: t('settings.error'),
                description: t('settings.password_too_short'),
                variant: 'destructive'
            });
            return;
        }

        setPasswordLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            toast({
                title: t('settings.success'),
                description: t('settings.password_changed')
            });

            setShowPasswordForm(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast({
                title: t('settings.error'),
                description: error.message,
                variant: 'destructive'
            });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleAvatarSelect = async (avatarId: string) => {
        setSelectedAvatar(avatarId);
        setAvatarLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                data: { avatar: avatarId }
            });

            if (error) throw error;

            onAvatarChange?.(avatarId);
            toast({
                title: t('settings.success'),
                description: t('settings.avatar_changed')
            });
        } catch (error: any) {
            toast({
                title: t('settings.error'),
                description: error.message,
                variant: 'destructive'
            });
        } finally {
            setAvatarLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Сповіщення */}
            <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        {t('settings.notifications')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{t('settings.email_notifications')}</p>
                            <p className="text-sm text-gray-400">{t('settings.email_desc')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{t('settings.push_notifications')}</p>
                            <p className="text-sm text-gray-400">{t('settings.push_desc')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </CardContent>
            </Card>

            {/* Вибір аватара */}
            <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t('settings.avatar')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-400 mb-4">{t('settings.choose_avatar')}</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {TRADER_AVATARS.map((avatar) => (
                            <button
                                key={avatar.id}
                                onClick={() => handleAvatarSelect(avatar.id)}
                                disabled={avatarLoading}
                                className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${selectedAvatar === avatar.id
                                        ? 'border-blue-500 bg-blue-900/20'
                                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                    }`}
                            >
                                <span className="text-3xl block text-center">{avatar.emoji}</span>
                                <span className="text-xs text-gray-400 block text-center mt-1">
                                    {avatar.label}
                                </span>
                                {selectedAvatar === avatar.id && (
                                    <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
                                        <Check className="h-3 w-3 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Безпека */}
            <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {t('settings.security')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!showPasswordForm ? (
                        <>
                            <Button
                                variant="outline"
                                className="w-full border-gray-700"
                                onClick={() => setShowPasswordForm(true)}
                            >
                                {t('settings.change_password')}
                            </Button>
                            <Button variant="outline" className="w-full border-gray-700" disabled>
                                {t('settings.2fa')}
                            </Button>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">
                                    {t('settings.new_password')}
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="bg-gray-800 border-gray-700 pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">
                                    {t('settings.confirm_password')}
                                </label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="bg-gray-800 border-gray-700"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-gray-700"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setNewPassword('');
                                        setConfirmPassword('');
                                    }}
                                >
                                    {t('settings.cancel')}
                                </Button>
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    onClick={handlePasswordChange}
                                    disabled={passwordLoading || !newPassword || !confirmPassword}
                                >
                                    {passwordLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                    ) : (
                                        t('settings.save')
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
