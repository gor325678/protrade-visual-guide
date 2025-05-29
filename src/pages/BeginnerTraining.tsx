import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BookOpen, CheckCircle, Plus, FileEdit, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import VideoUploadDialog from '@/components/training/VideoUploadDialog';
import VideoPlayer from '@/components/training/VideoPlayer';
import { useLanguage } from '@/contexts/LanguageContext';

interface TrainingVideo {
  id: string;
  title: string;
  type: 'local' | 'youtube' | 'googledrive';
  url: string;
  thumbnailUrl?: string;
}

interface TrainingTopic {
  id: string;
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videos?: TrainingVideo[];
}

const BeginnerTraining = () => {
  const { t } = useLanguage();
  const [topics, setTopics] = useState<TrainingTopic[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<TrainingTopic | null>(null);
  const [selectedTopicForVideo, setSelectedTopicForVideo] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<TrainingVideo | null>(null);
  const { toast } = useToast();

  // Load topics from localStorage on component mount
  useEffect(() => {
    const storedTopics = localStorage.getItem('beginner_training_topics');
    if (storedTopics) {
      setTopics(JSON.parse(storedTopics));
    } else {
      // Initial demo topics
      const initialTopics: TrainingTopic[] = [
        {
          id: '1',
          title: 'Что такое Форекс?',
          content: 'Форекс (Forex, FX, от англ. FOReign EXchange — «зарубежный обмен») — рынок межбанковского обмена валюты по свободным ценам. Термин Форекс принято использовать для обозначения взаимного обмена валюты, а не всей совокупности валютных операций.',
          difficulty: 'beginner'
        },
        {
          id: '2',
          title: 'Основные валютные пары',
          content: 'Основные валютные пары на рынке Форекс включают: EUR/USD (евро/доллар США), USD/JPY (доллар США/японская иена), GBP/USD (британский фунт/доллар США), USD/CHF (доллар США/швейцарский франк), AUD/USD (австралийский доллар/доллар США) и USD/CAD (доллар США/канадский доллар).',
          difficulty: 'beginner'
        },
        {
          id: '3',
          title: 'Типы графиков',
          content: 'Существует несколько типов графиков для анализа движения цены: линейный график, график баров, японские свечи и график Рenko. Каждый тип имеет свои преимущества и особенности отображения ценовой информации.',
          difficulty: 'beginner'
        }
      ];
      setTopics(initialTopics);
      localStorage.setItem('beginner_training_topics', JSON.stringify(initialTopics));
    }
  }, []);

  // Save topics to localStorage whenever they change
  useEffect(() => {
    if (topics.length > 0) {
      localStorage.setItem('beginner_training_topics', JSON.stringify(topics));
    }
  }, [topics]);

  const handleAddTopic = () => {
    setCurrentTopic(null);
    setIsDialogOpen(true);
  };

  const handleEditTopic = (topic: TrainingTopic) => {
    setCurrentTopic(topic);
    setIsDialogOpen(true);
  };

  const handleAddVideo = (topicId: string) => {
    setSelectedTopicForVideo(topicId);
    setIsVideoDialogOpen(true);
  };

  const handleVideoAdded = (video: Omit<TrainingVideo, 'id'>) => {
    if (!selectedTopicForVideo) return;
    
    const newVideo: TrainingVideo = {
      ...video,
      id: Date.now().toString()
    };
    
    const updatedTopics = topics.map(topic => 
      topic.id === selectedTopicForVideo 
        ? { ...topic, videos: [...(topic.videos || []), newVideo] }
        : topic
    );
    
    setTopics(updatedTopics);
    setIsVideoDialogOpen(false);
    setSelectedTopicForVideo(null);
    
    toast({
      title: t('beginner.video-added'),
      description: t('beginner.video-added-desc')
    });
  };

  const handlePlayVideo = (video: TrainingVideo) => {
    setPlayingVideo(video);
  };

  const handleSaveTopic = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value;
    const difficulty = (form.elements.namedItem('difficulty') as HTMLSelectElement).value as 'beginner' | 'intermediate' | 'advanced';

    if (currentTopic) {
      // Update existing topic
      const updatedTopics = topics.map(topic => 
        topic.id === currentTopic.id ? { ...topic, title, content, difficulty } : topic
      );
      setTopics(updatedTopics);
      toast({
        title: t('beginner.topic-updated'),
        description: t('beginner.topic-updated-desc')
      });
    } else {
      // Add new topic
      const newTopic: TrainingTopic = {
        id: Date.now().toString(),
        title,
        content,
        difficulty
      };
      setTopics([...topics, newTopic]);
      toast({
        title: t('beginner.topic-added'),
        description: t('beginner.topic-added-desc')
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteTopic = (id: string) => {
    const updatedTopics = topics.filter(topic => topic.id !== id);
    setTopics(updatedTopics);
    localStorage.setItem('beginner_training_topics', JSON.stringify(updatedTopics));
    toast({
      title: t('beginner.topic-deleted'),
      description: t('beginner.topic-deleted-desc')
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'Начинающий';
      case 'intermediate': return 'Средний';
      case 'advanced': return 'Продвинутый';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('beginner.title')}</h1>
            <p className="text-gray-400">{t('beginner.subtitle')}</p>
          </div>
          <Button onClick={handleAddTopic} className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> {t('beginner.add-topic')}
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Card key={topic.id} className="bg-trading-card border-gray-800 shadow-lg hover:shadow-blue-900/10 transition-shadow overflow-hidden">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>{topic.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <p className="text-gray-300 line-clamp-4 mb-4">{topic.content}</p>
                
                {topic.videos && topic.videos.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400">{t('beginner.video-materials')}</h4>
                    {topic.videos.map((video) => (
                      <div key={video.id} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                        <Video className="h-4 w-4 text-blue-400" />
                        <div className="flex-1">
                          <span className="text-sm text-gray-300 block">{video.title}</span>
                          <span className="text-xs text-gray-500">
                            {video.type === 'googledrive' ? 'Google Drive' : 
                             video.type === 'youtube' ? 'YouTube' : 'Локальное'}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handlePlayVideo(video)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {t('beginner.watch')}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddVideo(topic.id)}
                  className="flex-1"
                >
                  <Video className="h-4 w-4 mr-1" />
                  {t('beginner.add-video')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditTopic(topic)}
                >
                  <FileEdit className="h-4 w-4 mr-1" />
                  {t('beginner.edit')}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteTopic(topic.id)}
                >
                  {t('beginner.delete')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {topics.length === 0 && (
          <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400">{t('beginner.no-topics')}</p>
            <Button className="mt-4" onClick={handleAddTopic}>
              <Plus className="mr-2 h-4 w-4" /> {t('beginner.add-topic')}
            </Button>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-trading-card border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>{currentTopic ? t('beginner.edit-topic') : t('beginner.add-new-topic')}</DialogTitle>
              <DialogDescription>
                {currentTopic 
                  ? t('beginner.edit-description')
                  : t('beginner.add-description')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveTopic} className="space-y-4">
              <div>
                <Label htmlFor="title">{t('beginner.topic-title')}</Label>
                <Input 
                  id="title" 
                  name="title" 
                  defaultValue={currentTopic?.title || ""} 
                  required 
                  className="bg-trading-dark border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="content">{t('beginner.content')}</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  defaultValue={currentTopic?.content || ""} 
                  required
                  rows={6}
                  className="bg-trading-dark border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="difficulty">{t('beginner.difficulty')}</Label>
                <select 
                  id="difficulty" 
                  name="difficulty" 
                  defaultValue={currentTopic?.difficulty || "beginner"}
                  className="w-full rounded-md p-2 bg-trading-dark border border-gray-700"
                >
                  <option value="beginner">{t('beginner.difficulty.beginner')}</option>
                  <option value="intermediate">{t('beginner.difficulty.intermediate')}</option>
                  <option value="advanced">{t('beginner.difficulty.advanced')}</option>
                </select>
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  {t('beginner.cancel')}
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {currentTopic ? t('beginner.save-changes') : t('beginner.add-topic-btn')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <VideoUploadDialog
          isOpen={isVideoDialogOpen}
          onClose={() => setIsVideoDialogOpen(false)}
          onVideoAdded={handleVideoAdded}
        />

        {playingVideo && (
          <VideoPlayer
            video={playingVideo}
            isOpen={!!playingVideo}
            onClose={() => setPlayingVideo(null)}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default BeginnerTraining;
