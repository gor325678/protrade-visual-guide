import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Settings, Minimize } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ProtectionOverlay from '@/components/shared/ProtectionOverlay';
import { Slider } from '@/components/ui/slider';

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
  onClose?: () => void;
  autoPlay?: boolean;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isOpen, onClose, autoPlay = false, onEnded }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);

  // Playback rates requested by user: 1.2, 1.3, 1.4 etc.
  const playbackRates = [0.5, 0.75, 1, 1.1, 1.2, 1.25, 1.3, 1.4, 1.5, 1.75, 2];

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('contextmenu', handleContextMenu);
      return () => {
        container.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, []);

  // YouTube API integration
  useEffect(() => {
    if (video.type === 'youtube' && isOpen) {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      } else if (window.YT && window.YT.Player) {
        initPlayer();
      }

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying player", e);
        }
      }
    };
  }, [video.id, isOpen]);

  const initPlayer = () => {
    const videoId = getYouTubeVideoId(video.url);
    if (!videoId) return;

    // Destroy existing player if any
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {
        // Ignore
      }
    }

    playerRef.current = new window.YT.Player(`youtube-player-${video.id}`, {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: {
        'playsinline': 1,
        'controls': 0, // Hide default controls
        'disablekb': 1,
        'fs': 0,
        'rel': 0,
        'modestbranding': 1,
        'iv_load_policy': 3,
        'autoplay': autoPlay ? 1 : 0,
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  };

  const onPlayerReady = (event: any) => {
    setDuration(event.target.getDuration());
    if (autoPlay) {
      event.target.playVideo();
      setIsPlaying(true);
    }

    // Start progress interval
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();
        setCurrentTime(current);
        setProgress((current / total) * 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      if (onEnded) onEnded();
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : url;
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(rate);
      setPlaybackRate(rate);
    }
  };

  const handleSeek = (value: number[]) => {
    if (playerRef.current) {
      const newTime = (value[0] / 100) * duration;
      playerRef.current.seekTo(newTime, true);
      setProgress(value[0]);
      setCurrentTime(newTime);
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

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderYouTubePlayer = () => {
    return (
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group shadow-2xl border border-gray-800"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* The div where YouTube Iframe API will mount the iframe */}
        <div id={`youtube-player-${video.id}`} className="w-full h-full pointer-events-none" />

        {/* Custom Controls Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 flex flex-col justify-end ${showControls ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ pointerEvents: showControls ? 'auto' : 'none' }}
        >
          {/* Center Play Button (only visible when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={togglePlayPause}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-6 w-20 h-20 pointer-events-auto transition-transform hover:scale-110"
              >
                <Play size={40} fill="currentColor" className="ml-1" />
              </Button>
            </div>
          )}

          {/* Bottom Controls Bar */}
          <div className="p-4 space-y-2">
            {/* Progress Bar */}
            <div className="w-full flex items-center gap-2 group/slider">
              <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlayPause}
                  className="text-white hover:bg-white/20 hover:text-primary"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>

                <div className="flex items-center group/volume">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </Button>
                </div>

                <span className="text-white text-xs font-mono bg-black/40 px-2 py-1 rounded">
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
                      className="text-white hover:bg-white/20 text-xs font-medium min-w-[3rem]"
                    >
                      {playbackRate}x
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto bg-black/90 border-gray-800 text-white">
                    {playbackRates.map((rate) => (
                      <DropdownMenuItem
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={`cursor-pointer hover:bg-white/20 focus:bg-white/20 ${playbackRate === rate ? 'bg-primary/20 text-primary' : ''}`}
                      >
                        {rate}x
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Quality Control - Note: YouTube API doesn't reliably support setting quality anymore, but we keep the UI for completeness/future */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black/90 border-gray-800 text-white">
                    <DropdownMenuItem className="cursor-pointer hover:bg-white/20">Auto</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-white/20">1080p</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-white/20">720p</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-white/20">480p</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Fullscreen */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
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

  // For this specific task, we are focusing on the YouTube implementation
  // But keeping the structure for other types if needed
  const renderVideoContent = () => {
    if (video.type === 'youtube') {
      return renderYouTubePlayer();
    }
    return <div className="text-white p-4">Unsupported video type for this player</div>;
  };

  // If used as a standalone component (not in dialog)
  if (!isOpen) return null;

  // If we are in "embedded" mode (no dialog wrapper), just render the player
  if (onClose === undefined) { // Hacky check, but works for our new use case
    return renderVideoContent();
  }

  // Default Dialog wrapper behavior (legacy)
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-trading-card border-gray-800 text-white max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <div className="flex justify-between items-center pointer-events-auto">
              <DialogTitle className="text-lg font-bold text-white drop-shadow-md">{video.title}</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="relative bg-black">
            {renderVideoContent()}
          </div>
        </DialogContent>
      </Dialog>

      {isOpen && <ProtectionOverlay />}
    </>
  );
};

export default VideoPlayer;
