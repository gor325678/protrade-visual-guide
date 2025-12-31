
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
import FAQSection from '../components/home/FAQSection';
import InfoSection from '../components/home/InfoSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white no-select no-drag">
      <ProtectionOverlay />
      <Header />

      <main className="flex-grow">
        <HeroSection />
        <QuizSection />
        <TradingSection />
        <CourseOverview />
        <AnalyticsSection />
        <ProblemSolutionSection />
        <ChartPreview />
        <FAQSection />
        <InfoSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
