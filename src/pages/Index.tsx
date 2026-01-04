
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import CourseOverview from '../components/home/CourseOverview';
import ChartPreview from '../components/home/ChartPreview';
import TradingSection from '../components/home/TradingSection';
import AnalyticsSection from '../components/home/AnalyticsSection';
import ProtectionOverlay from '../components/shared/ProtectionOverlay';
import QuizSection from '../components/home/QuizSection';
import ProblemSolutionSection from '../components/home/ProblemSolutionSection';
import VintageQuoteSection from '../components/home/VintageQuoteSection';
import FAQSection from '../components/home/FAQSection';
import InfoSection from '../components/home/InfoSection';
import PhilosophySection from '../components/home/PhilosophySection';

import SupabaseTest from '@/components/SupabaseTest';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white no-select no-drag">
      <ProtectionOverlay />
      <SupabaseTest />
      <Header />

      <main className="flex-grow">
        <HeroSection />
        <QuizSection />
        <TradingSection />
        <PhilosophySection />
        <CourseOverview />
        <AnalyticsSection />
        <ProblemSolutionSection />
        {/* Full width vintage section following ProblemSolution */}
        <VintageQuoteSection />
        <ChartPreview />
        <FAQSection />
        <InfoSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
