import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { Sun, Moon, LogOut, User } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPath, getSettingsPath, getRoleLabel } from "@/lib/roleUtils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import "../styles/logoAnimation.css";

export default function Header() {
  const { themeName, toggleTheme, theme } = useTheme();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Fallbacks sécurisés si theme ou colors sont undefined
  const backgroundColor = theme?.colors?.background || "#0B1220";
  const borderColor = theme?.colors?.muted || "#1F2937";
  const secondaryColor = theme?.colors?.secondary || "#4ADE80";
  const primaryColor = theme?.colors?.primary || "#FF6B3D";

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header 
      className="fixed top-0 inset-x-0 z-40 backdrop-blur border-b"
      style={{ 
        backgroundColor: `${backgroundColor}80`,
        borderColor: borderColor
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div 
          className="cursor-pointer flex items-center"
          onClick={() => setLocation(isAuthenticated && user ? getDashboardPath(user.role) : "/")}
        >
          <img
            src={themeName === 'dark' ? "/src/assets/synrgy-dark.svg" : "/src/assets/synrgy-light.svg"}
            alt="Synrgy Logo"
            className="h-8 logo-energy transition-all duration-300 hover:scale-110 drop-shadow-lg"
          />
          <span 
            className="ml-2 text-sm font-medium italic opacity-80 logo-tagline"
            style={{ color: secondaryColor }}
          >
            Hybrid Energy
          </span>
        </div>
        <nav className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="hover-scale"
            style={{ color: primaryColor }}
          >
            {themeName === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
          
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-9">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(user.fullName || user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm max-w-[120px] truncate">
                    {user.fullName || user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.fullName || "Utilisateur"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {getRoleLabel(user.role)}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation(getSettingsPath(user.role))}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button 
                variant="outline" 
                size="sm"
                className="hover-scale"
                style={{ 
                  borderColor: secondaryColor,
                  color: secondaryColor
                }}
              >
                Connexion
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}


