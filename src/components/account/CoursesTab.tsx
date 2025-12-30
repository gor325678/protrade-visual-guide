
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface Course {
    id: string;
    title: string;
    progress: number;
    purchaseDate: string;
    status: string;
}

interface CoursesTabProps {
    courses: Course[];
}

export const CoursesTab: React.FC<CoursesTabProps> = ({ courses }) => {
    const { t, language } = useLanguage();

    return (
        <div className="space-y-4">
            {courses.map((course) => (
                <Card key={course.id} className="bg-trading-card border-gray-800">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                                <p className="text-gray-400">{t('courses.purchased')} {new Date(course.purchaseDate).toLocaleDateString(language === 'uk' ? 'uk-UA' : 'ru-RU')}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">{t('courses.active')}</Badge>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span>{t('courses.progress_label')}</span>
                                <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            {t('courses.continue')}
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
