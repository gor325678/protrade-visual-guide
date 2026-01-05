
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BookOpen } from 'lucide-react';
import { getAllModules } from '@/services/courseService';
import { useLanguage } from '@/contexts/LanguageContext';
import StartTrainingButton from '@/components/shared/StartTrainingButton';

const CourseOverview = () => {
  const { t } = useLanguage();
  const modules = getAllModules();

  return (
    <div className="w-full py-12 px-4 no-select">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('home.course-structure')}</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            {t('home.course-description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Card key={module.id} className="bg-trading-card border-gray-800 shadow-lg hover:shadow-blue-900/10 transition-shadow animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>{module.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <ul className="space-y-3">
                  {module.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-trading-bull mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{topic}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}

        </div>

        <div className="mt-12 text-center">
          <StartTrainingButton />
        </div>
      </div>
    </div >
  );
};

export default CourseOverview;
