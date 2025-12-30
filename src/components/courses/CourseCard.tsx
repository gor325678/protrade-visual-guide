
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Clock, Users, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    duration: string;
    students: number;
    rating: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    features: string[];
    image: string;
}

interface CourseCardProps {
    course: Course;
    isInCart: boolean;
    isProcessing: boolean;
    onAction: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
    course,
    isInCart,
    isProcessing,
    onAction
}) => {
    const { t } = useLanguage();

    const getLevelBadgeColor = (level: string) => {
        switch (level) {
            case 'beginner': return 'bg-green-100 text-green-800';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getLevelText = (level: string) => {
        switch (level) {
            case 'beginner': return t('course.level.beginner');
            case 'intermediate': return t('course.level.intermediate');
            case 'advanced': return t('course.level.advanced');
            default: return level;
        }
    };

    return (
        <Card className="bg-trading-card border-gray-800 overflow-hidden group hover:border-blue-500 transition-colors">
            <div className="relative">
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                />
                <Badge className={`absolute top-4 right-4 ${getLevelBadgeColor(course.level)}`}>
                    {getLevelText(course.level)}
                </Badge>
            </div>

            <CardHeader>
                <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students}</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-gray-300 mb-4 line-clamp-3">{course.description}</p>

                <div className="mb-4">
                    <h4 className="font-semibold mb-2">{t('course.what_you_learn')}</h4>
                    <ul className="space-y-1">
                        {course.features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {feature}
                            </li>
                        ))}
                        {course.features.length > 4 && (
                            <li className="text-sm text-gray-400">
                                +{course.features.length - 4} {t('course.more_modules')}
                            </li>
                        )}
                    </ul>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="text-2xl font-bold text-green-400">${course.price}</span>
                    </div>
                </div>

                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => onAction(course.id)}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {t('course.processing')}
                        </>
                    ) : isInCart ? (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {t('course.checkout')}
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {t('course.add_to_cart')}
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};
