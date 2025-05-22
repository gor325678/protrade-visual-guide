
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import CourseOverview from '../components/home/CourseOverview';
import ChartPreview from '../components/home/ChartPreview';
import ProtectionOverlay from '../components/shared/ProtectionOverlay';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white no-select no-drag">
      <ProtectionOverlay />
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <CourseOverview />
        <ChartPreview />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
