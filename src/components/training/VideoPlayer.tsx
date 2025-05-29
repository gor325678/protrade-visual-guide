
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ProtectionOverlay from '@/components/shared/ProtectionOverlay';

// Extend Window interface to include YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('720p');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

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

  // YouTube API integration
  useEffect(() => {
    if (video.type === 'youtube' && isOpen) {
      // Load YouTube IFrame API
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    }
  }, [video.type, isOpen]);

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : url;
  };

  const getGoogleDriveEmbedUrl = (url: string) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

  const togglePlayPause = () => {
    const iframe = iframeRef.current;
    if (iframe && video.type === 'youtube') {
      iframe.contentWindow?.postMessage(
        `{"event":"command","func":"${isPlaying ? 'pauseVideo' : 'playVideo'}","args":""}`,
        '*'
      );
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const iframe = iframeRef.current;
    if (iframe && video.type === 'youtube') {
      iframe.contentWindow?.postMessage(
        `{"event":"command","func":"${isMuted ? 'unMute' : 'mute'}","args":""}`,
        '*'
      );
      setIsMuted(!isMuted);
    }
  };

  const changePlaybackRate = (rate: number) => {
    const iframe = iframeRef.current;
    if (iframe && video.type === 'youtube') {
      iframe.contentWindow?.postMessage(
        `{"event":"command","func":"setPlaybackRate","args":"${rate}"}`,
        '*'
      );
      setPlaybackRate(rate);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderYouTubePlayer = () => {
    const videoId = getYouTubeVideoId(video.url);
    
    return (
      <div 
        ref={containerRef}
        className="relative w-full h-96 bg-black rounded overflow-hidden group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&disablekb=1&fs=0`}
          title={video.title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ pointerEvents: 'none' }}
          onContextMenu={(e) => e.preventDefault()}
        />
        
        {/* Custom Controls Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ pointerEvents: showControls ? 'auto' : 'none' }}
        >
          {/* Center Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={togglePlayPause}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </Button>
          </div>
          
          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
                
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Speed Control */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      {playbackRate}x
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => changePlaybackRate(0.5)}>
                      0.5x
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changePlaybackRate(0.75)}>
                      0.75x
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changePlaybackRate(1)}>
                      1x
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changePlaybackRate(1.25)}>
                      1.25x
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changePlaybackRate(1.5)}>
                      1.5x
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changePlaybackRate(2)}>
                      2x
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Quality Control */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setQuality('480p')}>
                      480p
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setQuality('720p')}>
                      720p
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setQuality('1080p')}>
                      1080p
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Fullscreen */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Protection overlay */}
        <div 
          className="absolute inset-0 pointer-events-none bg-transparent"
          onContextMenu={(e) => e.preventDefault()}
          style={{ userSelect: 'none' }}
        />
      </div>
    );
  };

  const renderVideoContent = () => {
    if (video.type === 'youtube') {
      return renderYouTubePlayer();
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
          </div>
        </DialogContent>
      </Dialog>
      
      {isOpen && <ProtectionOverlay />}
    </>
  );
};

export default VideoPlayer;
