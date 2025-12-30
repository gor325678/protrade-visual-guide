
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ListVideo } from 'lucide-react';
import VideoPlayer from '@/components/training/VideoPlayer';
import { useLanguage } from '@/contexts/LanguageContext';
import { beginnerPlaylist } from '@/data/beginner-playlist';
import { PlaylistSidebar } from '@/components/training/PlaylistSidebar';
import { CurriculumGrid } from '@/components/training/CurriculumGrid';

const BeginnerTraining = () => {
  const { t } = useLanguage();
  const [currentVideoId, setCurrentVideoId] = useState<string>(beginnerPlaylist[0].id);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [autoPlay, setAutoPlay] = useState(false);

  // Load completed videos from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('beginner_training_completed');
    if (stored) {
      setCompletedVideos(JSON.parse(stored));
    }
  }, []);

  const handleVideoSelect = (id: string) => {
    setCurrentVideoId(id);
    setAutoPlay(true);
  };

  const handleVideoEnded = () => {
    if (!completedVideos.includes(currentVideoId)) {
      const newCompleted = [...completedVideos, currentVideoId];
      setCompletedVideos(newCompleted);
      localStorage.setItem('beginner_training_completed', JSON.stringify(newCompleted));
    }

    // Auto-play next video
    const currentIndex = beginnerPlaylist.findIndex(v => v.id === currentVideoId);
    if (currentIndex < beginnerPlaylist.length - 1) {
      setCurrentVideoId(beginnerPlaylist[currentIndex + 1].id);
      setAutoPlay(true);
    }
  };

  const currentVideo = beginnerPlaylist.find(v => v.id === currentVideoId) || beginnerPlaylist[0];

  const playerVideoData = {
    id: currentVideo.id,
    title: currentVideo.title,
    type: 'youtube' as const,
    url: `https://www.youtube.com/watch?v=${currentVideo.id}`,
    thumbnailUrl: currentVideo.thumbnailUrl
  };

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{t('beginner.title')}</h1>
          <p className="text-gray-400">{t('beginner.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="w-full">
              <VideoPlayer
                video={playerVideoData}
                isOpen={true}
                autoPlay={autoPlay}
                onEnded={handleVideoEnded}
              />
            </div>

            <div className="bg-trading-card p-6 rounded-lg border border-gray-800">
              <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <ListVideo size={16} />
                  {beginnerPlaylist.findIndex(v => v.id === currentVideoId) + 1} / {beginnerPlaylist.length}
                </span>
              </div>
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="lg:col-span-1">
            <PlaylistSidebar
              playlist={beginnerPlaylist}
              currentVideoId={currentVideoId}
              completedVideos={completedVideos}
              title={t('beginner.playlist-title') || 'Программа обучения'}
              onVideoSelect={handleVideoSelect}
            />
          </div>
        </div>

        {/* Course Curriculum Section */}
        <CurriculumGrid
          playlist={beginnerPlaylist}
          currentVideoId={currentVideoId}
          completedVideos={completedVideos}
          onVideoSelect={handleVideoSelect}
        />
      </main>

      <Footer />
    </div>
  );
};

export default BeginnerTraining;

