import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Mail, Lock, User, UserCircle, Check, Sparkles, TrendingUp, Zap } from "lucide-react";
import { apiRequest, queryClient, setAuthToken } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { InsertUser, LoginCredentials } from "@shared/schema";

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
}

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

  // Subscription state
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [userType, setUserType] = useState<"coach" | "athlete">("athlete");
  const [emailForSubscription, setEmailForSubscription] = useState("");

  // Fetch subscription plans
  const { data: plansData } = useQuery<{ coach: Plan[]; athlete: Plan[] }>({
    queryKey: ["/api/payments/plans"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/payments/plans");
      return res.json();
    },
  });

  // Text animation
  const features = [
    { icon: "💪", text: "Crée ton programme d'entraînement intelligent" },
    { icon: "🥗", text: "Génère ton plan alimentaire sur mesure" },
    { icon: "📊", text: "Suis ta progression comme un pro" },
  ];

  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  const subscribeMutation = useMutation({
    mutationFn: async (planId: string) => {
      const res = await apiRequest("POST", "/api/payments/checkout", {
        planId,
        email: emailForSubscription || registerData.email || loginData.username,
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Essai gratuit activé",
          description: "14 jours offerts avant facturation",
        });
        setLocation("/demo");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de paiement",
        description: error.message || "Impossible de créer la session de paiement",
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

  const handleSubscribe = (planId: string) => {
    if (!emailForSubscription && !registerData.email && !loginData.username) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre email pour continuer",
        variant: "destructive",
      });
      return;
    }
    subscribeMutation.mutate(planId);
  };

  const currentPlans = userType === "coach" ? plansData?.coach || [] : plansData?.athlete || [];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Presentation */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-pink-600 to-purple-600 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 p-12 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
        <div className="relative z-10 space-y-8 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/20 backdrop-blur-lg rounded-full p-3">
              <Dumbbell className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold">Synrgy</h1>
          </div>
          
          <h2 className="text-5xl font-extrabold leading-tight">
            Rejoins Synrgy — l'IA sportive qui t'accompagne au quotidien
          </h2>

          <div className="space-y-4 mt-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg bg-white/10 backdrop-blur-lg transition-all duration-500 ${
                  index === currentFeatureIndex
                    ? "opacity-100 translate-x-0 scale-105"
                    : "opacity-50 translate-x-[-20px] scale-100"
                }`}
              >
                <span className="text-3xl">{feature.icon}</span>
                <p className="text-xl font-semibold">{feature.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex gap-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">IA Locale avec Ollama</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Performance Optimale</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth & Subscriptions */}
      <div className="w-full lg:w-1/2 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Login Card */}
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Déjà membre ?</CardTitle>
              <CardDescription>Connecte-toi à ton compte Synrgy</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Nom d'utilisateur</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-username"
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
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Subscription Plans */}
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Nouveau ? Choisis ton abonnement</CardTitle>
              <CardDescription>14 jours d'essai gratuit - Sans engagement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Type Selector */}
              <div className="flex gap-3 mb-6">
                <Button
                  type="button"
                  variant={userType === "athlete" ? "default" : "outline"}
                  className={`flex-1 ${userType === "athlete" ? "bg-gradient-to-r from-orange-500 to-pink-600" : ""}`}
                  onClick={() => setUserType("athlete")}
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  Athlète indépendant
                </Button>
                <Button
                  type="button"
                  variant={userType === "coach" ? "default" : "outline"}
                  className={`flex-1 ${userType === "coach" ? "bg-gradient-to-r from-orange-500 to-pink-600" : ""}`}
                  onClick={() => setUserType("coach")}
                >
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Coach
                </Button>
              </div>

              {/* Plans Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {currentPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      selectedPlan === plan.id
                        ? "border-orange-500 dark:border-purple-500 shadow-lg"
                        : "border-border"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        {plan.id.includes("pro") || plan.id.includes("elite") && (
                          <span className="bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs px-2 py-1 rounded-full">
                            Populaire
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">{plan.price}€</span>
                        <span className="text-muted-foreground">/{plan.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">14 jours d'essai gratuit</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => {
                          setSelectedPlan(plan.id);
                          handleSubscribe(plan.id);
                        }}
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                        disabled={subscribeMutation.isPending}
                      >
                        {subscribeMutation.isPending ? "Chargement..." : "Souscrire maintenant"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Email input for subscription */}
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="subscription-email">Email pour l'abonnement</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="subscription-email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    value={emailForSubscription}
                    onChange={(e) => setEmailForSubscription(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Ou inscris-toi d'abord ci-dessous avec ce formulaire
                </p>
              </div>

              {/* Register Form */}
              <Tabs defaultValue="register" className="mt-6">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="register">Inscription gratuite</TabsTrigger>
                </TabsList>
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
                        >
                          <UserCircle className="w-4 h-4 mr-2" />
                          Client
                        </Button>
                        <Button
                          type="button"
                          variant={registerData.role === "coach" ? "default" : "outline"}
                          className="w-full"
                          onClick={() => setRegisterData({ ...registerData, role: "coach" })}
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
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Inscription..." : "S'inscrire gratuitement"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
