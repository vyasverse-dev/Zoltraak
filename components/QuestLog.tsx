"use client";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Circle, Plus, Sword } from "lucide-react";
import { useState } from "react";

export function QuestLog() {
  const { quests, completeQuest, addQuest } = useAppStore();
  const [newQuestText, setNewQuestText] = useState("");
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');

  // Safety check to ensure quests is an array before filtering
  const safeQuests = Array.isArray(quests) ? quests : [];
  const activeQuests = safeQuests.filter(q => !q.completed);

  const handleAddQuest = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newQuestText.trim()) return;

    // FIX: Passing two separate arguments to match your store's signature
    addQuest(newQuestText, difficulty);

    setNewQuestText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <Sword className="h-3 w-3" /> Quest Ledger
        </h3>
        <span className="text-[9px] font-black text-primary/50 bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
          {activeQuests.length} Active
        </span>
      </div>

      {/* QUICK ADD INPUT WITH DIFFICULTY SELECTOR */}
      <form onSubmit={handleAddQuest} className="mb-4 space-y-2 group">
        <div className="relative">
          <input 
            type="text"
            value={newQuestText}
            onChange={(e) => setNewQuestText(e.target.value)}
            placeholder="New objective..."
            className="w-full bg-background/20 border border-border/20 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/40 transition-all placeholder:text-muted-foreground/30 text-foreground"
          />
          <button 
            type="submit"
            disabled={!newQuestText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-primary/20 rounded-lg text-primary transition-all disabled:opacity-0"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        {/* DIFFICULTY SELECTOR */}
        <div className="flex gap-2">
          {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setDifficulty(level)}
              className={`text-[8px] font-black px-3 py-1 rounded-md border transition-all uppercase tracking-tighter ${
                difficulty === level 
                  ? 'bg-primary/20 border-primary text-primary' 
                  : 'bg-background/10 border-border/20 text-muted-foreground hover:border-border/60'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </form>

      {/* QUEST LIST */}
      <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
        <AnimatePresence mode='popLayout'>
          {activeQuests.length > 0 ? (
            activeQuests.map((quest) => (
              <motion.div
                key={quest.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => completeQuest(quest.id)}
                className="group flex items-center justify-between rounded-xl border border-border/20 bg-background/40 p-3 transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <Circle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="absolute h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs font-medium truncate max-w-[140px] group-hover:translate-x-1 transition-transform">
                    {quest.text}
                  </span>
                </div>
                
                <div className={`text-[8px] font-black px-2 py-0.5 rounded-md border uppercase tracking-tighter ${
                  quest.difficulty === 'Hard' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                  quest.difficulty === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                  'bg-primary/10 border-primary/20 text-primary'
                }`}>
                  {quest.difficulty}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 border border-dashed border-border/20 rounded-2xl bg-muted/5"
            >
              <p className="text-[10px] text-muted-foreground/50 italic font-medium uppercase tracking-[0.2em]">
                All trials conquered
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}