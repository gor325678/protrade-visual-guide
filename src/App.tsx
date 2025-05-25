
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
import { auth0Config } from "./lib/auth0-config";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        scope: auth0Config.scope
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      onRedirectCallback={(appState) => {
        // Перенаправляем пользователя туда, куда он хотел попасть
        window.location.href = appState?.returnTo || window.location.pathname;
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
