
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Youtube } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TrainingVideo {
  title: string;
  type: 'local' | 'youtube';
  url: string;
  thumbnailUrl?: string;
}

interface VideoUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoAdded: (video: TrainingVideo) => void;
}

const VideoUploadDialog: React.FC<VideoUploadDialogProps> = ({ isOpen, onClose, onVideoAdded }) => {
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('youtube');
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
      } else {
        toast({
          title: "Неверный формат файла",
          description: "Пожалуйста, выберите видео файл",
          variant: "destructive"
        });
      }
    }
  };

  const extractYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({
        title: "Заполните название",
        description: "Название видео обязательно для заполнения",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'youtube') {
      const videoId = extractYouTubeVideoId(youtubeUrl);
      if (!videoId) {
        toast({
          title: "Неверная ссылка YouTube",
          description: "Пожалуйста, введите правильную ссылку на YouTube видео",
          variant: "destructive"
        });
        return;
      }

      onVideoAdded({
        title: title.trim(),
        type: 'youtube',
        url: videoId,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      });
    } else {
      if (!selectedFile) {
        toast({
          title: "Выберите файл",
          description: "Пожалуйста, выберите видео файл для загрузки",
          variant: "destructive"
        });
        return;
      }

      // Создаем локальный URL для файла
      const localUrl = URL.createObjectURL(selectedFile);
      onVideoAdded({
        title: title.trim(),
        type: 'local',
        url: localUrl
      });
    }

    // Сброс формы
    setTitle('');
    setYoutubeUrl('');
    setSelectedFile(null);
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setYoutubeUrl('');
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-trading-card border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить видео</DialogTitle>
          <DialogDescription>
            Загрузите видео с компьютера или добавьте ссылку на YouTube
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="video-title">Название видео</Label>
            <Input
              id="video-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название видео"
              className="bg-trading-dark border-gray-700"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="youtube" className="data-[state=active]:bg-red-600">
                <Youtube className="mr-2 h-4 w-4" />
                YouTube
              </TabsTrigger>
              <TabsTrigger value="local" className="data-[state=active]:bg-blue-600">
                <Upload className="mr-2 h-4 w-4" />
                Загрузить
              </TabsTrigger>
            </TabsList>

            <TabsContent value="youtube" className="space-y-4">
              <div>
                <Label htmlFor="youtube-url">Ссылка на YouTube видео</Label>
                <Input
                  id="youtube-url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="bg-trading-dark border-gray-700"
                />
              </div>
            </TabsContent>

            <TabsContent value="local" className="space-y-4">
              <div>
                <Label htmlFor="video-file">Выберите видео файл</Label>
                <Input
                  id="video-file"
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="bg-trading-dark border-gray-700"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-400 mt-2">
                    Выбран файл: {selectedFile.name}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Добавить видео
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadDialog;
