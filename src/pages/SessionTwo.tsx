
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { session2Content } from '@/data/session2';
import { ChevronRight, ArrowUp, Menu, ArrowLeft } from 'lucide-react';

const SessionTwo = () => {
    const [activeSection, setActiveSection] = useState(session2Content[0].id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const fromCourseId = location.state?.fromCourse;

    // Handle scroll spy
    useEffect(() => {
        const handleScroll = () => {
            const sections = session2Content.map(s => document.getElementById(s.id));
            const scrollPosition = window.scrollY + 150; // Offset

            for (const section of sections) {
                if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
                    setActiveSection(section.id);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveSection(id);
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-trading-dark flex flex-col text-white font-sans selection:bg-purple-500/30">
            <Header />

            <div className="flex-grow container mx-auto px-4 py-8 relative">

                {fromCourseId && (
                    <Button
                        variant="ghost"
                        className="mb-4 pl-0 hover:text-purple-400 text-gray-400"
                        onClick={() => navigate(`/course/${fromCourseId}`)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад к курсу
                    </Button>
                )}

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden mb-6 sticky top-20 z-30 bg-trading-dark/95 backdrop-blur py-2 border-b border-gray-800">
                    <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full justify-between">
                        <span className="flex items-center gap-2">
                            <Menu className="h-4 w-4" />
                            Навигация по сессии
                        </span>
                        <Badge variant="secondary" className="bg-purple-900/50">{activeSection}</Badge>
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar / Navigation */}
                    <aside className={`
                        fixed inset-0 z-40 bg-trading-dark/95 backdrop-blur-md lg:bg-transparent lg:static lg:block lg:w-64 lg:flex-shrink-0 transition-transform duration-300
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}>
                        <div className="lg:sticky lg:top-24 h-full lg:h-[calc(100vh-8rem)] flex flex-col p-4 lg:p-0">
                            <div className="flex justify-between items-center lg:hidden mb-6">
                                <h2 className="text-xl font-bold">Содержание</h2>
                                <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>✕</Button>
                            </div>

                            <Card className="bg-trading-card/50 border-gray-800 backdrop-blur shadow-lg overflow-hidden h-full">
                                <ScrollArea className="h-full py-4 pr-4">
                                    <nav className="flex flex-col space-y-1 pl-4">
                                        {session2Content.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => scrollToSection(item.id)}
                                                className={`
                                                    text-left px-4 py-3 rounded-l-lg border-l-2 transition-all duration-200 text-sm font-medium flex items-center gap-3
                                                    ${activeSection === item.id
                                                        ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                                                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                                                    }
                                                `}
                                            >
                                                <item.icon className={`h-4 w-4 ${activeSection === item.id ? 'text-purple-400' : 'text-gray-500'}`} />
                                                <span className="truncate">{item.title}</span>
                                            </button>
                                        ))}
                                    </nav>
                                </ScrollArea>
                            </Card>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="mb-8">
                            <Badge className="bg-purple-600 mb-2 hover:bg-purple-700">ETF Course</Badge>
                            <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4">
                                Сессия 2: Углубленный ProTrader
                            </h1>
                            <p className="text-xl text-gray-400">
                                Идентификация тренда, ценовые режимы и техники выхода. Практическое применение.
                            </p>
                        </div>

                        <div className="space-y-12">
                            {session2Content.map((section, index) => (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-28 animate-in fade-in slide-in-from-bottom-4 duration-700"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-900/20">
                                            <section.icon className="h-6 w-6 text-purple-400" />
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-100">
                                            {section.title}
                                        </h2>
                                    </div>

                                    <Card className="bg-trading-card border-gray-800 shadow-xl overflow-hidden hover:border-gray-700 transition-all duration-300 group">
                                        {/* Decorative glow */}
                                        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>

                                        <CardContent className="p-6 md:p-8 text-gray-300 leading-relaxed text-lg relative z-10 typography-protrade">
                                            <div dangerouslySetInnerHTML={{ __html: section.content }} />
                                        </CardContent>
                                    </Card>
                                </section>
                            ))}
                        </div>

                        {/* Navigation Footer */}
                        <div className="mt-16 flex justify-between items-center pt-8 border-t border-gray-800">
                            <div className="text-gray-400 text-sm">
                                Просмотрено {session2Content.length} из {session2Content.length} разделов
                            </div>
                            <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} variant="outline" className="gap-2">
                                <ArrowUp className="h-4 w-4" />
                                Наверх
                            </Button>
                        </div>
                    </main>
                </div>
            </div>

            <Footer />

            <style>{`
                .typography-protrade strong {
                    color: white;
                    font-weight: 600;
                }
                .typography-protrade ul {
                    list-style-type: none;
                    padding-left: 0;
                }
                .typography-protrade p {
                    margin-bottom: 1rem;
                }
                .typography-protrade p:last-child {
                    margin-bottom: 0;
                }
            `}</style>
        </div>
    );
};

export default SessionTwo;
