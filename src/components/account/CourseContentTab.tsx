import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import {
    Play,
    FileText,
    Lock,
    CheckCircle,
    BookOpen,
    Video,
    Loader2,
    GraduationCap
} from 'lucide-react';
import VideoPlayer from '@/components/training/VideoPlayer';
import { useNavigate } from 'react-router-dom';

interface Module {
    id: string;
    course_id: string;
    title: string;
    description: string;
    position: number;
    is_published: boolean;
    created_at: string;
}

interface CourseWithAccess {
    id: string;
    title: string;
    description: string;
    price_usdt: number;
    hasAccess: boolean;
}

interface CourseContentTabProps {
    courses: CourseWithAccess[];
    userId: string;
}

interface TrainingVideo {
    id: string;
    title: string;
    type: 'local' | 'youtube' | 'googledrive';
    url: string;
    thumbnailUrl?: string;
}

export const CourseContentTab: React.FC<CourseContentTabProps> = ({ courses, userId }) => {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const navigate = useNavigate();

    // Get courses with access
    const accessibleCourses = courses.filter(c => c.hasAccess);
    const hasAnyAccess = accessibleCourses.length > 0;

    useEffect(() => {
        if (hasAnyAccess) {
            fetchModules();
        } else {
            setLoading(false);
        }
    }, [courses]);

    const fetchModules = async () => {
        try {
            setLoading(true);

            // Get course IDs that user has access to
            const courseIds = accessibleCourses.map(c => c.id);

            const { data, error } = await supabase
                .from('modules')
                .select('*')
                .in('course_id', courseIds)
                .eq('is_published', true)
                .order('position', { ascending: true });

            if (error) throw error;

            setModules(data || []);
        } catch (error) {
            console.error('Error fetching modules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayVideo = (module: Module) => {
        // For now, create a placeholder video object
        // In the future, this will link to actual video content from course_materials
        setSelectedVideo({
            id: module.id,
            title: module.title,
            type: 'youtube',
            url: '' // Will be populated from course_materials later
        });
        setIsVideoOpen(true);
    };

    const handleCloseVideo = () => {
        setIsVideoOpen(false);
        setSelectedVideo(null);
    };

    // Group modules by course
    const modulesByCourse = accessibleCourses.map(course => ({
        course,
        modules: modules.filter(m => m.course_id === course.id)
    }));

    // No access state
    if (!hasAnyAccess) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Навчання</h2>
                </div>

                <Card className="bg-trading-card border-gray-800">
                    <CardContent className="p-12 text-center">
                        <Lock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Немає доступу до курсів</h3>
                        <p className="text-gray-400 mb-6">
                            Придбайте курс, щоб отримати доступ до навчальних матеріалів
                        </p>
                        <Button
                            onClick={() => navigate('/courses')}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Переглянути курси
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Навчання</h2>
                </div>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-3 text-gray-400">Завантаження матеріалів...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Навчання</h2>
                <Badge variant="outline" className="border-green-500 text-green-400">
                    {accessibleCourses.length} активних курсів
                </Badge>
            </div>

            {/* Course Content */}
            {modulesByCourse.map(({ course, modules: courseModules }) => (
                <Card key={course.id} className="bg-trading-card border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <GraduationCap className="h-6 w-6 text-green-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{course.title}</CardTitle>
                                    <p className="text-sm text-gray-400 mt-1">{course.description}</p>
                                </div>
                            </div>
                            <Badge className="bg-green-600">Доступ активний</Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {courseModules.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>Матеріали курсу скоро будуть додані</p>
                            </div>
                        ) : (
                            <Accordion type="multiple" className="w-full">
                                {courseModules.map((module, index) => (
                                    <AccordionItem
                                        key={module.id}
                                        value={module.id}
                                        className="border-b border-gray-800 last:border-b-0"
                                    >
                                        <AccordionTrigger className="px-6 py-4 hover:bg-gray-800/50 hover:no-underline">
                                            <div className="flex items-center gap-4 w-full">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm">
                                                    {module.position}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <h4 className="font-semibold text-white">{module.title}</h4>
                                                    {module.description && (
                                                        <p className="text-sm text-gray-400 mt-1">{module.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mr-4">
                                                    <Video className="h-4 w-4 text-gray-500" />
                                                    <span className="text-xs text-gray-500">Відео</span>
                                                </div>
                                            </div>
                                        </AccordionTrigger>

                                        <AccordionContent className="px-6 pb-4">
                                            <div className="ml-12 space-y-3">
                                                {/* Placeholder for lesson content - will be populated from course_materials */}
                                                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                                                            <Play className="h-4 w-4 text-blue-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-white">{module.title}</p>
                                                            <p className="text-xs text-gray-500">Натисніть для перегляду</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Navigate to training page or open video
                                                            navigate('/beginner-training');
                                                        }}
                                                    >
                                                        <Play className="h-4 w-4 mr-1" />
                                                        Дивитись
                                                    </Button>
                                                </div>

                                                {/* Additional materials hint */}
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                                    <CheckCircle className="h-3 w-3" />
                                                    <span>Відео захищене від скачування</span>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </CardContent>
                </Card>
            ))}

            {/* Video Player Modal */}
            {selectedVideo && (
                <VideoPlayer
                    video={selectedVideo}
                    isOpen={isVideoOpen}
                    onClose={handleCloseVideo}
                    autoPlay={true}
                />
            )}
        </div>
    );
};

export default CourseContentTab;
