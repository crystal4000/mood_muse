"use client";

import { ViewState } from "@/types";
import { useEffect, useState } from "react";

const MoodMuseHomePage = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>("landing");

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(savedTheme ? savedTheme === "dark" : prefersDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };
  return <div>MoodMuseHomePage</div>;
};

export default MoodMuseHomePage;
