
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import ProtectionOverlay from '@/components/shared/ProtectionOverlay';

interface TrainingVideo {
  id: string;
  title: string;
  type: 'local' | 'youtube';
  url: string;
  thumbnailUrl?: string;
}

interface VideoPlayerProps {
  video: TrainingVideo;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('contextmenu', handleContextMenu);
      
      // Отключаем возможность скачивания
      videoElement.controlsList.add('nodownload');
      
      return () => {
        videoElement.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, [video]);

  const renderVideoContent = () => {
    if (video.type === 'youtube') {
      return (
        <div className="relative w-full h-96">
          <iframe
            src={`https://www.youtube.com/embed/${video.url}?rel=0&modestbranding=1&controls=1&showinfo=0`}
            title={video.title}
            className="w-full h-full rounded"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ pointerEvents: 'auto' }}
          />
        </div>
      );
    } else {
      return (
        <div className="relative w-full h-96">
          <video
            ref={videoRef}
            src={video.url}
            controls
            controlsList="nodownload nofullscreen"
            className="w-full h-full rounded bg-black"
            onContextMenu={(e) => e.preventDefault()}
            style={{ pointerEvents: 'auto' }}
          >
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
        </div>
      );
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-trading-card border-gray-800 text-white max-w-4xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold">{video.title}</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="relative">
            {renderVideoContent()}
            
            {/* Защитный оверлей для предотвращения скачивания */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                🔒 Защищенный просмотр
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-400">
            <p>Это видео защищено от скачивания и предназначено только для просмотра на сайте.</p>
          </div>
        </DialogContent>
      </Dialog>
      
      {isOpen && <ProtectionOverlay />}
    </>
  );
};

export default VideoPlayer;
