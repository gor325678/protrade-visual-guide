import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Shield, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const SettingsTab: React.FC = () => {
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
