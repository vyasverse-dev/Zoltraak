"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export function MultiverseThemeSync() {
  const currentTheme = useAppStore((state) => state.currentTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", currentTheme);
    const isDarkTheme = currentTheme === "cyberpunk";
    root.classList.toggle("dark", isDarkTheme);
  }, [currentTheme]);

  return null;
}
