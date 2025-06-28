import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Index from "./pages/Index";
import BeginnerTraining from "./pages/BeginnerTraining";
import MyCourses from "./pages/MyCourses";
import Psychology from "./pages/Psychology";
import RiskManagement from "./pages/RiskManagement";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import MaterialsManager from "./pages/MaterialsManager";
import CourseStructure from "./pages/CourseStructure";
import Courses from "./pages/Courses";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Account from "./pages/Account";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/beginner-training" element={<BeginnerTraining />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/psychology" element={<Psychology />} />
              <Route path="/risk-management" element={<RiskManagement />} />
              <Route path="/about" element={<About />} />
              <Route path="/materials-manager" element={<MaterialsManager />} />
              <Route path="/course-structure" element={<CourseStructure />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;