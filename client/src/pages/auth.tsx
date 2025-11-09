// ✅ Auth Page Premium — Synrgy v4.2.1
// Design glassmorphism avec animations dorées

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Users, Dumbbell, Sparkles } from "lucide-react";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
  role: "coach" | "client";
};

export default function AuthPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginData, setLoginData] = useState<LoginPayload>({ email: "", password: "" });
  const [registerData, setRegisterData] = useState<RegisterPayload>({ 
    email: "", 
    password: "", 
    fullName: "",
    role: "client" 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(registerData.email, registerData.password, registerData.role, registerData.fullName);
      toast({
        title: t("auth.toasts.registerSuccess"),
        description: t("auth.toasts.registerSuccessDesc"),
      });
    } catch (error: any) {
      toast({
        title: t("auth.toasts.registerError"),
        description: error.message || t("auth.toasts.registerErrorDesc"),
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
        title: t("auth.toasts.loginSuccess"),
        description: t("auth.toasts.loginSuccessDesc"),
      });
    } catch (error: any) {
      toast({
        title: t("auth.toasts.loginError"),
        description: error.message || t("auth.toasts.loginErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const path = user.role === "coach" ? "/coach/dashboard" : "/client/home";
      navigate(path, { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e0f12] px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card with glassmorphism */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-success/20 border border-primary/30 mb-4"
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            
            <h1 className="text-3xl font-light text-white mb-2">
              {t("auth.title")} <span className="text-gradient-gold font-normal">Synrgy</span> ⚡
            </h1>
            <p className="text-sm text-zinc-400">
              {t("auth.subtitle")}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeTab === "login"
                  ? "bg-gradient-to-r from-amber-400 to-yellow-600 text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {t("auth.tabs.login")}
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeTab === "register"
                  ? "bg-gradient-to-r from-amber-400 to-yellow-600 text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {t("auth.tabs.register")}
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm text-zinc-300">
                      {t("auth.fields.email")}
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData((s) => ({ ...s, email: e.target.value }))}
                      className="w-full rounded-lg bg-transparent border border-zinc-600 focus:border-amber-400 text-white px-3 py-2 outline-none transition-all"
                      placeholder={t("auth.placeholders.email")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm text-zinc-300">
                      {t("auth.fields.password")}
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData((s) => ({ ...s, password: e.target.value }))}
                      className="w-full rounded-lg bg-transparent border border-zinc-600 focus:border-amber-400 text-white px-3 py-2 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-semibold hover:scale-[1.03] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? t("auth.buttons.loginLoading") : t("auth.buttons.login")}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form className="space-y-4" onSubmit={handleRegister}>
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-sm text-zinc-300">
                      {t("auth.fields.fullName")}
                    </Label>
                    <Input
                      id="register-name"
                      type="text"
                      required
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData((s) => ({ ...s, fullName: e.target.value }))}
                      className="w-full rounded-lg bg-transparent border border-zinc-600 focus:border-amber-400 text-white px-3 py-2 outline-none transition-all"
                      placeholder={t("auth.placeholders.fullName")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-sm text-zinc-300">
                      Email
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData((s) => ({ ...s, email: e.target.value }))}
                      className="w-full rounded-lg bg-transparent border border-zinc-600 focus:border-amber-400 text-white px-3 py-2 outline-none transition-all"
                      placeholder="ton@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm text-zinc-300">
                      Mot de passe
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={registerData.password}
                      onChange={(e) => setRegisterData((s) => ({ ...s, password: e.target.value }))}
                      className="w-full rounded-lg bg-transparent border border-zinc-600 focus:border-amber-400 text-white px-3 py-2 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm text-zinc-300">{t("auth.fields.role")}</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setRegisterData((s) => ({ ...s, role: "coach" }))}
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${
                          registerData.role === "coach"
                            ? "border-amber-400 bg-zinc-900"
                            : "border-zinc-700 hover:border-zinc-600"
                        }`}
                      >
                        <Users className="w-6 h-6 text-amber-400 mb-2" />
                        <h3 className="font-semibold text-amber-400">{t("auth.roles.coach")}</h3>
                        <p className="text-xs text-zinc-400 mt-1">{t("auth.pricing.coach")}</p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setRegisterData((s) => ({ ...s, role: "client" }))}
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${
                          registerData.role === "client"
                            ? "border-amber-400 bg-zinc-900"
                            : "border-zinc-700 hover:border-zinc-600"
                        }`}
                      >
                        <Dumbbell className="w-6 h-6 text-amber-400 mb-2" />
                        <h3 className="font-semibold text-amber-400">{t("auth.roles.client")}</h3>
                        <p className="text-xs text-zinc-400 mt-1">{t("auth.pricing.client")}</p>
                      </motion.div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-semibold hover:scale-[1.03] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? t("auth.buttons.registerLoading") : t("auth.buttons.register")}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <p className="text-center text-xs text-zinc-500 mt-6">
            {t("auth.footer")}
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-sm text-zinc-600 mt-6">
          {t("auth.tagline")}
        </p>
      </motion.div>
    </div>
  );
}
