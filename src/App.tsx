
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import { Auth0Provider } from "@auth0/auth0-react";
import Index from "./pages/Index";
import BeginnerTraining from "./pages/BeginnerTraining";
import Indicators from "./pages/Indicators";
import Psychology from "./pages/Psychology";
import RiskManagement from "./pages/RiskManagement";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MaterialsManager from "./pages/MaterialsManager";
import CourseStructure from "./pages/CourseStructure";
import AuthGuard from "./components/auth/AuthGuard";

// Create a client
const queryClient = new QueryClient();

// Auth0 domain and client ID
const auth0Domain = "dev-rycuhbhc34tcpfor.us.auth0.com";
const auth0ClientId = "vfejFtpy85i0tIVtFycc31RDUfx5Jyy7";

const App = () => (
  <React.StrictMode>
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/materials-manager" element={
                <AuthGuard>
                  <MaterialsManager />
                </AuthGuard>
              } />
              <Route path="/course-structure" element={<CourseStructure />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);

export default App;
