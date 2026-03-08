"use client";

import { useAppStore } from "@/lib/store";
import * as React from "react";

export function SoulCoreHero() {
  // We no longer need the image here because page.tsx is handling the 
  // fixed background image now. This just acts as a spacer for the hero section.
  return (
    <div className="relative w-full min-h-[70vh] flex flex-col items-center justify-center">
        {/* The image tag that was scrolling has been removed */}
    </div>
  );
}
