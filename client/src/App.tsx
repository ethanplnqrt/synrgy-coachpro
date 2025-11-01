import React from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import NotFound from "./pages/not-found";
import AuthPage from "./pages/auth";
import CoachDashboard from "./pages/coach-dashboard";
import CoachClients from "./pages/coach-clients";
import CoachPrograms from "./pages/coach-programs";
import ClientDashboard from "./pages/client-dashboard";
import AICoach from "./pages/ai-coach";
import Subscription from "./pages/subscription";
import type { User } from "../../shared/schema";
import Landing from "./pages/landing";
import Demo from "./pages/demo";
import Header from "./components/Header";
import { useAppConfig } from "./lib/config";
import { ThemeProvider } from "./components/ThemeProvider";
import Settings from "./pages/settings";
import { useAuth } from "./hooks/useAuth";
import ProgramBuilder from "./pages/program-builder";
import ChatIA from "./pages/chat-ia";
import AthleteDashboard from "./pages/athlete-dashboard";
import NutritionPage from "./pages/nutrition";
import TrainingPage from "./pages/training";
import TrainingHistory from "./pages/training-history";
import NutritionHistory from "./pages/nutrition-history";
import { DemoBadge } from "./components/DemoBadge";
import Signup from "./pages/signup";
import Login from "./pages/Login";
import ScanPage from "./pages/scan";
import CommunityPage from "./pages/community";
import PricingPage from "./pages/pricing";
import ProgressPage from "./pages/progress";
import DemoCoach from "./pages/demo-coach";
import DemoAthlete from "./pages/demo-athlete";
import CoachClientDetail from "./pages/coach-client-detail";
import CalPage from "./pages/cal";
import MacrosPage from "./pages/macros";
import HeavyStrongPage from "./pages/heavy-strong";
import TrueCoachPage from "./pages/truecoach";
import CheckInsPage from "./pages/checkins";
import HomePage from "./pages/home";
import ProgressPhotosPage from "./pages/progress-photos";
import JournalPage from "./pages/journal";
import IntroPage from "./pages/intro";
import RegisterPage from "./pages/register";
import TrainingPlanPage from "./pages/training";
import AIAssistant from "./pages/ai-coach";
import ClientDashboardPage from "./pages/client-dashboard";
import ClientChat from "./pages/client-chat";
import ClientTraining from "./pages/client-training";
import ClientNutrition from "./pages/client-nutrition";
import AthleteTrainingCreate from "./pages/athlete-training-create";
import AthleteNutritionCreate from "./pages/athlete-nutrition-create";
import { MainRouter } from "./components/MainRouter";
import CoachReferrals from "./pages/coach-referrals";
import ClientReferrals from "./pages/client-referrals";
import ClientProgress from "./pages/client-progress";
import TrainingSessionActive from "./pages/training-session-active";
import DemoSelector from "./pages/demo-selector";
import ActiveTraining from "./pages/training/ActiveTraining";
import ShieldMonitor from "./pages/shield-monitor";

function ProtectedRoute({
  component: Component,
  allowedRole,
}: {
  component: React.ComponentType;
  allowedRole?: "coach" | "client";
}) {
  const { data: config } = useAppConfig();
  const { data: user, isLoading } = useAuth();

  // Vérifier le mode démo
  const isDemoMode = !!localStorage.getItem("synrgy_demo_token");

  if (isLoading && !config?.testMode && !isDemoMode) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user && !config?.testMode && !isDemoMode) {
    return <Redirect to="/" />;
  }

  if (allowedRole && user && user.role !== allowedRole) {
    return <Redirect to={user.role === "coach" ? "/coach/dashboard" : "/athlete/dashboard"} />;
  }

  return <Component />;
}

function Router() {
  const { data: config } = useAppConfig();
  const { data: user } = useAuth();

  return (
    <Switch>
      <Route path="/">
        <Redirect to="/login" />
      </Route>
      {/* Legacy routes kept for compatibility */}
      <Route path="/demo-selector">
        <DemoSelector />
      </Route>
      <Route path="/landing">
        <Landing />
      </Route>

      <Route path="/login">
        <AuthPage />
      </Route>

      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/register">
        <RegisterPage />
      </Route>

      <Route path="/demo">
        <Demo />
      </Route>

      <Route path="/demo/coach">
        <DemoCoach />
      </Route>

      <Route path="/demo/athlete">
        <DemoAthlete />
      </Route>

      {/* Coach Routes */}
      <Route path="/coach/dashboard">
        <ProtectedRoute component={CoachDashboard} allowedRole="coach" />
      </Route>
      <Route path="/athlete/dashboard">
        <ProtectedRoute component={AthleteDashboard} allowedRole="athlete" />
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
      <Route path="/coach/messages">
        <ProtectedRoute component={AICoach} allowedRole="coach" />
      </Route>
      <Route path="/coach/subscription">
        <ProtectedRoute component={Subscription} allowedRole="coach" />
      </Route>
      <Route path="/coach/programs/create">
        <ProtectedRoute component={ProgramBuilder} allowedRole="coach" />
      </Route>
      <Route path="/coach/settings">
        <ProtectedRoute component={Settings} allowedRole="coach" />
      </Route>

      {/* Athlete Routes */}
      <Route path="/athlete/dashboard">
        <ProtectedRoute component={AthleteDashboard} allowedRole="athlete" />
      </Route>
      <Route path="/athlete/program">
        <ProtectedRoute component={ClientDashboard} allowedRole="athlete" />
      </Route>
      <Route path="/athlete/chat">
        <ProtectedRoute component={ChatIA} allowedRole="athlete" />
      </Route>
      <Route path="/athlete/progress">
        <ProtectedRoute component={ClientDashboard} allowedRole="athlete" />
      </Route>
      <Route path="/nutrition">
        <NutritionPage />
      </Route>
      <Route path="/training">
        <TrainingPage />
      </Route>
      <Route path="/training-history">
        <TrainingHistory />
      </Route>
      <Route path="/nutrition/history">
        <NutritionHistory />
      </Route>
      <Route path="/scan">
        <ScanPage />
      </Route>
      <Route path="/community">
        <CommunityPage />
      </Route>
      <Route path="/pricing">
        <PricingPage />
      </Route>
      <Route path="/progress">
        <ProgressPage />
      </Route>

      {/* New Synrgy Pro Pages */}
      <Route path="/cal">
        <CalPage />
      </Route>
      <Route path="/macros">
        <MacrosPage />
      </Route>
      <Route path="/heavy-strong">
        <HeavyStrongPage />
      </Route>
      <Route path="/truecoach">
        <TrueCoachPage />
      </Route>
      <Route path="/checkins">
        <CheckInsPage />
      </Route>
      <Route path="/progress-photos">
        <ProgressPhotosPage />
      </Route>
      <Route path="/journal">
        <JournalPage />
      </Route>

      {/* New Dashboard Routes */}
      <Route path="/dashboard/coach">
        <ProtectedRoute component={CoachDashboard} allowedRole="coach" />
      </Route>
      <Route path="/dashboard/athlete">
        <ProtectedRoute component={AthleteDashboard} allowedRole="client" />
      </Route>

      {/* Athlete Specific Routes */}
      <Route path="/dashboard/athlete/training">
        <ProtectedRoute component={TrainingPlanPage} allowedRole="client" />
      </Route>
      <Route path="/dashboard/athlete/training/create">
        <ProtectedRoute component={AthleteTrainingCreate} allowedRole="client" />
      </Route>
      <Route path="/training-session-active">
        <TrainingSessionActive />
      </Route>
      <Route path="/training/active">
        <ActiveTraining />
      </Route>
      <Route path="/dashboard/athlete/nutrition">
        <ProtectedRoute component={NutritionPage} allowedRole="client" />
      </Route>
      <Route path="/dashboard/athlete/nutrition/create">
        <ProtectedRoute component={AthleteNutritionCreate} allowedRole="client" />
      </Route>
      <Route path="/dashboard/athlete/ai">
        <ProtectedRoute component={AIAssistant} allowedRole="client" />
      </Route>

      {/* Client Routes */}
      <Route path="/dashboard/client">
        <ProtectedRoute component={ClientDashboardPage} allowedRole="client" />
      </Route>
      <Route path="/dashboard/client/chat">
        <ProtectedRoute component={ClientChat} allowedRole="client" />
      </Route>
      <Route path="/dashboard/client/training">
        <ProtectedRoute component={ClientTraining} allowedRole="client" />
      </Route>
      <Route path="/dashboard/client/nutrition">
        <ProtectedRoute component={ClientNutrition} allowedRole="client" />
      </Route>
      <Route path="/dashboard/client/referrals">
        <ProtectedRoute component={ClientReferrals} allowedRole="client" />
      </Route>
      <Route path="/dashboard/client/progress">
        <ProtectedRoute component={ClientProgress} allowedRole="client" />
      </Route>

      {/* Coach Referrals */}
      <Route path="/dashboard/coach/referrals">
        <ProtectedRoute component={CoachReferrals} allowedRole="coach" />
      </Route>

      {/* SHIELD Monitor */}
      <Route path="/shield-monitor">
        <ShieldMonitor />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { data: user } = useAuth();
  const { data: config } = useAppConfig();

  const sidebarStyle = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  // Show auth page without sidebar
  if (!user || config?.testMode) {
    return (
      <TooltipProvider>
        <Toaster />
        <Header />
        <DemoBadge />
        <div className="pt-14">
          <Router />
        </div>
      </TooltipProvider>
    );
  }

  // Show app with sidebar for authenticated users
  return (
    <TooltipProvider>
      <MainRouter>
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
      </MainRouter>
      <Toaster />
    </TooltipProvider>
  );
}

function App() {
  React.useEffect(() => {
    console.log("✅ Synrgy Router: Default route '/' → '/login' set");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;