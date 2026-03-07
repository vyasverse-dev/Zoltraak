"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";
import { FormCard } from "@repo/ui/form";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const XP_PER_LEVEL = 100;

export default function ZoltraakDashboard() {
  const { currentTheme, cycleTheme, player } = useAppStore();
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    setShowFlash(true);
    const t = setTimeout(() => setShowFlash(false), 320);
    return () => clearTimeout(t);
  }, [currentTheme]);

  const xpProgress = Math.min(1, player.xp / XP_PER_LEVEL);

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-background px-4 py-8 md:px-6 md:py-10">
      {/* Full-screen flash when theme changes */}
      <AnimatePresence mode="wait">
        {showFlash && (
          <motion.div
            key={`flash-${currentTheme}`}
            className="pointer-events-none fixed inset-0 z-100 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.3, times: [0, 0.15, 1] }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Floating WARP REALITY button */}
      <motion.button
        type="button"
        onClick={() => cycleTheme()}
        className={cn(
          "fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-semibold",
          "border border-primary/40 bg-primary text-primary-foreground",
          "shadow-[0_0_24px_var(--primary),0_0_48px_var(--primary)/40]",
          "transition-shadow hover:shadow-[0_0_32px_var(--primary),0_0_64px_var(--primary)/50]",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        WARP REALITY
      </motion.button>

      {/* Bento Grid with scale pulse on theme change */}
      <motion.div
        key={currentTheme}
        className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto]"
        initial={false}
        animate={{
          scale: showFlash ? [1, 1.02, 1] : 1,
        }}
        transition={{
          duration: 0.35,
          times: [0, 0.5, 1],
        }}
      >
        {/* Row 0 */}
        <BentoCell className="min-h-[120px] lg:min-h-[140px]">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Reality
          </span>
          <span className="text-lg font-medium text-foreground">{currentTheme}</span>
        </BentoCell>
        <BentoCell colSpan={2} className="min-h-[120px] lg:min-h-[140px]" />
        <BentoCell className="min-h-[120px] lg:min-h-[140px]">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Dimension
          </span>
        </BentoCell>

        {/* Row 1 – Soul Core (2x2) */}
        <BentoCell className="min-h-[120px] lg:min-h-[140px]" />
        <BentoCell
          colSpan={2}
          rowSpan={2}
          className="flex min-h-[200px] flex-col p-6 lg:min-h-[280px]"
        >
          <FormCard className="flex h-full flex-col border-border/50 bg-card/80 backdrop-blur-sm">
            <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Soul Core
            </h2>
            <div className="flex flex-1 flex-col items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">Level {player.level}</div>
                <p className="mt-1 text-xs text-muted-foreground">Current plane</p>
              </div>
              <div className="w-full max-w-[220px]">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>XP</span>
                  <span>
                    {player.xp} / {XP_PER_LEVEL}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: "var(--primary)" }}
                    initial={false}
                    animate={{ width: `${xpProgress * 100}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border/40 bg-muted/50 px-4 py-2">
                <Coins className="h-4 w-4 text-primary" aria-hidden />
                <span className="text-sm font-semibold text-foreground">{player.gold}</span>
                <span className="text-xs text-muted-foreground">Gold</span>
              </div>
            </div>
          </FormCard>
        </BentoCell>
        <BentoCell className="min-h-[120px] lg:min-h-[140px]" />

        {/* Row 2 */}
        <BentoCell className="min-h-[120px] lg:min-h-[140px]" />
        <BentoCell className="min-h-[120px] lg:min-h-[140px]" />
        <BentoCell className="min-h-[120px] lg:min-h-[140px]">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Zoltraak
          </span>
        </BentoCell>

        {/* Row 3 – extra row for abundance */}
        <BentoCell className="min-h-[100px]" />
        <BentoCell className="min-h-[100px]" />
        <BentoCell colSpan={2} className="min-h-[100px]">
          <span className="text-xs text-muted-foreground">
            Use <strong className="text-foreground">WARP REALITY</strong> to shift dimensions.
          </span>
        </BentoCell>
      </motion.div>
    </div>
  );
}

function BentoCell({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
}: {
  children?: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/30 bg-muted/20 p-4 transition-colors hover:border-border/50 hover:bg-muted/30",
        colSpan === 2 && "lg:col-span-2",
        rowSpan === 2 && "lg:row-span-2",
        className
      )}
    >
      {children}
    </div>
  );
}
