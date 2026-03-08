"use client";
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Laugh, Meh, Frown, CloudRain } from "lucide-react";
import confetti from "canvas-confetti";

const MOOD_DATA = {
  "Super Happy": { 
    msg: "LET'S GOO! KEEP THAT ENERGY UP! 🔥", 
    icon: Laugh, 
    color: "text-yellow-400",
    action: () => confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
  },
  "Good": { 
    msg: "You're doing great, Nakama! Keep moving forward.", 
    icon: Smile, 
    color: "text-green-400",
    action: () => confetti({ particleCount: 40, spread: 50 })
  },
  "Meh": { 
    msg: "Steady as she goes. A calm sea never made a skilled sailor.", 
    icon: Meh, 
    color: "text-muted-foreground",
    action: () => {}
  },
  "Sad": { 
    msg: "Aw, it's okay. Everyone feels this way. You're doing your best.", 
    icon: Frown, 
    color: "text-blue-400",
    action: () => {}
  },
  "Awful": { 
    msg: "Set your heart ablaze! Dw, you can do it. Tomorrow is a new dawn.", 
    icon: CloudRain, 
    color: "text-red-500",
    action: () => {} 
  }
};

export function MindPalace() {
  const { wellbeing, updateWellbeing } = useAppStore();
  const [activeMsg, setActiveMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleMood = (label: string) => {
    updateWellbeing(label);
    setActiveMsg(MOOD_DATA[label as keyof typeof MOOD_DATA].msg);
    MOOD_DATA[label as keyof typeof MOOD_DATA].action();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12 py-10">
      <h3 className="text-xl font-bold tracking-tight italic">How is your soul feeling today?</h3>
      
      <div className="flex flex-wrap justify-center gap-6">
        {Object.entries(MOOD_DATA).map(([label, data]) => {
          const Icon = data.icon;
          const isActive = wellbeing.mood === label;
          return (
            <motion.button
              key={label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMood(label)}
              className={`flex flex-col items-center gap-3 p-6 rounded-3xl transition-all ${
                isActive ? "bg-primary/20 ring-2 ring-primary shadow-[0_0_20px_var(--primary)]" : "bg-muted/10 opacity-60 hover:opacity-100"
              }`}
            >
              <Icon className={`h-10 w-10 ${data.color}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeMsg && (
          <motion.div
            key={activeMsg}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center"
          >
            <p className="text-lg font-medium italic text-primary">"{activeMsg}"</p>
            {wellbeing.mood === "Awful" && (
               <motion.p 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="mt-4 text-xs font-bold text-red-500 uppercase tracking-widest"
               >
                 ❤️‍🔥 SET YOUR HEART ABLAZE ❤️‍🔥
               </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}