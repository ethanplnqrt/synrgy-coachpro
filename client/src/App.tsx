import React from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Header from "./components/Header";

// Public pages
import Landing from "./pages/landing";
import Pricing from "./pages/pricing";
import AuthPage from "./pages/auth";
import NotFound from "./pages/not-found";

// Coach pages
import CoachDashboard from "./pages/coach/dashboard";
import CoachClients from "./pages/coach/clients";
import CoachPrograms from "./pages/coach/programs";
import CoachClientDetail from "./pages/coach/client-detail";
import CoachAnalytics from "./pages/coach/analytics";
import CoachReferrals from "./pages/coach/referrals";
import CoachClientsCheckins from "./pages/coach/clients-checkins";

// Client pages
import ClientDashboard from "./pages/client/dashboard";
import ClientChat from "./pages/client/chat";
import ClientTraining from "./pages/client/training";
import ClientNutrition from "./pages/client/nutrition";
import ClientProgress from "./pages/client/progress";
import ClientReferrals from "./pages/client/referrals";
import ClientCheckins from "./pages/client/checkins";

// Athlete pages
import AthleteDashboard from "./pages/athlete/dashboard";
import AthleteTrainingCreate from "./pages/athlete/training-create";
import AthleteNutritionCreate from "./pages/athlete/nutrition-create";
import AthleteCheckins from "./pages/athlete/checkins";

// Shared pages
import Settings from "./pages/settings";
import Subscription from "./pages/subscription";
import SubscriptionSuccess from "./pages/subscription-success";
import SubscriptionCancel from "./pages/subscription-cancel";
import ProgramBuilder from "./pages/program-builder";
import ChatIA from "./pages/chat-ia";
import AICoach from "./pages/ai-coach";

function ProtectedRoute({
  component: Component,
  allowedRole,
}: {
  component: React.ComponentType;
  allowedRole?: "coach" | "client" | "athlete";
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const dashboardPath = 
      user.role === "coach" ? "/coach/dashboard" :
      user.role === "client" ? "/client/dashboard" :
      "/athlete/dashboard";
    return <Redirect to={dashboardPath} />;
  }

  return <Component />;
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/">
        {user ? (
          <Redirect to={
            user.role === "coach" ? "/coach/dashboard" :
            user.role === "client" ? "/client/dashboard" :
            "/athlete/dashboard"
          } />
        ) : (
          <Landing />
        )}
      </Route>

      <Route path="/pricing">
        <Pricing />
      </Route>

      <Route path="/login">
        <AuthPage />
      </Route>

      <Route path="/register">
        <AuthPage />
      </Route>

      {/* Coach Routes */}
      <Route path="/coach/dashboard">
        <ProtectedRoute component={CoachDashboard} allowedRole="coach" />
      </Route>
      <Route path="/coach/clients">
        <ProtectedRoute component={CoachClients} allowedRole="coach" />
      </Route>
      <Route path="/coach/client/:id">
        <ProtectedRoute component={CoachClientDetail} allowedRole="coach" />
      </Route>
      <Route path="/coach/programs">
        <ProtectedRoute component={CoachPrograms} allowedRole="coach" />
      </Route>
      <Route path="/coach/programs/create">
        <ProtectedRoute component={ProgramBuilder} allowedRole="coach" />
      </Route>
      <Route path="/coach/analytics">
        <ProtectedRoute component={CoachAnalytics} allowedRole="coach" />
      </Route>
      <Route path="/coach/referrals">
        <ProtectedRoute component={CoachReferrals} allowedRole="coach" />
      </Route>
      <Route path="/coach/checkins">
        <ProtectedRoute component={CoachClientsCheckins} allowedRole="coach" />
      </Route>
      <Route path="/coach/settings">
        <ProtectedRoute component={Settings} allowedRole="coach" />
      </Route>
      <Route path="/coach/subscription">
        <ProtectedRoute component={Subscription} allowedRole="coach" />
      </Route>

      {/* Client Routes */}
      <Route path="/client/dashboard">
        <ProtectedRoute component={ClientDashboard} allowedRole="client" />
      </Route>
      <Route path="/client/chat">
        <ProtectedRoute component={ClientChat} allowedRole="client" />
      </Route>
      <Route path="/client/training">
        <ProtectedRoute component={ClientTraining} allowedRole="client" />
      </Route>
      <Route path="/client/nutrition">
        <ProtectedRoute component={ClientNutrition} allowedRole="client" />
      </Route>
      <Route path="/client/progress">
        <ProtectedRoute component={ClientProgress} allowedRole="client" />
      </Route>
      <Route path="/client/referrals">
        <ProtectedRoute component={ClientReferrals} allowedRole="client" />
      </Route>
      <Route path="/client/checkins">
        <ProtectedRoute component={ClientCheckins} allowedRole="client" />
      </Route>
      <Route path="/client/settings">
        <ProtectedRoute component={Settings} allowedRole="client" />
      </Route>

      {/* Athlete Routes */}
      <Route path="/athlete/dashboard">
        <ProtectedRoute component={AthleteDashboard} allowedRole="athlete" />
      </Route>
      <Route path="/athlete/training/create">
        <ProtectedRoute component={AthleteTrainingCreate} allowedRole="athlete" />
      </Route>
      <Route path="/athlete/nutrition/create">
        <ProtectedRoute component={AthleteNutritionCreate} allowedRole="athlete" />
      </Route>
      <Route path="/athlete/ai">
        <ProtectedRoute component={AICoach} allowedRole="athlete" />
      </Route>
      <Route path="/athlete/chat">
        <ProtectedRoute component={ChatIA} allowedRole="athlete" />
      </Route>
      <Route path="/athlete/checkins">
        <ProtectedRoute component={AthleteCheckins} allowedRole="athlete" />
      </Route>
      <Route path="/athlete/settings">
        <ProtectedRoute component={Settings} allowedRole="athlete" />
      </Route>
      <Route path="/athlete/subscription">
        <ProtectedRoute component={Subscription} allowedRole="athlete" />
      </Route>

      {/* Shared routes for convenience */}
      <Route path="/chat-ia">
        <ProtectedRoute component={ChatIA} />
      </Route>
      <Route path="/ai-coach">
        <ProtectedRoute component={AICoach} />
      </Route>
      <Route path="/subscription/success">
        <ProtectedRoute component={SubscriptionSuccess} />
      </Route>
      <Route path="/subscription/cancel">
        <ProtectedRoute component={SubscriptionCancel} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

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
        <Router />
      </TooltipProvider>
    );
  }

  // Show app with sidebar for authenticated users
  return (
    <TooltipProvider>
      <SidebarProvider style={sidebarStyle as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b border-border">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
            </header>
            <main className="flex-1 overflow-y-auto">
              <Router />
            </main>
          </div>
        </div>
      </SidebarProvider>
      <Toaster />
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
