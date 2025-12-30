
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const QuizSection = () => {
    const { t } = useLanguage();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);

    // Define correct answers index (0-3) for 12 questions
    // Q1: Participant (Opt 2 -> index 1)
    // Q2: Bull = Rising (Opt 3 -> index 2)
    // Q3: Bear = Falling (Opt 1 -> index 0)
    // Q4: Long = Buy (Opt 1 -> index 0)
    // Q5: Short = Sell (Opt 3 -> index 2)
    // Q6: Stop Loss = Limit loss (Opt 2 -> index 1)
    // Q7: Leverage = Borrowed funds (Opt 2 -> index 1)
    // Q8: Pip = Min change (Opt 2 -> index 1)
    // Q9: Tech Analysis = Charts (Opt 3 -> index 2)
    // Q10: Fund Analysis = Eco data (Opt 1 -> index 0)
    // Q11: Spread = Diff Buy/Sell (Opt 2 -> index 1)
    // Q12: Risk Man = Rules (Opt 2 -> index 1)
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
                setShowResult(true);
            }
        }, 1500);
    };

    const restartQuiz = () => {
        setScore(0);
        setCurrentQuestion(0);
        setShowResult(false);
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
    };

    const getResultMessage = () => {
        const percentage = (score / totalQuestions) * 100;
        if (percentage === 100) return t('quiz.result.perfect');
        if (percentage >= 70) return t('quiz.result.good');
        if (percentage >= 40) return t('quiz.result.average');
        return t('quiz.result.poor');
    };

    if (showResult) {
        return (
            <section className="py-20 bg-trading-dark relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-2xl text-center">
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10 shadow-2xl animate-fade-in">
                        <div className="text-6xl mb-6">🎉</div>
                        <h2 className="text-3xl font-bold mb-4 text-white">{t('quiz.title')}</h2>
                        <p className="text-xl text-gray-300 mb-8">{getResultMessage()}</p>
                        <div className="text-5xl font-bold text-trading-accent mb-8">
                            {score} / {totalQuestions}
                        </div>
                        <Button
                            onClick={restartQuiz}
                            className="px-8 py-6 text-lg bg-trading-accent hover:bg-trading-accent/80 transition-all transform hover:scale-105"
                        >
                            {t('quiz.button.restart')}
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gradient-to-b from-trading-dark to-trading-card/30 relative overflow-hidden">
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
                            Question {currentQuestion + 1} / {totalQuestions}
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
