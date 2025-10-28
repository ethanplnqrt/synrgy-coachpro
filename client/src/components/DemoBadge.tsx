import React from "react";

export function DemoBadge() {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium shadow-sm border border-amber-300 animate-pulse"
      title="Mode démo activé"
    >
      <span className="text-amber-500">⚡</span>
      Mode démo activé
    </div>
  );
}

export default DemoBadge;