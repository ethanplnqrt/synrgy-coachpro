import { Home, Users, Calendar, MessageSquare, Settings, CreditCard, LogOut, Dumbbell, Clock, Heart, Zap, Brain, Target, Utensils, Camera, TrendingUp } from "lucide-react";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { User } from "@shared/schema";
import { apiRequest, queryClient, removeAuthToken } from "@/lib/queryClient";

const coachMenuItems = [
  { title: "Dashboard", url: "/dashboard/coach", icon: Home },
  { title: "Mes clients", url: "/coach/clients", icon: Users },
  { title: "Invitations", url: "/dashboard/coach/referrals", icon: MessageSquare },
  { title: "TrueCoach", url: "/truecoach", icon: Brain },
  { title: "Planning", url: "/cal", icon: Calendar },
  { title: "Nutrition", url: "/macros", icon: Utensils },
  { title: "Entraînement", url: "/heavy-strong", icon: Dumbbell },
  { title: "Check-ins", url: "/checkins", icon: Heart },
  { title: "Abonnement", url: "/coach/subscription", icon: CreditCard },
  { title: "Paramètres", url: "/coach/settings", icon: Settings },
];

const athleteMenuItems = [
  { title: "Dashboard", url: "/dashboard/athlete", icon: Home },
  { title: "🏋️ Programme", url: "/dashboard/athlete/training", icon: Dumbbell },
  { title: "🔥 Training Actif", url: "/training-session-active", icon: Zap },
  { title: "🥗 Nutrition", url: "/dashboard/athlete/nutrition", icon: Utensils },
  { title: "📊 Journal", url: "/journal", icon: TrendingUp },
  { title: "📸 Progression", url: "/progress-photos", icon: Camera },
  { title: "🤖 Assistant IA", url: "/dashboard/athlete/ai", icon: Brain },
  { title: "Check-ins", url: "/checkins", icon: Heart },
  { title: "Paramètres", url: "/client/settings", icon: Settings },
];

const clientMenuItems = [
  { title: "Dashboard", url: "/dashboard/client", icon: Home },
  { title: "Chat Coach", url: "/dashboard/client/chat", icon: MessageSquare },
  { title: "Entraînement", url: "/dashboard/client/training", icon: Dumbbell },
  { title: "Nutrition", url: "/dashboard/client/nutrition", icon: Utensils },
  { title: "Progression", url: "/dashboard/client/progress", icon: TrendingUp },
  { title: "Parrainer", url: "/dashboard/client/referrals", icon: Heart },
  { title: "Photos", url: "/progress-photos", icon: Camera },
  { title: "Paramètres", url: "/client/settings", icon: Settings },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  
  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      removeAuthToken();
      queryClient.setQueryData(["/api/auth/me"], null);
      setLocation("/");
    },
  });

  const menuItems = user?.role === "coach" 
    ? coachMenuItems 
    : user?.isClient === true 
    ? clientMenuItems 
    : athleteMenuItems;

  const getInitials = (name: string) => {
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
                    {user.role === "coach" ? "Coach" : "Client"}
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
              onClick={() => logoutMutation.mutate()}
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
