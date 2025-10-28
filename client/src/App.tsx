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
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ScanPage from "./pages/scan";
import CommunityPage from "./pages/community";
import PricingPage from "./pages/pricing";
import ProgressPage from "./pages/progress";

function ProtectedRoute({
  component: Component,
  allowedRole,
}: {
  component: React.ComponentType;
  allowedRole?: "coach" | "client";
}) {
  const { data: config } = useAppConfig();
  const { data: user, isLoading } = useAuth();

  if (isLoading && !config?.testMode) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user && !config?.testMode) {
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
        <Login />
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

      <Route path="/demo">
        <Demo />
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
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;