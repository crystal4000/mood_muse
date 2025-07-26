"use client";

import React, { useState, useEffect } from "react";
import { MoodboardData, ViewState } from "@/types";
import Header from "@/components/Header";
import LandingSection from "@/components/Landing";
import MoodInputForm from "@/components/MoodInputForm";
import MoodboardResults from "@/components/MoodBoardResults";
import LoadingMoodboard from "@/components/LoadingMoodboard";
import { ToastProvider } from "@/components/Toast";
import { openaiService } from "@/lib/openai";
import { mockResults } from "@/components/MockData";

const MoodMuseHomepage = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>("landing");
  const [moodInput, setMoodInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [moodboardData, setMoodboardData] =
    useState<MoodboardData>(mockResults);

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

  const handleStartMoodForm = () => {
    setCurrentView("form");
    setError(null);
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
    setError(null);
  };

  const handleNewMood = () => {
    setCurrentView("form");
    setError(null);
    setMoodInput("");
  };

  const handleBackToHome = () => {
    setCurrentView("landing");
    setMoodInput("");
    setError(null);
  };

  const handleSubmitMood = async () => {
    if (!moodInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Try to create moodboard with OpenAI
      const generatedMoodboard = await openaiService.createMoodboard(moodInput);
      setMoodboardData(generatedMoodboard);
      setCurrentView("results");
    } catch (error) {
      console.error("Error generating moodboard:", error);

      // Check if it's an API key error
      if (error instanceof Error && error.message.includes("API key")) {
        setError("OpenAI API key not configured. Using demo mode.");
        // Use mock data as fallback
        const fallbackData = {
          ...mockResults,
          originalMood: moodInput,
          poeticCaption: `Your mood "${moodInput}" is like a beautiful melody waiting to be discovered. There's depth in what you're feeling right now.`,
        };
        setMoodboardData(fallbackData);
        setCurrentView("results");
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to generate moodboard. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleSubmitMood();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" />
    );
  }

  const renderCurrentView = () => {
    // Show loading state
    if (isLoading) {
      return <LoadingMoodboard isDark={isDark} moodInput={moodInput} />;
    }

    // Show error state
    if (error && currentView === "form") {
      return (
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div
              className={`p-8 rounded-2xl backdrop-blur-sm ${
                isDark
                  ? "bg-red-500/10 border border-red-500/20"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-4 ${
                  isDark ? "text-red-300" : "text-red-600"
                }`}
              >
                Oops! Something went wrong
              </h3>
              <p className={`mb-6 ${isDark ? "text-red-200" : "text-red-700"}`}>
                {error}
              </p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={handleRetry}
                  className={`px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                      : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                  }`}
                >
                  Try Again
                </button>
                <button
                  onClick={handleBackToLanding}
                  className={`px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? "bg-white/10 text-gray-300 hover:bg-white/20"
                      : "bg-black/10 text-gray-600 hover:bg-black/20"
                  }`}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Regular view rendering
    switch (currentView) {
      case "landing":
        return (
          <LandingSection
            isDark={isDark}
            onStartMoodForm={handleStartMoodForm}
          />
        );
      case "form":
        return (
          <MoodInputForm
            isDark={isDark}
            moodInput={moodInput}
            onMoodInputChange={setMoodInput}
            onBack={handleBackToLanding}
            onSubmit={handleSubmitMood}
          />
        );
      case "results":
        return (
          <MoodboardResults
            isDark={isDark}
            data={moodboardData}
            onNewMood={handleNewMood}
            onBackToHome={handleBackToHome}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ToastProvider>
      <div
        className={`min-h-screen transition-all duration-500 ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
            : "bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50"
        }`}
      >
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse ${
              isDark ? "bg-purple-500" : "bg-purple-300"
            }`}
            style={{ animationDelay: "0s", animationDuration: "4s" }}
          />
          <div
            className={`absolute top-40 right-32 w-96 h-96 rounded-full blur-3xl opacity-15 animate-pulse ${
              isDark ? "bg-pink-500" : "bg-pink-300"
            }`}
            style={{ animationDelay: "2s", animationDuration: "6s" }}
          />
          <div
            className={`absolute bottom-32 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-10 animate-pulse ${
              isDark ? "bg-indigo-500" : "bg-indigo-300"
            }`}
            style={{ animationDelay: "4s", animationDuration: "5s" }}
          />
        </div>

        <div className="relative z-10">
          {/* Only show header if not loading */}
          {!isLoading && <Header isDark={isDark} onToggleTheme={toggleTheme} />}

          <main
            className={`container mx-auto px-6 ${
              !isLoading ? "py-16 md:py-24" : ""
            } min-h-screen flex items-center`}
          >
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default MoodMuseHomepage;
