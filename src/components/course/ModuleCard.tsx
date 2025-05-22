
import React from 'react';
import { BookOpen, CheckCircle, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CourseModule } from '@/types/material';

interface ModuleCardProps {
  module: CourseModule;
  onEdit: (module: CourseModule) => void;
  onDelete: (id: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onEdit, onDelete }) => {
  return (
    <Card className="bg-trading-card border-gray-800 shadow-lg hover:shadow-blue-900/10 transition-shadow">
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
      <CardFooter className="flex justify-end space-x-2 pt-2">
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
