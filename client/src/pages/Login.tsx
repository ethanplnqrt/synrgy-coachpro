import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [role, setRole] = useState("athlete");
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const speeches = [
    "Bienvenue sur Synrgy ⚡ — l'alliance parfaite entre IA et performance.",
    "Ici, chaque effort compte. Chaque donnée alimente ton progrès.",
    "Coach ou athlète, découvre ton potentiel, amplifié par l'intelligence artificielle.",
    "Prêt à passer au niveau supérieur ? Connecte-toi et entre dans ton flow."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % speeches.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(`/${role}/dashboard`);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#06B6D4] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_60%)]"></div>

      <div className="flex flex-col items-center text-center z-10 max-w-lg px-6">
        <img
          src="/src/assets/synrgy-light.svg"
          alt="Synrgy Logo"
          className="h-14 mb-6 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)] animate-pulse"
        />
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Libère ton énergie hybride</h1>

        <p className="text-lg font-medium text-cyan-200 mb-8 transition-all duration-700 ease-in-out animate-fade-in">
          {speeches[step]}
        </p>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setRole("coach")}
            className={`px-6 py-2 rounded-lg font-medium border transition-all duration-300 ${
              role === "coach"
                ? "bg-white text-blue-900 border-transparent"
                : "bg-transparent border-cyan-300 text-cyan-200 hover:bg-white/10"
            }`}
          >
            Coach
          </button>
          <button
            onClick={() => setRole("athlete")}
            className={`px-6 py-2 rounded-lg font-medium border transition-all duration-300 ${
              role === "athlete"
                ? "bg-white text-blue-900 border-transparent"
                : "bg-transparent border-cyan-300 text-cyan-200 hover:bg-white/10"
            }`}
          >
            Athlète
          </button>
        </div>

        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/20"
        >
          <input
            type="email"
            placeholder="Adresse email"
            className="w-full mb-4 px-4 py-2 rounded-md border border-cyan-400 bg-transparent text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full mb-4 px-4 py-2 rounded-md border border-cyan-400 bg-transparent text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 transition-colors text-blue-900 font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Se connecter
          </button>

          <p className="mt-4 text-sm text-cyan-200">
            Pas encore de compte ?{" "}
            <button 
              onClick={() => setLocation("/signup")}
              className="text-white font-semibold hover:underline"
            >
              Rejoins la synergie
            </button>
          </p>
        </form>

        <button
          onClick={() => setLocation(`/demo?role=${role}`)}
          className="mt-8 text-sm text-cyan-300 hover:text-white underline transition-colors"
        >
          Explorer la démo Synrgy
        </button>
      </div>

      <div className="absolute bottom-6 text-xs text-cyan-200 opacity-60">
        Synrgy © {new Date().getFullYear()} — Hybrid Energy Experience
      </div>
    </div>
  );
}
