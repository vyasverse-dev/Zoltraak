"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronDown, Brain, Coffee } from "lucide-react";

type TimerMode = "Focus" | "Break";

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("Focus");
  const [focusDuration, setFocusDuration] = useState(30 * 60); // Default 30 mins
  const [breakDuration, setBreakDuration] = useState(5 * 60); // Default 5 mins
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isActive, setIsActive] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"focus" | "break" | null>(null);

  // Auto-switch mode when timer hits zero
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Play a sound here if you want in the future!
      const newMode = mode === "Focus" ? "Break" : "Focus";
      setMode(newMode);
      setTimeLeft(newMode === "Focus" ? focusDuration : breakDuration);
      setIsActive(false); // Pause so user can choose to start the next session
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, focusDuration, breakDuration]);

  // Generate options arrays
  // Focus: 30 mins to 480 mins (8 hours) in 5-min increments
  const focusOptions = Array.from({ length: 91 }, (_, i) => 30 + i * 5);
  // Break: 5 mins to 60 mins (1 hour) in 5-min increments
  const breakOptions = Array.from({ length: 12 }, (_, i) => 5 + i * 5);

  const formatDropdownLabel = (totalMins: number) => {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (h > 0 && m > 0) return `${h} hr ${m} min`;
    if (h > 0) return `${h} hr`;
    return `${m} min`;
  };

  const formatClockDisplay = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (h > 0) {
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleModeSwitch = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === "Focus" ? focusDuration : breakDuration);
  };

  const handleSelectTime = (mins: number, target: "focus" | "break") => {
    if (target === "focus") {
      setFocusDuration(mins * 60);
      if (mode === "Focus") setTimeLeft(mins * 60);
    } else {
      setBreakDuration(mins * 60);
      if (mode === "Break") setTimeLeft(mins * 60);
    }
    setIsActive(false);
    setActiveDropdown(null);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "Focus" ? focusDuration : breakDuration);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto z-20"
    >
      <div className="flex flex-col items-center space-y-8 bg-background/70 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] border border-border/20 shadow-2xl relative">
        
        {/* Header: Mode Switches & Dropdowns */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
          
          {/* Mode Toggle (Focus vs Break) */}
          <div className="flex items-center bg-background/50 p-1 rounded-full border border-border/20 shadow-inner">
            <button
              onClick={() => handleModeSwitch("Focus")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                mode === "Focus" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Brain className="h-4 w-4" /> Focus
            </button>
            <button
              onClick={() => handleModeSwitch("Break")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                mode === "Break" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Coffee className="h-4 w-4" /> Break
            </button>
          </div>

          {/* Time Configuration Dropdowns */}
          <div className="flex gap-2">
            {/* Focus Dropdown */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveDropdown(activeDropdown === "focus" ? null : "focus")}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-bold uppercase tracking-wider border border-primary/20"
              >
                Focus: {formatDropdownLabel(Math.floor(focusDuration / 60))} <ChevronDown className="h-3 w-3" />
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "focus" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-background/95 backdrop-blur-xl border border-border/20 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto custom-scrollbar"
                  >
                    {focusOptions.map((mins) => (
                      <button
                        key={mins}
                        onClick={() => handleSelectTime(mins, "focus")}
                        className="w-full px-4 py-3 text-left hover:bg-primary/10 text-sm font-bold transition-colors border-b border-border/5 last:border-0"
                      >
                        {formatDropdownLabel(mins)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Break Dropdown */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveDropdown(activeDropdown === "break" ? null : "break")}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-bold uppercase tracking-wider border border-primary/20"
              >
                Break: {formatDropdownLabel(Math.floor(breakDuration / 60))} <ChevronDown className="h-3 w-3" />
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "break" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-background/95 backdrop-blur-xl border border-border/20 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto custom-scrollbar"
                  >
                    {breakOptions.map((mins) => (
                      <button
                        key={mins}
                        onClick={() => handleSelectTime(mins, "break")}
                        className="w-full px-4 py-3 text-left hover:bg-primary/10 text-sm font-bold transition-colors border-b border-border/5 last:border-0"
                      >
                        {formatDropdownLabel(mins)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Massive Dynamic Clock */}
        <div className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter tabular-nums text-primary transition-all duration-300">
          {formatClockDisplay(timeLeft)}
        </div>

        {/* Controls (Play/Pause & Reset only) */}
        <div className="flex items-center gap-6 pt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className="w-20 h-20 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_var(--primary)]"
          >
            {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetTimer}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-background/50 border border-border/20 hover:border-primary/50 text-foreground transition-colors"
          >
            <RotateCcw className="h-6 w-6" />
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
}
