"use client";

import { Bot, Cat, GraduationCap, Wand2 } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function Mascot() {
  const theme = useAppStore((s) => s.currentTheme);
  const Icon =
    theme === "cyberpunk"
      ? Bot
      : theme === "medieval"
        ? Wand2
        : theme === "anime"
          ? Cat
          : GraduationCap;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40">
      <div className="animate-float rounded-2xl bg-background/60 backdrop-blur-md border border-border/40 p-3 shadow-lg">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
  );
}
