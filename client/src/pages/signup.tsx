import React, { useState } from "react";
import { useLocation } from "wouter";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [role, setRole] = useState("athlete");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 text-center px-6">
      <h1 className="text-3xl font-bold mb-4 text-primary">Créer ton compte Synrgy</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Choisis ton rôle pour personnaliser ton expérience.
      </p>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setRole("coach")}
          className={`px-6 py-2 rounded-lg font-medium border ${
            role === "coach"
              ? "bg-orange-500 text-white border-transparent"
              : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
          }`}
        >
          Coach
        </button>
        <button
          onClick={() => setRole("athlete")}
          className={`px-6 py-2 rounded-lg font-medium border ${
            role === "athlete"
              ? "bg-blue-500 text-white border-transparent"
              : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
          }`}
        >
          Athlète
        </button>
      </div>

      <button
        onClick={() => setLocation(`/demo?role=${role}`)}
        className="bg-green-500 hover:bg-green-600 transition-colors text-white font-semibold py-2 px-6 rounded-lg shadow-md"
      >
        Continuer en mode démo
      </button>
    </div>
  );
}