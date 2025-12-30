
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const SettingsTab = () => {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
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

            <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {t('settings.security')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full border-gray-700">
                        {t('settings.change_password')}
                    </Button>
                    <Button variant="outline" className="w-full border-gray-700">
                        {t('settings.2fa')}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
