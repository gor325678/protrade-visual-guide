
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle } from 'lucide-react';
import ProtectionOverlay from '@/components/shared/ProtectionOverlay';

interface TrainingVideo {
  id: string;
  title: string;
  type: 'local' | 'youtube' | 'googledrive';
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
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('contextmenu', handleContextMenu);
      
      return () => {
        videoElement.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, [video]);

  // Track window focus and tab switching
  useEffect(() => {
    if (!isOpen) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab became hidden - pause video if it's local
        if (video.type === 'local' && videoRef.current) {
          videoRef.current.pause();
        }
        setShowWarning(true);
        
        // Hide warning after 3 seconds when user returns
        setTimeout(() => {
          if (!document.hidden) {
            setShowWarning(false);
          }
        }, 3000);
      } else {
        // Tab became visible again
        setTimeout(() => setShowWarning(false), 500);
      }
    };

    const handleWindowBlur = () => {
      // Window lost focus
      if (video.type === 'local' && videoRef.current) {
        videoRef.current.pause();
      }
      setShowWarning(true);
    };

    const handleWindowFocus = () => {
      // Window gained focus
      setTimeout(() => setShowWarning(false), 500);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [isOpen, video.type]);

  const getGoogleDriveEmbedUrl = (url: string) => {
    // Convert Google Drive share link to embed URL
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

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
    } else if (video.type === 'googledrive') {
      return (
        <div className="relative w-full h-96 overflow-hidden">
          <iframe
            src={getGoogleDriveEmbedUrl(video.url)}
            title={video.title}
            className="w-full h-full rounded"
            frameBorder="0"
            allow="autoplay"
            style={{ pointerEvents: 'auto' }}
            onContextMenu={(e) => e.preventDefault()}
          />
          {/* Overlay to hide the "open in new window" icon */}
          <div className="absolute top-0 right-0 w-12 h-12 bg-gray-900 pointer-events-none z-10"></div>
          {/* Additional protection overlay for Google Drive videos */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'transparent' }}
            onContextMenu={(e) => e.preventDefault()}
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
            
            {/* Warning overlay when user switches tabs */}
            {showWarning && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 rounded">
                <div className="bg-red-600 border border-red-500 px-6 py-4 rounded-lg text-center">
                  <AlertTriangle className="h-8 w-8 text-white mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-white mb-1">Внимание!</h3>
                  <p className="text-white text-sm">
                    Обнаружен переход на другую вкладку.<br />
                    Видео приостановлено для защиты контента.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {isOpen && <ProtectionOverlay />}
    </>
  );
};

export default VideoPlayer;
