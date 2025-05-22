
import React from 'react';
import { BookOpen, Video, FileText, BookPlus, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Material } from '@/types/material';

interface MaterialCardProps {
  material: Material;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onEdit, onDelete }) => {
  const getIcon = () => {
    switch (material.type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'course':
        return <BookOpen className="h-5 w-5" />;
      case 'ebook':
        return <BookPlus className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <Card className="bg-trading-card border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <CardTitle className="text-lg">{material.title}</CardTitle>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(material.dateAdded).toLocaleDateString()}
          </span>
        </div>
        <CardDescription className="text-gray-400">{material.type.charAt(0).toUpperCase() + material.type.slice(1)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-300">{material.description}</p>
        {material.url && (
          <a 
            href={material.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline mt-2 inline-block"
          >
            Открыть материал
          </a>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(material)}>
          <Edit className="h-4 w-4 mr-1" />
          Изменить
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(material.id)}>
          <Trash2 className="h-4 w-4 mr-1" />
          Удалить
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MaterialCard;
