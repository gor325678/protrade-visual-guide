
import React from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

interface LegalPageLayoutProps {
    children: React.ReactNode;
    title: string;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ children, title }) => {
    return (
        <div className="min-h-screen flex flex-col bg-trading-dark text-gray-300">
            <Header />
            <main className="flex-grow pt-8 pb-16 px-4">
                <div className="max-w-4xl mx-auto bg-trading-card/50 p-8 md:p-12 rounded-2xl border border-white/5 shadow-xl backdrop-blur-sm">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white border-b border-gray-700 pb-4">
                        {title}
                    </h1>
                    <div className="prose prose-invert prose-gray max-w-none">
                        {children}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LegalPageLayout;
