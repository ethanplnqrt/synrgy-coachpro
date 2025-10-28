import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import "../styles/logoAnimation.css";

export default function Header({ demoBanner }: { demoBanner?: boolean }) {
  const { themeName, toggleTheme, theme } = useTheme();
  const [, setLocation] = useLocation();

  return (
    <header 
      className="fixed top-0 inset-x-0 z-40 backdrop-blur border-b"
      style={{ 
        backgroundColor: `${theme.colors.background}80`,
        borderColor: theme.colors.muted
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div 
          className="cursor-pointer flex items-center"
          onClick={() => setLocation("/")}
        >
          <img
            src={themeName === 'dark' ? "/src/assets/synrgy-dark.svg" : "/src/assets/synrgy-light.svg"}
            alt="Synrgy Logo"
            className="h-8 logo-energy transition-all duration-300 hover:scale-110 drop-shadow-lg"
          />
          <span 
            className="ml-2 text-sm font-medium italic opacity-80 logo-tagline"
            style={{ color: theme.colors.secondary }}
          >
            Hybrid Energy
          </span>
        </div>
        <nav className="flex items-center gap-3">
          <Link 
            href="/demo"
            className="text-sm hover:text-foreground transition-colors"
            style={{ color: theme.colors.muted }}
          >
            Démo
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="hover-scale"
            style={{ color: theme.colors.primary }}
          >
            {themeName === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
          <Link href="/login">
            <Button 
              variant="outline" 
              size="sm"
              className="hover-scale"
              style={{ 
                borderColor: theme.colors.secondary,
                color: theme.colors.secondary
              }}
            >
              Connexion
            </Button>
          </Link>
        </nav>
      </div>
      {demoBanner && (
        <div 
          className="text-center text-xs py-1"
          style={{ 
            backgroundColor: `${theme.colors.warning}20`,
            color: theme.colors.foreground
          }}
        >
          Mode démo — données fictives
        </div>
      )}
    </header>
  );
}


