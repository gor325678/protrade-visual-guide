
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListVideo, Play, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Video {
    id: string;
    title: string;
}

interface PlaylistSidebarProps {
    playlist: Video[];
    currentVideoId: string;
    completedVideos: string[];
    title: string;
    onVideoSelect: (id: string) => void;
}

export const PlaylistSidebar: React.FC<PlaylistSidebarProps> = ({
    playlist,
    currentVideoId,
    completedVideos,
    title,
    onVideoSelect,
}) => {
    const { t } = useLanguage();

    return (
        <Card className="bg-trading-card border-gray-800 h-full max-h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-800">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <ListVideo className="text-primary" />
                    {title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                    {completedVideos.length} {t('training.from')} {playlist.length} {t('training.completed')}
                </p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                    {playlist.map((video, index) => {
                        const isActive = video.id === currentVideoId;
                        const isCompleted = completedVideos.includes(video.id);

                        return (
                            <button
                                key={video.id}
                                onClick={() => onVideoSelect(video.id)}
                                className={`w-full text-left p-3 rounded-md transition-all flex items-start gap-3 group ${isActive
                                    ? 'bg-primary/10 border border-primary/20'
                                    : 'hover:bg-gray-800 border border-transparent'
                                    }`}
                            >
                                <div className="mt-1">
                                    {isActive ? (
                                        <Play size={16} className="text-primary fill-primary animate-pulse" />
                                    ) : isCompleted ? (
                                        <CheckCircle size={16} className="text-green-500" />
                                    ) : (
                                        <span className="text-xs font-mono text-gray-500 w-4 inline-block text-center">{index + 1}</span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h4 className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-primary' : 'text-gray-300 group-hover:text-white'}`}>
                                        {video.title}
                                    </h4>
                                    <span className="text-xs text-gray-500 mt-1 block">
                                        {t('training.lesson')} {index + 1}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </ScrollArea>
        </Card>
    );
};
