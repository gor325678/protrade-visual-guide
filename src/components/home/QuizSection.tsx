import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const QuizSection = () => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [showEmailGate, setShowEmailGate] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailSubmitted, setEmailSubmitted] = useState(false);

    // Define correct answers index (0-3) for 12 questions
    const correctAnswers = [1, 2, 0, 0, 2, 1, 1, 1, 2, 0, 1, 1];
    const totalQuestions = 12;

    const handleAnswerClick = (index: number) => {
        if (isAnswerChecked) return;

        setSelectedAnswer(index);
        setIsAnswerChecked(true);

        if (index === correctAnswers[currentQuestion]) {
            setScore(score + 1);
        }

        // Auto advance after short delay
        setTimeout(() => {
            if (currentQuestion < totalQuestions - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
                setIsAnswerChecked(false);
            } else {
                // Show email gate before results
                setShowEmailGate(true);
            }
        }, 1500);
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            toast({
                title: "Ошибка",
                description: "Введите корректный email",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Get referral code from URL if exists
            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get('ref');

            // Determine segment based on score
            let segment = 'beginner';
            const percentage = (score / totalQuestions) * 100;
            if (percentage >= 70) segment = 'advanced';
            else if (percentage >= 40) segment = 'intermediate';

            // Save to Supabase leads table
            const { error } = await supabase
                .from('quiz_leads')
                .insert({
                    email: email,
                    quiz_score: score,
                    quiz_percentage: percentage,
                    segment: segment,
                    referral_code: refCode || null,
                    source: 'quiz',
                    created_at: new Date().toISOString()
                });

            if (error) {
                console.error('Supabase error:', error);
                // Continue even if save fails - don't block user experience
            }

            // Trigger n8n webhook for Brevo integration
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

                await fetch('https://n8n.protradersystems.com/webhook/quiz-lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        score,
                        percentage,
                        segment,
                        refCode,
                        timestamp: new Date().toISOString()
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
            } catch (webhookError) {
                console.log('Webhook notification skipped', webhookError);
            }

            setEmailSubmitted(true);

            toast({
                title: "Отлично! 🎉",
                description: "Результаты отправлены на ваш email"
            });

            // Show results after short delay
            setTimeout(() => {
                setShowEmailGate(false);
                setShowResult(true);
            }, 1500);

        } catch (error) {
            console.error('Error:', error);
            // Still show results even if email save fails
            setShowEmailGate(false);
            setShowResult(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const skipEmailAndShowResults = () => {
        setShowEmailGate(false);
        setShowResult(true);
    };

    const restartQuiz = () => {
        setScore(0);
        setCurrentQuestion(0);
        setShowResult(false);
        setShowEmailGate(false);
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
        setEmail('');
        setEmailSubmitted(false);
    };

    const getResultMessage = () => {
        const percentage = (score / totalQuestions) * 100;
        if (percentage === 100) return t('quiz.result.perfect');
        if (percentage >= 70) return t('quiz.result.good');
        if (percentage >= 40) return t('quiz.result.average');
        return t('quiz.result.poor');
    };

    const getRecommendation = () => {
        const percentage = (score / totalQuestions) * 100;
        if (percentage >= 70) {
            return {
                title: "Вы готовы к системному трейдингу!",
                text: "С вашим уровнем знаний курс Pro Trader Systems поможет выйти на стабильный результат.",
                cta: "Записаться на курс",
                link: "/courses"
            };
        }
        if (percentage >= 40) {
            return {
                title: "Хорошая база, но есть пробелы",
                text: "Рекомендуем начать с бесплатных материалов для новичков.",
                cta: "Бесплатное обучение",
                link: "/beginner-training"
            };
        }
        return {
            title: "Начните с основ",
            text: "Пройдите наш бесплатный курс для начинающих — 9 видео-уроков с нуля.",
            cta: "Начать бесплатно",
            link: "/beginner-training"
        };
    };

    // Email Gate Screen
    if (showEmailGate) {
        return (
            <section className="py-20 bg-trading-dark relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />

                <div className="container mx-auto px-4 max-w-lg text-center">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-purple-800/50 shadow-2xl animate-fade-in">
                        {!emailSubmitted ? (
                            <>
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="h-8 w-8 text-white" />
                                </div>

                                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                                    Квиз пройден! 🎉
                                </h2>

                                <p className="text-gray-400 mb-6">
                                    Введите email, чтобы получить результаты и персональные рекомендации
                                </p>

                                <form onSubmit={handleEmailSubmit} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                                        <Input
                                            type="email"
                                            placeholder="Ваш email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 h-12 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg font-semibold"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            "Отправка..."
                                        ) : (
                                            <>
                                                Получить результаты
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </Button>
                                </form>

                                <button
                                    onClick={skipEmailAndShowResults}
                                    className="mt-4 text-sm text-gray-500 hover:text-gray-400 transition-colors"
                                >
                                    Пропустить и посмотреть результат
                                </button>

                                <p className="mt-6 text-xs text-gray-600">
                                    Мы не отправляем спам. Только полезные материалы по трейдингу.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold mb-3 text-white">Готово!</h2>
                                <p className="text-gray-400">Загружаем ваши результаты...</p>
                            </>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    // Results Screen
    if (showResult) {
        const recommendation = getRecommendation();
        const percentage = (score / totalQuestions) * 100;

        return (
            <section className="py-20 bg-trading-dark relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-2xl text-center">
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl animate-fade-in">
                        <div className="text-6xl mb-6">
                            {percentage >= 70 ? '🏆' : percentage >= 40 ? '📊' : '📚'}
                        </div>

                        <h2 className="text-3xl font-bold mb-4 text-white">{t('quiz.title')}</h2>
                        <p className="text-xl text-gray-300 mb-4">{getResultMessage()}</p>

                        <div className="text-5xl font-bold text-trading-accent mb-6">
                            {score} / {totalQuestions}
                        </div>

                        {/* Progress Ring */}
                        <div className="w-32 h-32 mx-auto mb-8 relative">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-gray-700"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={`${percentage * 3.51} 351`}
                                    className={`${percentage >= 70 ? 'text-green-500' : percentage >= 40 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">{Math.round(percentage)}%</span>
                            </div>
                        </div>

                        {/* Recommendation Card */}
                        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 mb-8 text-left border border-purple-800/50">
                            <h3 className="text-lg font-bold text-white mb-2">{recommendation.title}</h3>
                            <p className="text-gray-400 mb-4">{recommendation.text}</p>
                            <Button
                                onClick={() => window.location.href = recommendation.link}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                                {recommendation.cta}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        <Button
                            onClick={restartQuiz}
                            variant="outline"
                            className="border-gray-700 text-gray-400 hover:bg-gray-800"
                        >
                            {t('quiz.button.restart')}
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    // Quiz Screen
    return (
        <section id="quiz" className="py-20 bg-gradient-to-b from-trading-dark to-trading-card/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-trading-accent/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {t('quiz.title')}
                    </h2>
                    <p className="text-gray-400">
                        {t('quiz.subtitle')}
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 shadow-xl relative min-h-[400px]">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/5 rounded-t-2xl overflow-hidden">
                        <div
                            className="h-full bg-trading-accent transition-all duration-500 ease-out"
                            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                        />
                    </div>

                    <div className="mb-8 mt-4">
                        <span className="text-sm font-medium text-trading-accent tracking-wider uppercase">
                            Вопрос {currentQuestion + 1} / {totalQuestions}
                        </span>
                        <h3 className="text-2xl font-bold text-white mt-2 leading-relaxed">
                            {t(`quiz.question.${currentQuestion + 1}`)}
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((optIndex, index) => {
                            const isCorrect = index === correctAnswers[currentQuestion];
                            const isSelected = selectedAnswer === index;

                            let buttonStyle = "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/20";

                            if (isAnswerChecked) {
                                if (isCorrect) {
                                    buttonStyle = "bg-green-500/20 border-green-500/50 text-green-200";
                                } else if (isSelected) {
                                    buttonStyle = "bg-red-500/20 border-red-500/50 text-red-200";
                                } else {
                                    buttonStyle = "bg-white/5 border-white/10 text-gray-500 opacity-50";
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerClick(index)}
                                    disabled={isAnswerChecked}
                                    className={`w-full p-4 text-left rounded-xl border transition-all duration-200 flex items-center justify-between group ${buttonStyle}`}
                                >
                                    <span className="text-lg">{t(`quiz.q${currentQuestion + 1}.opt${optIndex}`)}</span>
                                    {isAnswerChecked && isCorrect && (
                                        <span className="text-green-400">✓</span>
                                    )}
                                    {isAnswerChecked && isSelected && !isCorrect && (
                                        <span className="text-red-400">✕</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuizSection;
