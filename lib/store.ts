import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MultiverseTheme = 'zenith' | 'cyberpunk' | 'medieval' | 'anime';

interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  updatedAt: string;
}

interface Quest {
  id: string;
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
}

interface CalendarEvent {
  id: string;
  date: string; 
  title: string;
}

interface AppState {
  currentTheme: MultiverseTheme;
  player: {
    xp: number;
    level: number;
    gold: number;
  };
  quests: Quest[];
  events: CalendarEvent[];
  wellbeing: {
    mood: string;
    energy: number;
    lastUpdated: string | null;
  };
  notes: Note[];
  activeNoteId: string | null;

  setTheme: (theme: MultiverseTheme) => void;
  cycleTheme: () => void;
  addQuest: (text: string, difficulty: Quest['difficulty']) => void;
  completeQuest: (id: string) => void;
  deleteQuest: (id: string) => void; // Added for completeness
  addEvent: (date: Date, title: string) => void;
  deleteEvent: (id: string) => void;
  updateWellbeing: (mood: string) => void;
  addNote: (folder?: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  spendGold: (amount: number) => boolean;
}

// Helper for multi-level-up logic
const calculateLevelUp = (xp: number, level: number) => {
  let newXp = xp;
  let newLevel = level;
  while (newXp >= 100) {
    newXp -= 100;
    newLevel += 1;
  }
  return { newXp, newLevel };
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentTheme: 'zenith',
      player: { xp: 0, level: 1, gold: 0 },
      quests: [
        { id: '1', text: 'Initialize Zoltraak Core', difficulty: 'Easy', completed: false },
        { id: '2', text: 'Master the Scrolling Realm', difficulty: 'Medium', completed: false },
      ],
      events: [],
      wellbeing: { mood: 'Neutral', energy: 100, lastUpdated: null },
      notes: [
        { 
          id: 'init-scroll', 
          title: 'The First Scroll', 
          content: 'Scribe your destiny here...', 
          folder: 'General', 
          updatedAt: new Date().toISOString() 
        }
      ],
      activeNoteId: 'init-scroll',

      setTheme: (theme) => set({ currentTheme: theme }),
      cycleTheme: () => {
        const themes: MultiverseTheme[] = ['zenith', 'cyberpunk', 'medieval', 'anime'];
        const currentIndex = themes.indexOf(get().currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        set({ currentTheme: themes[nextIndex] });
      },

      addQuest: (text, difficulty) => set((state) => ({
        quests: [...state.quests, { id: Math.random().toString(36).substr(2, 9), text, difficulty, completed: false }]
      })),

      deleteQuest: (id) => set((state) => ({
        quests: state.quests.filter(q => q.id !== id)
      })),
      
      completeQuest: (id) => set((state) => {
        const quest = state.quests.find(q => q.id === id);
        if (!quest || quest.completed) return state;

        const xpGains = { Easy: 10, Medium: 25, Hard: 50 };
        const goldGains = { Easy: 5, Medium: 15, Hard: 40 };
        
        const { newXp, newLevel } = calculateLevelUp(
          state.player.xp + xpGains[quest.difficulty], 
          state.player.level
        );

        return {
          player: {
            ...state.player,
            xp: newXp,
            level: newLevel,
            gold: state.player.gold + goldGains[quest.difficulty]
          },
          quests: state.quests.map(q => q.id === id ? { ...q, completed: true } : q)
        };
      }),

      addEvent: (date, title) => set((state) => ({
        events: [
          ...state.events, 
          { id: Math.random().toString(36).substr(2, 9), date: date.toDateString(), title }
        ]
      })),

      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(e => e.id !== id)
      })),

      updateWellbeing: (mood) => set((state) => {
        const moodChanged = state.wellbeing.mood !== mood;
        let { newXp, newLevel } = calculateLevelUp(
          state.player.xp + (moodChanged ? 5 : 0),
          state.player.level
        );

        return {
          wellbeing: { mood, energy: 100, lastUpdated: new Date().toISOString() },
          player: { ...state.player, xp: newXp, level: newLevel }
        };
      }),

      addNote: (folder = 'General') => {
        const newNote: Note = {
          id: Math.random().toString(36).substr(2, 9),
          title: 'Untitled Scroll',
          content: '',
          folder,
          updatedAt: new Date().toISOString()
        };
        set((state) => ({ 
          notes: [newNote, ...state.notes], 
          activeNoteId: newNote.id 
        }));
      },

      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map(n => 
          n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
        )
      })),

      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id),
        activeNoteId: state.activeNoteId === id ? null : state.activeNoteId
      })),

      setActiveNote: (id) => set({ activeNoteId: id }),

      spendGold: (amount) => {
        const currentGold = get().player.gold;
        if (currentGold >= amount) {
          set((state) => ({
            player: { ...state.player, gold: state.player.gold - amount }
          }));
          return true;
        }
        return false;
      },
    }),
    { name: 'zoltraak-storage' }
  )
);