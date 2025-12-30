
import React from 'react';

export const FeaturesSection = () => {
    return (
        <div className="mt-16 text-center">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Почему выбирают наши курсы?</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="bg-trading-card p-6 rounded-lg border border-gray-800">
                        <div className="text-blue-500 text-4xl mb-4">🎯</div>
                        <h3 className="text-xl font-semibold mb-2">Практический подход</h3>
                        <p className="text-gray-300">Все знания подкреплены реальными примерами и практическими заданиями</p>
                    </div>
                    <div className="bg-trading-card p-6 rounded-lg border border-gray-800">
                        <div className="text-green-500 text-4xl mb-4">🏆</div>
                        <h3 className="text-xl font-semibold mb-2">Проверенные стратегии</h3>
                        <p className="text-gray-300">Методы, которые действительно работают на реальных рынках</p>
                    </div>
                    <div className="bg-trading-card p-6 rounded-lg border border-gray-800">
                        <div className="text-purple-500 text-4xl mb-4">💬</div>
                        <h3 className="text-xl font-semibold mb-2">Поддержка сообщества</h3>
                        <p className="text-gray-300">Доступ к закрытому сообществу трейдеров и экспертов</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
