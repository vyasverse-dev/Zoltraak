import type { Metadata } from "next";
import React from "react";
import { Navbar } from "../components/Navbar";
import Hero from "@/components/Hero/Hero";

export const metadata: Metadata = {
  title: "MonoLab UI | Copy-Paste React Components for Next.js",
  description:
    "Build faster with MonoLab UI: clean, accessible React components you can copy into your Next.js codebase and customize fully.",
  keywords: [
    "MonoLab UI",
    "Next.js UI components",
    "React component library",
    "copy paste components",
    "accessible UI",
    "Tailwind components",
    "design system",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MonoLab UI | Copy-Paste React Components for Next.js",
    description:
      "Clean, customizable React components for modern products. Copy, adapt, and ship faster with MonoLab UI.",
    url: "/",
    siteName: "MonoLab UI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MonoLab UI | Copy-Paste React Components for Next.js",
    description:
      "Clean, customizable React components for modern products. Copy, adapt, and ship faster with MonoLab UI.",
  },
};

const page = () => {
  return (
    <>
      <div className="">
        <Hero />
      </div>
    </>
  );
};

export default page;
