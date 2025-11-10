import { Home, Users, Calendar, MessageSquare, Settings, CreditCard, LogOut, Dumbbell, Clock, Heart, Zap, Brain, Target, Utensils, Camera, TrendingUp, CheckCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

const coachMenuItems = [
  { title: "Dashboard", url: "/coach/dashboard", icon: Home },
  { title: "Mes clients", url: "/coach/clients", icon: Users },
  { title: "Programmes", url: "/coach/programs", icon: Dumbbell },
  { title: "Check-ins clients", url: "/coach/checkins", icon: CheckCircle },
  { title: "Analytics", url: "/coach/analytics", icon: TrendingUp },
  { title: "Invitations", url: "/coach/referrals", icon: MessageSquare },
  { title: "Abonnement", url: "/coach/subscription", icon: CreditCard },
  { title: "Paramètres", url: "/coach/settings", icon: Settings },
];

const clientMenuItems = [
  { title: "Dashboard", url: "/client/dashboard", icon: Home },
  { title: "Chat Coach", url: "/client/chat", icon: MessageSquare },
  { title: "Entraînement", url: "/client/training", icon: Dumbbell },
  { title: "Nutrition", url: "/client/nutrition", icon: Utensils },
  { title: "Mes check-ins", url: "/client/checkins", icon: CheckCircle },
  { title: "Progression", url: "/client/progress", icon: TrendingUp },
  { title: "Parrainer", url: "/client/referrals", icon: Heart },
  { title: "Paramètres", url: "/client/settings", icon: Settings },
];

const athleteMenuItems = [
  { title: "Dashboard", url: "/athlete/dashboard", icon: Home },
  { title: "Créer programme", url: "/athlete/training/create", icon: Dumbbell },
  { title: "Créer nutrition", url: "/athlete/nutrition/create", icon: Utensils },
  { title: "Mes check-ins", url: "/athlete/checkins", icon: CheckCircle },
  { title: "Assistant IA", url: "/athlete/ai", icon: Brain },
  { title: "Chat IA", url: "/athlete/chat", icon: MessageSquare },
  { title: "Abonnement", url: "/athlete/subscription", icon: CreditCard },
  { title: "Paramètres", url: "/athlete/settings", icon: Settings },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = 
    user?.role === "coach" ? coachMenuItems :
    user?.role === "client" ? clientMenuItems :
    athleteMenuItems;

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-lg p-2">
            <Dumbbell className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-sm">CoachPro</h2>
            <p className="text-xs text-muted-foreground">Plateforme de coaching</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.url.split("/").pop()}`}
                  >
                    <a href={item.url} onClick={(e) => {
                      e.preventDefault();
                      setLocation(item.url);
                    }}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {user && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatarUrl || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" data-testid="text-user-name">
                  {user.fullName}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {user.role === "coach" ? "Coach" : user.role === "client" ? "Client" : "Athlète"}
                  </Badge>
                  {user.role === "coach" && user.isPro && (
                    <Badge variant="default" className="text-xs">
                      Pro
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover-elevate active-elevate-2 rounded-lg transition-colors"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
