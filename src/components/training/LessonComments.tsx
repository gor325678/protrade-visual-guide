import React, { useState, useEffect } from 'react';
import { Send, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

interface Comment {
    id: string;
    user_id: string;
    user_name: string;
    user_avatar?: string;
    content: string;
    created_at: string;
}

interface LessonCommentsProps {
    lessonId: string;
    userId?: string;
    userName?: string;
}

export const LessonComments: React.FC<LessonCommentsProps> = ({
    lessonId,
    userId,
    userName
}) => {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [lessonId]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            // Mock comments for now (would be from Supabase in production)
            const mockComments: Comment[] = [
                {
                    id: '1',
                    user_id: 'user1',
                    user_name: 'Александр К.',
                    user_avatar: '🐂',
                    content: 'Отличный урок! Наконец-то понял как работают индикаторы.',
                    created_at: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: '2',
                    user_id: 'user2',
                    user_name: 'Мария В.',
                    user_avatar: '📈',
                    content: 'Можно подробнее про настройки периода?',
                    created_at: new Date(Date.now() - 3600000).toISOString()
                }
            ];
            setComments(mockComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !userId) return;

        setSubmitting(true);
        try {
            // In production, this would insert into Supabase
            const newCommentData: Comment = {
                id: Date.now().toString(),
                user_id: userId,
                user_name: userName || 'Пользователь',
                content: newComment.trim(),
                created_at: new Date().toISOString()
            };

            setComments(prev => [newCommentData, ...prev]);
            setNewComment('');
            toast({
                title: t('comments.posted'),
                description: t('comments.posted_desc')
            });
        } catch (error) {
            console.error('Error posting comment:', error);
            toast({
                title: t('comments.error'),
                description: t('comments.error_desc'),
                variant: 'destructive'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffHours < 1) return t('comments.just_now');
        if (diffHours < 24) return `${diffHours} ${t('comments.hours_ago')}`;
        if (diffHours < 48) return t('comments.yesterday');

        return date.toLocaleDateString(
            language === 'uk' ? 'uk-UA' : 'ru-RU',
            { day: 'numeric', month: 'short' }
        );
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                💬 {t('comments.title')}
                <span className="text-sm font-normal text-gray-400">
                    ({comments.length})
                </span>
            </h3>

            {/* Comment Form */}
            {userId ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={t('comments.placeholder')}
                        className="bg-gray-900 border-gray-700 min-h-[80px] resize-none"
                    />
                    <Button
                        type="submit"
                        disabled={!newComment.trim() || submitting}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {submitting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                {t('comments.send')}
                            </>
                        )}
                    </Button>
                </form>
            ) : (
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
                    <p className="text-gray-400">{t('comments.login_required')}</p>
                </div>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    <p>{t('comments.no_comments')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-gray-900/50 border border-gray-800 rounded-lg p-4"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">
                                    {comment.user_avatar || '👤'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-white">
                                            {comment.user_name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(comment.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LessonComments;
