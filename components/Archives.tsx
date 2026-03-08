"use client";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Plus, Trash2, FileText, FolderOpen } from "lucide-react";
import { useState, useEffect } from "react";

export function Archives() {
  const { notes, activeNoteId, addNote, updateNote, deleteNote, setActiveNote } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch (especially important for Next.js + Zustand Persist)
  useEffect(() => { 
    setMounted(true); 
  }, []);

  // Ensure notes is ALWAYS an array before we call .find() or .map()
  // This prevents the "notes.find is not a function" error
  const safeNotes = Array.isArray(notes) ? notes : [];
  const activeNote = safeNotes.find(n => n.id === activeNoteId);

  if (!mounted) return null;

  return (
    <div className="flex md:h-[500px] w-full bg-card/40 border border-border/40 rounded-3xl shadow-2xl backdrop-blur-md overflow-x-auto md:overflow-hidden snap-x md:snap-none snap-mandatory">
      {/* SIDEBAR: Folder/Note List */}
      <div className="md:w-64 flex-shrink-0 border-r border-border/20 bg-muted/10 p-4 flex flex-col gap-4 min-w-[85vw] md:min-w-0 snap-start md:snap-none">
        <button 
          onClick={() => addNote('General')}
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <Plus className="h-4 w-4" /> New Scroll
        </button>
        
        <div className="flex-1 overflow-y-auto space-y-1 pr-2">
          {/* Use safeNotes here to prevent mapping errors */}
          {safeNotes.length > 0 ? (
            safeNotes.map(note => (
              <div 
                key={note.id}
                onClick={() => setActiveNote(note.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  activeNoteId === note.id ? 'bg-primary/20 ring-1 ring-primary/50' : 'hover:bg-muted/20'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className={`h-3.5 w-3.5 ${activeNoteId === note.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-[11px] font-bold truncate">{note.title || 'Untitled'}</span>
                </div>
                <Trash2 
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="h-3 w-3 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-125" 
                />
              </div>
            ))
          ) : (
            <div className="text-[10px] text-center mt-10 opacity-40 uppercase tracking-tighter">No scrolls found</div>
          )}
        </div>
      </div>

      {/* EDITOR: Content Area */}
      <div className="flex-1 p-8 flex flex-col bg-background/20 min-w-[85vw] md:min-w-0 snap-start md:snap-none">
        {activeNote ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-6">
            <input 
              value={activeNote.title || ''}
              onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
              className="bg-transparent text-3xl font-black italic focus:outline-none placeholder:opacity-20 text-foreground"
              placeholder="Title of your destiny..."
            />
            <textarea 
              value={activeNote.content || ''}
              onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
              className="flex-1 bg-transparent resize-none focus:outline-none text-lg leading-relaxed placeholder:opacity-10 text-foreground/80"
              placeholder="Scribe your thoughts, traveler..."
            />
            <div className="flex justify-between items-center pt-4 border-t border-border/10">
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-2">
                <FolderOpen className="h-3 w-3" /> {activeNote.folder || 'General'}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 italic">
                Synced to Multiverse
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-4">
             <FileText className="h-12 w-12 opacity-10" />
             <p className="text-xs font-bold uppercase tracking-[0.3em]">Select a scroll to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
