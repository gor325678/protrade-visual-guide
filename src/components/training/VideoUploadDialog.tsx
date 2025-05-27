import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link, Youtube } from 'lucide-react';

interface TrainingVideo {
  id: string;
  title: string;
  type: 'local' | 'youtube' | 'googledrive';
  url: string;
  thumbnailUrl?: string;
}

interface VideoUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoAdded: (video: Omit<TrainingVideo, 'id'>) => void;
}

const VideoUploadDialog: React.FC<VideoUploadDialogProps> = ({ isOpen, onClose, onVideoAdded }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState('googledrive');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      return;
    }

    let videoType: 'local' | 'youtube' | 'googledrive' = 'googledrive';
    let processedUrl = url.trim();

    if (activeTab === 'youtube') {
      videoType = 'youtube';
      // Extract YouTube video ID from URL
      const youtubeMatch = processedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (youtubeMatch) {
        processedUrl = youtubeMatch[1];
      }
    } else if (activeTab === 'googledrive') {
      videoType = 'googledrive';
      // Keep the full Google Drive URL
    }

    onVideoAdded({
      title: title.trim(),
      type: videoType,
      url: processedUrl,
    });

    // Reset form
    setTitle('');
    setUrl('');
    setActiveTab('googledrive');
  };

  const handleClose = () => {
    setTitle('');
    setUrl('');
    setActiveTab('googledrive');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-trading-card border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить видео</DialogTitle>
          <DialogDescription>
            Добавьте видео для этой темы обучения
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="googledrive" className="data-[state=active]:bg-trading-dark">
              <Link className="h-4 w-4 mr-2" />
              Google Drive
            </TabsTrigger>
            <TabsTrigger value="youtube" className="data-[state=active]:bg-trading-dark">
              <Youtube className="h-4 w-4 mr-2" />
              YouTube
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="video-title">Название видео</Label>
              <Input
                id="video-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название видео"
                className="bg-trading-dark border-gray-700"
                required
              />
            </div>

            <TabsContent value="googledrive" className="space-y-4 mt-0">
              <div>
                <Label htmlFor="googledrive-url">Ссылка на Google Drive</Label>
                <Input
                  id="googledrive-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="bg-trading-dark border-gray-700"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Вставьте ссылку на видео из Google Drive (убедитесь, что доступ открыт для просмотра)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="youtube" className="space-y-4 mt-0">
              <div>
                <Label htmlFor="youtube-url">Ссылка на YouTube</Label>
                <Input
                  id="youtube-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="bg-trading-dark border-gray-700"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Вставьте ссылку на видео YouTube
                </p>
              </div>
            </TabsContent>

            <DialogFooter className="flex space-x-2">
              <Button variant="outline" type="button" onClick={handleClose}>
                Отмена
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Добавить видео
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadDialog;
