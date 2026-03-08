"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store";

export function RealityEffects() {
  const theme = useAppStore((s) => s.currentTheme);
  const petals = useMemo(() => Array.from({ length: 18 }, (_, i) => i), []);

  if (theme !== "anime") return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <div className="absolute inset-0">
        {petals.map((i) => (
          <span
            key={i}
            className="petal"
            style={{
              left: `${(i * 7) % 100}%`,
              animationDelay: `${(i % 10) * 0.3}s`,
              animationDuration: `${6 + (i % 5)}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
