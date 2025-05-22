
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus } from 'lucide-react';
import { CourseModule } from '@/types/material';

interface ModuleFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (module: Omit<CourseModule, 'id'>) => void;
  editingModule?: CourseModule;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ 
  open, 
  onClose, 
  onSave,
  editingModule 
}) => {
  const [title, setTitle] = useState('');
  const [topics, setTopics] = useState<string[]>(['']);

  useEffect(() => {
    if (editingModule) {
      setTitle(editingModule.title);
      setTopics(editingModule.topics.length > 0 ? [...editingModule.topics] : ['']);
    } else {
      resetForm();
    }
  }, [editingModule, open]);

  const resetForm = () => {
    setTitle('');
    setTopics(['']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Фильтруем пустые темы
    const filteredTopics = topics.filter(topic => topic.trim() !== '');
    
    onSave({
      title,
      topics: filteredTopics
    });
    
    resetForm();
    onClose();
  };

  const handleAddTopic = () => {
    setTopics([...topics, '']);
  };

  const handleRemoveTopic = (index: number) => {
    const newTopics = [...topics];
    newTopics.splice(index, 1);
    setTopics(newTopics);
  };

  const handleChangeTopic = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-trading-dark text-white border-gray-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingModule ? 'Изменить модуль' : 'Добавить новый модуль'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название модуля</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-trading-card border-gray-700"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Темы модуля</Label>
              
              {topics.map((topic, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={topic}
                    onChange={(e) => handleChangeTopic(index, e.target.value)}
                    className="bg-trading-card border-gray-700 flex-1"
                    placeholder={`Тема ${index + 1}`}
                  />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleRemoveTopic(index)}
                    disabled={topics.length <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTopic}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить тему
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Отменить
            </Button>
            <Button type="submit" disabled={!title || topics.every(t => t.trim() === '')}>
              {editingModule ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleForm;
