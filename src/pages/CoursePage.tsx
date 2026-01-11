import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft, Lock, Play, Video, CheckCircle, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import VideoPlayer from '@/components/training/VideoPlayer';

interface Module {
    id: string;
    course_id: string;
    title: string;
    description: string;
    position: number;
    is_published: boolean;
    created_at: string;
}

interface Course {
    id: string;
    title: string;
    description: string;
}

interface TrainingVideo {
    id: string;
    title: string;
    type: 'local' | 'youtube' | 'googledrive';
    url: string;
    thumbnailUrl?: string;
}

const CoursePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [hasAccess, setHasAccess] = useState(false);

    // Video player state
    const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchCourseData();
        }
    }, [id]);

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/login');
                return;
            }

            // 1. Get course details
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select('id, title, description')
                .eq('id', id)
                .single();

            if (courseError) throw courseError;
            setCourse(courseData);

            // 2. Check enrollment
            const { data: enrollment, error: enrollmentError } = await supabase
                .from('enrollments')
                .select('id')
                .eq('user_id', user.id)
                .eq('course_id', id)
                .maybeSingle();

            if (enrollmentError) throw enrollmentError;

            if (!enrollment) {
                setHasAccess(false);
                setLoading(false);
                return;
            }

            setHasAccess(true);

            // 3. Fetch modules if access granted
            const { data: modulesData, error: modulesError } = await supabase
                .from('modules')
                .select('*')
                .eq('course_id', id)
                .eq('is_published', true)
                .order('position', { ascending: true });

            if (modulesError) throw modulesError;
            setModules(modulesData || []);

        } catch (error) {
            console.error('Error fetching course data:', error);
            // Determine if it is a 404 or access error
        } finally {
            setLoading(false);
        }
    };

    const handlePlayVideo = (module: Module) => {
        // Placeholder video logic
        setSelectedVideo({
            id: module.id,
            title: module.title,
            type: 'youtube',
            url: '' // Placeholder
        });
        setIsVideoOpen(true);
    };

    const handleCloseVideo = () => {
        setIsVideoOpen(false);
        setSelectedVideo(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-trading-dark flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-trading-dark flex flex-col items-center justify-center text-white">
                <h1 className="text-2xl font-bold mb-4">Курс не найден</h1>
                <Button onClick={() => navigate('/account')}>Вернуться в кабинет</Button>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-trading-dark flex flex-col">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
                    <Lock className="h-16 w-16 text-gray-500 mb-6" />
                    <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
                    <p className="text-gray-400 max-w-md mb-8">
                        К сожалению, у вас нет доступа к этому курсу. Пожалуйста, приобретите курс, чтобы продолжить обучение.
                    </p>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => navigate('/account')}>
                            Мой кабинет
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/courses')}>
                            Каталог курсов
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-trading-dark flex flex-col text-white">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        className="mb-6 hover:bg-gray-800 text-gray-400 hover:text-white"
                        onClick={() => navigate('/account')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад в кабинет
                    </Button>

                    {/* Course Header */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl border border-blue-800/30">
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
                        <p className="text-gray-300 text-lg">{course.description}</p>
                        <div className="mt-4 flex items-center gap-2">
                            <Badge className="bg-green-600 hover:bg-green-700">Активный курс</Badge>
                            <Badge variant="outline" className="text-blue-400 border-blue-400">
                                {modules.length} модулей
                            </Badge>
                        </div>
                    </div>

                    {/* Modules List */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FileText className="h-6 w-6 text-blue-400" />
                            Программа курса
                        </h2>

                        {modules.length === 0 ? (
                            <Card className="bg-trading-card border-gray-800">
                                <CardContent className="p-8 text-center text-gray-400">
                                    <p>Материалы курса готовятся к публикации.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {modules.map((module) => (
                                    <AccordionItem
                                        key={module.id}
                                        value={module.id}
                                        className="bg-trading-card border border-gray-800 rounded-xl px-4 overflow-hidden"
                                    >
                                        <AccordionTrigger className="hover:no-underline py-4">
                                            <div className="flex items-center gap-4 text-left">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold text-sm flex-shrink-0">
                                                    {module.position}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-white text-lg">{module.title}</h3>
                                                    {module.description && (
                                                        <p className="text-sm text-gray-400 mt-1 line-clamp-1">{module.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </AccordionTrigger>

                                        <AccordionContent className="pt-2 pb-6 border-t border-gray-800/50 mt-2">
                                            <div className="space-y-4">
                                                {(module.title.toLowerCase().includes('session 1') || module.title.toLowerCase().includes('сессия 1')) ? (
                                                    <div className="p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30 text-center">
                                                        <h4 className="text-xl font-bold text-white mb-3">Интерактивный модуль: {module.title}</h4>
                                                        <p className="text-gray-300 mb-6">
                                                            Этот модуль содержит расширенные интерактивные материалы, видео и структуру для глубокого изучения.
                                                        </p>
                                                        <Button
                                                            onClick={() => navigate('/session-1', { state: { fromCourse: id } })}
                                                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold py-6 px-8 text-lg shadow-lg shadow-blue-900/50 transition-all hover:scale-105"
                                                        >
                                                            <Play className="mr-3 h-6 w-6 fill-current" />
                                                            Начать обучение
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                                                        <p className="text-gray-300 mb-4">{module.description}</p>

                                                        {/* Lesson Item / Video Trigger */}
                                                        <div className="flex items-center justify-between p-3 bg-trading-card rounded border border-gray-700 hover:border-blue-500/50 transition-colors group cursor-pointer"
                                                            onClick={() => handlePlayVideo(module)}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20">
                                                                    <Play className="h-4 w-4 text-blue-400 fill-blue-400" />
                                                                </div>
                                                                <span className="font-medium">Видео-урок</span>
                                                            </div>
                                                            <Button size="sm" variant="ghost" className="text-blue-400">
                                                                Смотреть
                                                            </Button>
                                                        </div>

                                                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                                            <CheckCircle className="h-3 w-3" />
                                                            <span>Доступно в рамках вашего пакета</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </div>
                </div>
            </main>

            <Footer />

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

export default CoursePage;
