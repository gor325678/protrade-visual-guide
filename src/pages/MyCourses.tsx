
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BookOpen, Play, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  totalTests: number;
  status: 'В процессе' | 'Завершен' | 'Не начат';
  image?: string;
  blocks: number;
}

const MyCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Инициализируем курсы
    const initialCourses: Course[] = [
      {
        id: '1',
        title: 'Big trading course',
        description: 'Крупнейший бесплатный курс по трейдингу от практикующих трейдеров. За 8 модулей ты получишь системные знания, разберешься в рынках и поймешь, какой стиль торговли подходит именно тебе.',
        progress: 22,
        totalLessons: 37,
        completedLessons: 8,
        totalTests: 8,
        status: 'В процессе',
        blocks: 8
      }
    ];
    setCourses(initialCourses);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'В процессе': return 'bg-blue-100 text-blue-800';
      case 'Завершен': return 'bg-green-100 text-green-800';
      case 'Не начат': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <span>🏠</span>
          <span>Мои курсы</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Мои курсы</h1>
        
        <div className="grid gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="bg-trading-card border-gray-800 shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Course Image */}
                  <div className="flex-shrink-0">
                    <div className="w-48 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"></div>
                      <div className="text-white font-bold text-2xl z-10">BIG</div>
                      <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                        TRADING COURSE
                      </div>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                        <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {course.totalLessons} Уроков
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            {course.totalTests} Тестов
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(course.status)} border-0`}>
                          {course.blocks} блока
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 border-0">
                          {course.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Progress Section */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Прогресс Курса:</span>
                        <span className="text-sm font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>

                    {/* Continue Button */}
                    <div className="flex justify-end">
                      <Button className="bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                        Продолжить курс
                        <span className="ml-1">→</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">У вас пока нет активных курсов</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Найти курсы
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MyCourses;
