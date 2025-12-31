
import React from 'react';
import { BookOpen, CheckCircle, Trash2, Edit, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CourseModule } from '@/types/material';

interface ModuleCardProps {
  module: CourseModule;
  onEdit: (module: CourseModule) => void;
  onDelete: (id: string) => void;
  onViewHistory?: (module: CourseModule) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onEdit, onDelete, onViewHistory }) => {
  const hasHistory = module.history && module.history.length > 0;
  const isForexBasics = module.id === '1' || module.title === "Основы торговли на Форекс";

  return (
    <Card className="bg-trading-card border-gray-800 shadow-lg hover:shadow-blue-900/10 transition-shadow">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>{module.title}</span>
          {isForexBasics && (
            <Badge variant="outline" className="ml-2 text-xs bg-blue-900/20 text-blue-400">
              Отслеживаются изменения
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <ul className="space-y-3">
          {module.topics.map((topic, topicIndex) => {
            const separatorIndex = topic.indexOf(':');
            let title = topic;
            let description = '';

            if (separatorIndex !== -1) {
              title = topic.substring(0, separatorIndex + 1);
              description = topic.substring(separatorIndex + 1);
            }

            return (
              <li key={topicIndex} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-trading-bull mr-2 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">
                  {separatorIndex !== -1 ? (
                    <>
                      <strong className="text-white block mb-1">{title}</strong>
                      <span className="text-gray-400">{description}</span>
                    </>
                  ) : (
                    topic
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-2">
        {isForexBasics && hasHistory && onViewHistory && (
          <Button variant="outline" size="sm" onClick={() => onViewHistory(module)}>
            <History className="h-4 w-4 mr-1" />
            История изменений
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => onEdit(module)}>
          <Edit className="h-4 w-4 mr-1" />
          Изменить
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(module.id)}>
          <Trash2 className="h-4 w-4 mr-1" />
          Удалить
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModuleCard;
