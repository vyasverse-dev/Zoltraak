"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { QuestLog } from "@/components/QuestLog";
import { MindPalace } from "@/components/MindPalace";
import { Archives } from "../components/Archives";
import { CalendarWithEvents } from "@/components/calendar-with-events";
import { PomodoroTimer } from "@/components/PomodoroTimer"; // ADDED IMPORT
import {
  Coins,
  Heart,
  BookOpen,
  Layout,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";
import { SoulCoreHero } from "@/components/SoulCoreHero";
import { useEffect, useState, useRef } from "react";

// Keep maps stable outside the component
const themeMusicMap: Record<string, string> = {
  zenith: "/music/Dragonborn.mp3",
  cyberpunk: "/music/Numb.mp3",
  medieval: "/music/Sunlit.mp3",
  anime: "/music/Konoha.mp3",
};

const themeImageMap: Record<string, string> = {
  zenith: "/images/zenith.jpg",
  cyberpunk: "/images/cyberpunk.png",
  medieval: "/images/medieval.png",
  anime: "/images/anime.png",
};

export default function ZoltraakDashboard() {
  const { currentTheme, player, wellbeing } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const statsAnchorRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update audio source when theme changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const audioUrl = themeMusicMap[currentTheme] || "/music/Dragonborn.mp3";

    if (!audio.src.includes(audioUrl)) {
      audio.src = audioUrl;
    }

    if (isPlaying) {
      audio.play().catch((e) => console.log("Audio play failed:", e));
    }
  }, [currentTheme, isPlaying]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((e) => console.log("Browser blocked autoplay:", e));
    }

    setIsPlaying((v) => !v);
  };

  if (!mounted) return null;

  // IMPORTANT: apply brightness ONLY to the scroll-content wrapper
  const energyBrightness = 0.6 + wellbeing.energy / 250;
  const currentImageUrl = themeImageMap[currentTheme] || "/images/zenith.png";

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <audio ref={audioRef} loop />

      {/* Top-right music button */}
      <motion.button
        onClick={toggleMusic}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-6 right-6 z-[60] flex items-center justify-center p-3 rounded-full bg-background/80 backdrop-blur-md ring-1 ring-primary/40 shadow-[0_0_15px_var(--primary)] text-primary"
        aria-label="Toggle Background Music"
      >
        {isPlaying ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5 opacity-50" />
        )}
      </motion.button>

      {/* TRUE FIXED BACKGROUND POSTER */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTheme}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="relative w-[85vw] h-[85vh] md:w-[90vw] md:h-[90vh] rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.25)] border border-primary/10 bg-background"
          >
            <Image 
              src={currentImageUrl} 
              alt={`${currentTheme} background`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 85vw, 90vw"
            />
            {/* Clean dark dim layer (no blur) */}
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scrollable content ONLY */}
      <motion.div
        animate={{ filter: `brightness(${energyBrightness})` }}
        className="relative z-10 w-full flex flex-col items-center gap-12 pb-24 px-4 sm:px-6"
      >
        {/* Hero band - NOW WITH POMODORO */}
        <section className="w-full flex flex-col items-center pt-16 pb-6 relative min-h-[90vh] gap-12">
          
          {/* THE NEW POMODORO COMPONENT */}
          <PomodoroTimer />
          
          <SoulCoreHero />

          <div className="absolute bottom-14 md:bottom-16 right-0 md:right-6">
            <motion.button
              type="button"
              onClick={() =>
                statsAnchorRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: [0, 6, 0] }}
              transition={{ delay: 1.5, duration: 1.2, repeat: Infinity }}
              className="flex items-center justify-center rounded-full bg-background/90 backdrop-blur-md ring-1 ring-primary/40 shadow-[0_0_20px_var(--primary)] p-3 md:p-3.5"
            >
              <ChevronDown className="h-5 w-5 text-primary" />
            </motion.button>
          </div>
        </section>

        {/* Stats and title */}
        <motion.section
          id="soul-core"
          ref={statsAnchorRef}
          className="w-full max-w-2xl scroll-mt-24 sm:scroll-mt-28"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-center space-y-6 bg-background/70 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] border border-border/20 shadow-2xl">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic text-primary">
              Soul Core
            </h1>
            <div className="space-y-4">
              <div className="text-9xl font-black">{player.level}</div>
              <div className="text-xs uppercase tracking-[0.5em] text-muted-foreground">
                Current Level
              </div>
              <div className="h-3 w-full max-w-xs bg-muted/50 backdrop-blur-md rounded-full overflow-hidden border border-border/20 mx-auto shadow-inner">
                <motion.div
                  className="h-full bg-primary shadow-[0_0_15px_var(--primary)]"
                  animate={{ width: `${player.xp}%` }}
                />
              </div>
            </div>
            <div className="flex justify-center gap-8 text-sm font-bold uppercase tracking-widest pt-4">
              <span className="flex items-center gap-2">
                <Coins className="text-primary h-4 w-4" /> {player.gold} Gold
              </span>
              <span className="text-primary/60">{currentTheme} Reality</span>
            </div>
          </div>
        </motion.section>

        {/* Quest Ledger */}
        <motion.section
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="w-full space-y-6 bg-background/70 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] border border-border/20 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-4 border-b border-border/20 pb-4">
              <Layout className="h-8 w-8 text-primary" />
              <h2 className="text-3xl sm:text-4xl font-bold uppercase italic">
                Quest Ledger
              </h2>
            </div>
            <QuestLog />
          </div>
        </motion.section>

        {/* Mind Palace */}
        <motion.section
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="w-full space-y-6 text-center bg-background/70 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] border border-border/20 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-center gap-4 border-b border-border/20 pb-4 mb-4">
              <Heart className="h-8 w-8 text-red-500" />
              <h2 className="text-3xl sm:text-4xl font-bold uppercase italic">
                Mind Palace
              </h2>
            </div>
            <MindPalace />
          </div>
        </motion.section>

        {/* The Archives */}
        <motion.section
          className="w-full max-w-5xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="w-full space-y-6 bg-background/70 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] border border-border/20 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-4 border-b border-border/20 pb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h2 className="text-3xl sm:text-4xl font-bold uppercase italic">
                The Archives
              </h2>
            </div>
            <Archives />
          </div>
        </motion.section>

        {/* Calendar */}
        <motion.section
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="w-full bg-background/70 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] border border-border/20 shadow-2xl overflow-hidden">
            <CalendarWithEvents />
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
