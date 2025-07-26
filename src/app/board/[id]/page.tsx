// app/board/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MoodboardData } from "@/types";
import Header from "@/components/Header";
import MoodboardResults from "@/components/MoodBoardResults";
import { ToastProvider, useToast } from "@/components/Toast";
import { supabaseMoodboardService, SharedMoodboard } from "@/lib/supabase";
import { ArrowLeft, Eye, Share2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

const SharedMoodboardContent = () => {
  const params = useParams();
  const moodboardId = params.id as string;
  const { showToast } = useToast();

  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [moodboardData, setMoodboardData] = useState<SharedMoodboard | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(savedTheme ? savedTheme === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    if (mounted && moodboardId) {
      loadMoodboard();
    }
  }, [mounted, moodboardId]);

  const loadMoodboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await supabaseMoodboardService.getMoodboard(moodboardId);

      if (data) {
        setMoodboardData(data);
      } else {
        setError("Moodboard not found");
      }
    } catch (err) {
      console.error("Error loading moodboard:", err);
      setError("Failed to load moodboard");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Safe clipboard copy function
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        return successful;
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  };

  const handleShare = async () => {
    const shareUrl = supabaseMoodboardService.generateShareableUrl(moodboardId);
    const shareData = {
      title: `✨ ${moodboardData?.originalMood} - MoodMuse`,
      text: `Check out this beautiful moodboard: "${moodboardData?.poeticCaption}"`,
      url: shareUrl,
    };

    // Try native sharing first
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast({
          message: "Moodboard shared successfully!",
          type: "success",
          icon: <Share2 className="w-4 h-4" />,
        });
        return;
      } catch (error) {
        // User cancelled - don't show error toast
        if (error instanceof Error && error.name !== "AbortError") {
          console.warn("Native sharing failed:", error);
        }
      }
    }

    // Fallback to clipboard
    const copySuccess = await copyToClipboard(shareUrl);
    if (copySuccess) {
      showToast({
        message: "Link copied to clipboard!",
        type: "success",
        icon: <LinkIcon className="w-4 h-4" />,
      });
    } else {
      showToast({
        message: "Failed to copy link. Please try again.",
        type: "error",
      });
    }
  };

  const createNewMood = () => {
    window.location.href = "/";
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" />
    );
  }

  return (
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
        <Header isDark={isDark} onToggleTheme={toggleTheme} />

        {loading ? (
          <main className="container mx-auto px-4 sm:px-6 py-16 md:py-24 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div
                className={`w-16 h-16 mx-auto mb-4 border-4 border-transparent border-t-purple-500 rounded-full animate-spin`}
              />
              <p
                className={`text-lg ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Loading moodboard...
              </p>
            </div>
          </main>
        ) : error || !moodboardData ? (
          <main className="container mx-auto px-4 sm:px-6 py-16 md:py-24 min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md">
              <h2
                className={`text-xl sm:text-2xl font-bold mb-4 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                {error === "Moodboard not found"
                  ? "Moodboard Not Found"
                  : "Something Went Wrong"}
              </h2>
              <p
                className={`mb-6 text-sm sm:text-base ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {error === "Moodboard not found"
                  ? "This moodboard doesn't exist or may have been removed."
                  : "We couldn't load this moodboard. Please try again later."}
              </p>
              <Link
                href="/"
                className={`inline-flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 text-sm sm:text-base ${
                  isDark
                    ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Create Your Own Moodboard</span>
              </Link>
            </div>
          </main>
        ) : (
          <>
            {/* Shared Moodboard Header */}
            <div className="container mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                  <Link
                    href="/"
                    className={`p-2 rounded-full transition-all duration-300 hover:scale-110 flex-shrink-0 ${
                      isDark
                        ? "bg-white/10 text-gray-300 hover:bg-white/20"
                        : "bg-black/10 text-gray-600 hover:bg-black/20"
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <h1
                      className={`text-base sm:text-lg font-semibold truncate ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Shared Moodboard
                    </h1>
                    <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm">
                      <span
                        className={`flex items-center space-x-1 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>{moodboardData.view_count} views</span>
                      </span>
                      <span
                        className={`${
                          isDark ? "text-gray-400" : "text-gray-500"
                        } truncate`}
                      >
                        {new Date(
                          moodboardData.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  className={`px-3 sm:px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-0 sm:space-x-2 text-sm sm:text-base flex-shrink-0 ${
                    isDark
                      ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                      : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                  }`}
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Share</span>
                </button>
              </div>
            </div>

            <main className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16 md:pb-24">
              <MoodboardResults
                isDark={isDark}
                data={moodboardData}
                onNewMood={createNewMood}
                onBackToHome={createNewMood}
                isSharedView={true}
              />
            </main>
          </>
        )}
      </div>
    </div>
  );
};

const SharedMoodboardPage = () => {
  return (
    <ToastProvider>
      <SharedMoodboardContent />
    </ToastProvider>
  );
};

export default SharedMoodboardPage;
