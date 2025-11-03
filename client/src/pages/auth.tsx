import { useState, useEffect } from "react";
import { Redirect, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPath } from "@/lib/roleUtils";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  role: "coach" | "client" | "athlete";
};

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, login, register } = useAuth();
  const [loginData, setLoginData] = useState<LoginPayload>({ email: "", password: "" });
  const [registerData, setRegisterData] = useState<RegisterPayload>({ email: "", password: "", role: "athlete" });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(registerData.email, registerData.password, registerData.role);
      toast({
        title: "Compte créé",
        description: "Bienvenue dans Synrgy !",
      });
      // Redirection handled by AuthContext update
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Impossible de créer ton compte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginData.email, loginData.password);
      toast({
        title: "Connexion réussie",
        description: "Synrgy est prêt à analyser tes performances.",
      });
      // Redirection will be handled by useAuth context
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe invalide",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      setLocation(getDashboardPath(user.role));
    }
  }, [user, setLocation]);

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground">Accède à Synrgy</CardTitle>
          <CardDescription className="text-muted-foreground">
            Connecte-toi ou crée ton compte pour activer ton coach IA et synchroniser tes données.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form className="mt-4 space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={loginData.email}
                    onChange={(event) => setLoginData((state) => ({ ...state, email: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={loginData.password}
                    onChange={(event) => setLoginData((state) => ({ ...state, password: event.target.value }))}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Connexion..." : "Connexion"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form className="mt-4 space-y-4" onSubmit={handleRegister}>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={registerData.email}
                    onChange={(event) => setRegisterData((state) => ({ ...state, email: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Mot de passe</Label>
                  <Input
                    id="register-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={registerData.password}
                    onChange={(event) => setRegisterData((state) => ({ ...state, password: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rôle</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={registerData.role}
                    onChange={(e) => setRegisterData((state) => ({ ...state, role: e.target.value as "coach" | "client" | "athlete" }))}
                  >
                    <option value="athlete">Athlète indépendant</option>
                    <option value="client">Client (avec coach)</option>
                    <option value="coach">Coach professionnel</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Création..." : "Créer mon compte"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

