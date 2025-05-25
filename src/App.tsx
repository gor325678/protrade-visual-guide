
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Index from "./pages/Index";
import BeginnerTraining from "./pages/BeginnerTraining";
import Indicators from "./pages/Indicators";
import Psychology from "./pages/Psychology";
import RiskManagement from "./pages/RiskManagement";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import MaterialsManager from "./pages/MaterialsManager";
import CourseStructure from "./pages/CourseStructure";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/beginner-training" element={<BeginnerTraining />} />
            <Route path="/indicators" element={<Indicators />} />
            <Route path="/psychology" element={<Psychology />} />
            <Route path="/risk-management" element={<RiskManagement />} />
            <Route path="/about" element={<About />} />
            <Route path="/materials-manager" element={<MaterialsManager />} />
            <Route path="/course-structure" element={<CourseStructure />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
