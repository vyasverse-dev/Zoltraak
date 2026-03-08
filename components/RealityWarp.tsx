"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";

export function RealityWarp() {
  const theme = useAppStore((s) => s.currentTheme);
  const prev = useRef(theme);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (prev.current !== theme) {
      setActive(true);
      const t = setTimeout(() => setActive(false), 550);
      prev.current = theme;
      return () => clearTimeout(t);
    }
  }, [theme]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="warp"
          className="pointer-events-none fixed inset-0 z-50"
          initial={{ opacity: 0, filter: "blur(0px)" }}
          animate={{ opacity: 0.5, filter: "blur(6px)" }}
          exit={{ opacity: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5 }}
          style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.3), transparent 60%)" }}
        />
      )}
    </AnimatePresence>
  );
}
