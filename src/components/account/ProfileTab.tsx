
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface ProfileTabProps {
    userInfo: UserInfo;
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    onSave: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
    userInfo,
    setUserInfo,
    isEditing,
    setIsEditing,
    onSave
}) => {
    const { t } = useLanguage();

    return (
        <Card className="bg-trading-card border-gray-800">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{t('profile.info')}</CardTitle>
                    <Button
                        variant={isEditing ? "default" : "outline"}
                        onClick={() => isEditing ? onSave() : setIsEditing(true)}
                    >
                        {isEditing ? t('profile.save') : t('profile.edit')}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="firstName">{t('profile.firstName')}</Label>
                        <Input
                            id="firstName"
                            value={userInfo.firstName}
                            onChange={(e) => setUserInfo(prev => ({ ...prev, firstName: e.target.value }))}
                            disabled={!isEditing}
                            className="bg-gray-800 border-gray-700"
                        />
                    </div>
                    <div>
                        <Label htmlFor="lastName">{t('profile.lastName')}</Label>
                        <Input
                            id="lastName"
                            value={userInfo.lastName}
                            onChange={(e) => setUserInfo(prev => ({ ...prev, lastName: e.target.value }))}
                            disabled={!isEditing}
                            className="bg-gray-800 border-gray-700"
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="email">{t('profile.email')}</Label>
                    <Input
                        id="email"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-gray-800 border-gray-700"
                    />
                </div>
                <div>
                    <Label htmlFor="phone">{t('profile.phone')}</Label>
                    <Input
                        id="phone"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-gray-800 border-gray-700"
                    />
                </div>
            </CardContent>
        </Card>
    );
};
