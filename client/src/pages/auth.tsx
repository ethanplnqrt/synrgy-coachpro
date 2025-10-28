import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Mail, Lock, User, UserCircle } from "lucide-react";
import { apiRequest, queryClient, setAuthToken } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import type { InsertUser, LoginCredentials } from "@shared/schema";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Login form state
  const [loginData, setLoginData] = useState<LoginCredentials>({
    username: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState<InsertUser>({
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "client",
    coachId: null,
    avatarUrl: null,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginCredentials) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      queryClient.setQueryData(["/api/auth/me"], data.user);
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${data.user.fullName} !`,
      });
      setLocation(data.user.role === "coach" ? "/coach/dashboard" : "/client/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants invalides",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await apiRequest("POST", "/api/auth/register", data);
      return res.json();
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      queryClient.setQueryData(["/api/auth/me"], data.user);
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès !",
      });
      setLocation(data.user.role === "coach" ? "/coach/dashboard" : "/client/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Dumbbell className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">Plateforme de Coaching</CardTitle>
          <CardDescription>
            Gérez vos programmes d'entraînement et suivez vos progrès
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="tab-login">
                Connexion
              </TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">
                Inscription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Nom d'utilisateur</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-username"
                      data-testid="input-login-username"
                      type="text"
                      placeholder="votre_nom"
                      className="pl-10"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      data-testid="input-login-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                  data-testid="button-login-submit"
                >
                  {loginMutation.isPending ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-role">Je suis...</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={registerData.role === "client" ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setRegisterData({ ...registerData, role: "client" })}
                      data-testid="button-role-client"
                    >
                      <UserCircle className="w-4 h-4 mr-2" />
                      Client
                    </Button>
                    <Button
                      type="button"
                      variant={registerData.role === "coach" ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setRegisterData({ ...registerData, role: "coach" })}
                      data-testid="button-role-coach"
                    >
                      <Dumbbell className="w-4 h-4 mr-2" />
                      Coach
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-fullname">Nom complet</Label>
                  <Input
                    id="register-fullname"
                    data-testid="input-register-fullname"
                    type="text"
                    placeholder="Jean Dupont"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      data-testid="input-register-email"
                      type="email"
                      placeholder="jean@example.com"
                      className="pl-10"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-username">Nom d'utilisateur</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-username"
                      data-testid="input-register-username"
                      type="text"
                      placeholder="jeandupont"
                      className="pl-10"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      data-testid="input-register-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                  data-testid="button-register-submit"
                >
                  {registerMutation.isPending ? "Inscription..." : "S'inscrire"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
