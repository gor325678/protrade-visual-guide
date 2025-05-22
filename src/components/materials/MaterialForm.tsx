
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Material, MaterialType } from '@/types/material';

interface MaterialFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (material: Omit<Material, 'id' | 'dateAdded'>) => void;
  editingMaterial?: Material;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ 
  open, 
  onClose, 
  onSave,
  editingMaterial 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<MaterialType>('video');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (editingMaterial) {
      setTitle(editingMaterial.title);
      setDescription(editingMaterial.description);
      setType(editingMaterial.type);
      setUrl(editingMaterial.url || '');
    } else {
      resetForm();
    }
  }, [editingMaterial, open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('video');
    setUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      type,
      url: url.trim() !== '' ? url : undefined
    });
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-trading-dark text-white border-gray-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingMaterial ? 'Изменить материал' : 'Добавить новый материал'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-trading-card border-gray-700"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-trading-card border-gray-700"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Тип материала</Label>
              <Select value={type} onValueChange={(value) => setType(value as MaterialType)}>
                <SelectTrigger className="bg-trading-card border-gray-700">
                  <SelectValue placeholder="Выберите тип материала" />
                </SelectTrigger>
                <SelectContent className="bg-trading-dark border-gray-700">
                  <SelectItem value="video">Видео</SelectItem>
                  <SelectItem value="article">Статья</SelectItem>
                  <SelectItem value="course">Курс</SelectItem>
                  <SelectItem value="ebook">Электронная книга</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL (опционально)</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-trading-card border-gray-700"
                placeholder="https://example.com/material"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Отменить
            </Button>
            <Button type="submit" disabled={!title || !description}>
              {editingMaterial ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialForm;
