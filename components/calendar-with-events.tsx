"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";

export function CalendarWithEvents() {
  const { events, addEvent, deleteEvent } = useAppStore();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date>(new Date());
  const [newEventTitle, setNewEventTitle] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const dayEvents = React.useMemo(() => {
    if (!selectedDate) return [];
    const filtered = Array.isArray(events) 
      ? events.filter(e => e.date === selectedDate.toDateString()) 
      : [];
    return [...filtered].reverse(); 
  }, [events, selectedDate]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && newEventTitle.trim()) {
      addEvent(selectedDate, newEventTitle);
      setNewEventTitle("");
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-card/40 border border-border/40 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
      
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex flex-col relative w-full">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 flex items-center gap-2">
            <CalendarIcon className="h-3 w-3" /> Calendar
          </h3>
          <span className="text-2xl font-black italic text-foreground uppercase tracking-tighter mt-1">
            {format(month, "MMMM yyyy")}
          </span>
        </div>
      </div>

      {/* Calendar first, then Add Event and Events list (vertical flow on all screens) */}
      <div className="w-full overflow-x-auto md:overflow-visible">
        <div className="flex justify-center border-b border-border/10 pb-8 relative shrink-0">
          <div className="min-w-[460px] md:min-w-0">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={month}
              onMonthChange={setMonth}
              showOutsideDays
              classNames={{
                months: "w-full flex justify-center",
                month: "w-full",
                month_caption: "hidden", 
                nav: "absolute right-0 top-[-60px] flex items-center gap-4 z-10",
                button_previous: "h-8 w-8 bg-transparent p-0 flex justify-center items-center opacity-50 hover:opacity-100 transition-opacity",
                button_next: "h-8 w-8 bg-transparent p-0 flex justify-center items-center opacity-50 hover:opacity-100 transition-opacity",
                month_grid: "w-full table-fixed border-collapse",
                weekdays: "flex w-full mb-2",
                weekday: "text-muted-foreground w-full flex-1 font-bold text-[11px] text-center uppercase opacity-50",
                week: "flex w-full mt-1",
                day: "h-11 flex-1 p-0 flex items-center justify-center rounded-xl hover:bg-primary/20 transition-all cursor-pointer text-sm m-1",
                selected: "bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20",
                today: "text-primary border border-primary/30",
                outside: "opacity-10",
                hidden: "invisible",
              }}
              components={{
                Chevron: (props) => {
                  if (props.orientation === 'left') return <ChevronLeft className="h-5 w-5" />;
                  return <ChevronRight className="h-5 w-5" />;
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col pt-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {selectedDate ? `Events for ${format(selectedDate, "MMM do, yyyy")}` : "Select a date"}
          </span>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>
        <div className="space-y-3 pb-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {dayEvents.length > 0 ? (
              dayEvents.map((event) => (
                <motion.div 
                  key={event.id} 
                  layout
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between bg-card/60 border border-border/20 p-4 rounded-2xl group hover:bg-primary/5 transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold tracking-tight group-hover:text-primary transition-colors">
                      {event.title}
                    </span>
                    <span className="text-[9px] text-muted-foreground uppercase font-medium">
                      {format(new Date(event.date), "EEEE")}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteEvent(event.id)} 
                    className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col items-center justify-center py-8 opacity-60"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  No quests scheduled for this day
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[999]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-2xl">
            <div className="mb-4">
              <h3 className="text-lg font-bold tracking-tight">Add Event</h3>
              <p className="text-xs text-muted-foreground">
                {selectedDate ? format(selectedDate, "MMMM do, yyyy") : "Select a date"}
              </p>
            </div>
            <form
              onSubmit={handleAddEvent}
              className="flex items-center gap-2"
            >
              <input
                autoFocus
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Event title..."
                className="flex-1 bg-background/30 border border-border/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-10 px-4 rounded-xl border border-border text-sm font-medium hover:bg-muted/30"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
