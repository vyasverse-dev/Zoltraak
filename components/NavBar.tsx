"use client";

import { Sparkles } from "lucide-react";
import { FormButton } from "@repo/ui/form";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

export function NavBar() {
  const { currentTheme, cycleTheme } = useAppStore();
  const glow =
    currentTheme === "cyberpunk"
      ? "shadow-[0_0_24px_rgba(255,0,204,0.6)]"
      : currentTheme === "anime"
        ? "shadow-[0_0_24px_rgba(255,183,197,0.6)]"
        : currentTheme === "medieval"
          ? "shadow-[0_0_24px_rgba(214,157,52,0.5)]"
          : "shadow-[0_0_24px_rgba(139,92,246,0.5)]";

  return (
    <div className="fixed top-0 left-0 right-0 z-[60]">
      <div className="mx-auto max-w-6xl px-4 py-2">
        <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-background/60 backdrop-blur-xl">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2"
          >
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-black tracking-[0.35em]">ZOLTRAAK</span>
          </Link>
          <div className="px-3 py-1.5">
            <FormButton
              type="button"
              onClick={() => cycleTheme()}
              className={`rounded-full px-4 py-2 font-bold uppercase tracking-widest ${glow}`}
            >
              Warp Reality
            </FormButton>
          </div>
        </div>
      </div>
    </div>
  );
}
