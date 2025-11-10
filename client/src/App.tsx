// ✅ Routing unifié — React Router v6 (Synrgy v4.2.1)
// Train Smart. Live Synrgy. 💪✨

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { ThemeProvider as ShadcnThemeProvider } from "./components/ThemeProvider";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useAuth } from "./hooks/useAuth";

// Styles globaux
import "./styles/theme.css";

// i18n
import "./i18n";

// Public pages
import Landing from "./pages/landing";
import Pricing from "./pages/pricing";
import AuthPage from "./pages/auth";
import NotFound from "./pages/not-found";

// Coach pages
import CoachDashboard from "./pages/coach/dashboard";
import CoachClients from "./pages/coach/clients";
import ClientProfile from "./pages/coach/client-profile";
import ProgramBuilder from "./pages/coach/program-builder";
import NutritionBuilder from "./pages/coach/nutrition-builder";
import ChatIA from "./pages/coach/chat-ia";
import CoachSettings from "./pages/coach/settings";
import CoachPrograms from "./pages/coach/programs";
import CoachClientDetail from "./pages/coach/client-detail";
import CoachAnalytics from "./pages/coach/analytics";
import CoachReferrals from "./pages/coach/referrals";
import CoachClientsCheckins from "./pages/coach/clients-checkins";

// Client pages
import ClientDashboard from "./pages/client/dashboard";
import ClientHome from "./pages/client/home";
import ClientChat from "./pages/client/chat";
import ClientTraining from "./pages/client/training";
import ClientNutrition from "./pages/client/nutrition";
import ClientProgress from "./pages/client/progress";
import ClientReferrals from "./pages/client/referrals";
import ClientCheckins from "./pages/client/checkins";

// Shared pages
import Settings from "./pages/settings";
import Subscription from "./pages/subscription";
import SubscriptionSuccess from "./pages/subscription-success";
import SubscriptionCancel from "./pages/subscription-cancel";
import CheckoutPage from "./pages/checkout";

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 * Redirects to correct dashboard if wrong role
 */
function ProtectedRoute({
  component: Component,
  allowedRole,
}: {
  component: React.ComponentType;
  allowedRole?: "coach" | "client";
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-text-secondary">Syncing Greatness...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const dashboardPath = user.role === "coach" ? "/coach/dashboard" : "/client/home";
    return <Navigate to={dashboardPath} replace />;
  }

  return <Component />;
}

/**
 * App Routes Component
 * Handles all app routing with role-based access
 */
function AppRoutes() {
  const { user } = useAuth();
  const { setTheme } = useTheme();

  // Apply theme based on user role
  React.useEffect(() => {
    if (user?.role) {
      setTheme(user.role === "coach" ? "coach" : "client");
      console.log(`🎨 Theme set to: ${user.role}`);
    } else {
      setTheme("default");
    }
  }, [user, setTheme]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to={user.role === "coach" ? "/coach/dashboard" : "/client/home"} replace />
          ) : (
            <Landing />
          )
        } 
      />

      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* Coach Routes - Core Features */}
      <Route path="/coach/dashboard" element={<ProtectedRoute component={CoachDashboard} allowedRole="coach" />} />
      <Route path="/coach/clients" element={<ProtectedRoute component={CoachClients} allowedRole="coach" />} />
      <Route path="/coach/clients/:id" element={<ProtectedRoute component={ClientProfile} allowedRole="coach" />} />
      <Route path="/coach/program-builder" element={<ProtectedRoute component={ProgramBuilder} allowedRole="coach" />} />
      <Route path="/coach/nutrition-builder" element={<ProtectedRoute component={NutritionBuilder} allowedRole="coach" />} />
      <Route path="/coach/chat-ia" element={<ProtectedRoute component={ChatIA} allowedRole="coach" />} />
      <Route path="/coach/settings" element={<ProtectedRoute component={CoachSettings} allowedRole="coach" />} />
      
      {/* Coach Routes - Legacy (fallback to main routes) */}
      <Route path="/coach/client/:id" element={<ProtectedRoute component={CoachClientDetail} allowedRole="coach" />} />
      <Route path="/coach/programs" element={<ProtectedRoute component={CoachPrograms} allowedRole="coach" />} />
      <Route path="/coach/analytics" element={<ProtectedRoute component={CoachAnalytics} allowedRole="coach" />} />
      <Route path="/coach/referrals" element={<ProtectedRoute component={CoachReferrals} allowedRole="coach" />} />
      <Route path="/coach/checkins" element={<ProtectedRoute component={CoachClientsCheckins} allowedRole="coach" />} />
      <Route path="/coach/subscription" element={<ProtectedRoute component={Subscription} allowedRole="coach" />} />

      {/* Client Routes */}
      <Route path="/client/home" element={<ProtectedRoute component={ClientHome} allowedRole="client" />} />
      <Route path="/client/dashboard" element={<ProtectedRoute component={ClientDashboard} allowedRole="client" />} />
      <Route path="/client/chat" element={<ProtectedRoute component={ClientChat} allowedRole="client" />} />
      <Route path="/client/training" element={<ProtectedRoute component={ClientTraining} allowedRole="client" />} />
      <Route path="/client/nutrition" element={<ProtectedRoute component={ClientNutrition} allowedRole="client" />} />
      <Route path="/client/progress" element={<ProtectedRoute component={ClientProgress} allowedRole="client" />} />
      <Route path="/client/referrals" element={<ProtectedRoute component={ClientReferrals} allowedRole="client" />} />
      <Route path="/client/checkins" element={<ProtectedRoute component={ClientCheckins} allowedRole="client" />} />
      <Route path="/client/settings" element={<ProtectedRoute component={Settings} allowedRole="client" />} />

      {/* Shared Routes */}
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/subscription/success" element={<SubscriptionSuccess />} />
      <Route path="/subscription/cancel" element={<SubscriptionCancel />} />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/**
 * App Content with Conditional Sidebar
 * Shows sidebar for authenticated users, clean layout for public pages
 */
function AppContent() {
  const { user } = useAuth();

  const sidebarStyle = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  // Show public pages without sidebar
  if (!user) {
    return (
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-background">
          <AppRoutes />
        </div>
      </TooltipProvider>
    );
  }

  // Show app with sidebar for authenticated users
  return (
    <TooltipProvider>
      <SidebarProvider style={sidebarStyle as React.CSSProperties}>
        <div className="flex h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b border-border">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
            </header>
            <main className="flex-1 overflow-y-auto scrollbar-thin">
              <AppRoutes />
            </main>
          </div>
        </div>
      </SidebarProvider>
      <Toaster />
    </TooltipProvider>
  );
}

/**
 * Main App Component
 * Wraps everything with providers and BrowserRouter
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <ShadcnThemeProvider>
            <BrowserRouter>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </BrowserRouter>
          </ShadcnThemeProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
