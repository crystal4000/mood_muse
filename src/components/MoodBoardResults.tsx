// components/results/MoodboardResults.tsx
import React, { useState } from "react";
import {
  Image,
  Music,
  RotateCcw,
  Share2,
  Download,
  ExternalLink,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import PlaylistTrack from "./PlaylistTrack";
import { supabaseMoodboardService } from "@/lib/supabase";
import { useToast } from "@/components/Toast";

interface Track {
  name: string;
  artist: string;
  album: string;
  duration: string;
  spotifyUrl?: string;
  spotifyId?: string;
  previewUrl?: string | null;
}

interface MoodboardData {
  originalMood: string;
  poeticCaption: string;
  playlist: Track[];
  images: string[];
}

interface MoodboardResultsProps {
  isDark: boolean;
  data: MoodboardData;
  onNewMood: () => void;
  onBackToHome: () => void;
  isSharedView?: boolean;
}

const MoodboardResults: React.FC<MoodboardResultsProps> = ({
  isDark,
  data,
  onNewMood,
  onBackToHome,
  isSharedView = false,
}) => {
  const [shareStatus, setShareStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [shareUrl, setShareUrl] = useState<string>("");
  const { showToast } = useToast();

  const openPlaylistInSpotify = () => {
    // Get tracks with Spotify IDs
    const spotifyTracks = data.playlist.filter((track) => track.spotifyId);

    if (spotifyTracks.length === 0) {
      // If no Spotify tracks, just open Spotify
      window.open("https://open.spotify.com/", "_blank");
      return;
    }

    // Create a search query with all track names
    const searchQuery = spotifyTracks
      .map((track) => `"${track.name}" "${track.artist}"`)
      .join(" OR ");

    const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(
      searchQuery
    )}`;
    window.open(spotifySearchUrl, "_blank");
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
    if (shareStatus === "saved" && shareUrl) {
      // Already saved, just share the URL
      await shareExistingUrl();
      return;
    }

    try {
      setShareStatus("saving");

      // Save moodboard to Supabase
      const moodboardId = await supabaseMoodboardService.saveMoodboard(data);
      const newShareUrl =
        supabaseMoodboardService.generateShareableUrl(moodboardId);

      setShareUrl(newShareUrl);
      setShareStatus("saved");

      // Share the URL
      await shareExistingUrl(newShareUrl);
    } catch (error) {
      console.error("Error saving moodboard:", error);
      setShareStatus("error");
      showToast({
        message: "Failed to save moodboard. Please try again.",
        type: "error",
      });
      setTimeout(() => setShareStatus("idle"), 3000);
    }
  };

  const shareExistingUrl = async (urlToShare = shareUrl) => {
    const shareData = {
      title: `✨ ${data.originalMood} - MoodMuse`,
      text: `Check out this beautiful moodboard: "${data.poeticCaption}"`,
      url: urlToShare,
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
    const copySuccess = await copyToClipboard(urlToShare);
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

  const downloadMoodboard = () => {
    try {
      const data_obj = {
        mood: data.originalMood,
        caption: data.poeticCaption,
        playlist: data.playlist,
        images: data.images,
        created: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(data_obj, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `moodboard-${data.originalMood
        .slice(0, 20)
        .replace(/[^a-zA-Z0-9]/g, "-")}.json`;
      link.click();
      URL.revokeObjectURL(url);

      showToast({
        message: "Moodboard downloaded successfully!",
        type: "success",
        icon: <Download className="w-4 h-4" />,
      });
    } catch (error) {
      showToast({
        message: "Failed to download moodboard.",
        type: "error",
      });
    }
  };

  // Count tracks available on Spotify
  const spotifyTrackCount = data.playlist.filter(
    (track) => track.spotifyUrl
  ).length;

  const getShareButtonContent = () => {
    switch (shareStatus) {
      case "saving":
        return (
          <>
            <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
            <span>Saving...</span>
          </>
        );
      case "saved":
        return (
          <>
            <Check className="w-4 h-4" />
            <span>Share Link</span>
          </>
        );
      case "error":
        return (
          <>
            <Share2 className="w-4 h-4" />
            <span>Try Again</span>
          </>
        );
      default:
        return (
          <>
            <LinkIcon className="w-4 h-4" />
            <span>Get Link</span>
          </>
        );
    }
  };

  return (
    <div className="w-full transition-all duration-700 opacity-100 transform translate-y-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header with actions */}
        {!isSharedView && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            <div className="w-full sm:w-auto">
              <h2
                className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Your
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  {" "}
                  Moodboard
                </span>
              </h2>
              <p
                className={`text-sm italic ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                &quot;{data.originalMood}&quot;
              </p>
            </div>

            <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
              <button
                onClick={onNewMood}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-0 sm:space-x-2 text-sm sm:text-base ${
                  isDark
                    ? "bg-white/10 text-gray-300 hover:bg-white/20"
                    : "bg-black/10 text-gray-600 hover:bg-black/20"
                }`}
                title="New Mood"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">New Mood</span>
              </button>

              <button
                onClick={handleShare}
                disabled={shareStatus === "saving"}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-0 sm:space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
                  shareStatus === "saved"
                    ? isDark
                      ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                      : "bg-green-100 text-green-600 hover:bg-green-200"
                    : shareStatus === "error"
                    ? isDark
                      ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                    : isDark
                    ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
                title={shareStatus === "saved" ? "Share Link" : "Get Link"}
              >
                {/* Mobile: Just icon, Desktop: Icon + text */}
                <div className="flex items-center">
                  {shareStatus === "saving" ? (
                    <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                  ) : shareStatus === "saved" ? (
                    <Check className="w-4 h-4" />
                  ) : shareStatus === "error" ? (
                    <Share2 className="w-4 h-4" />
                  ) : (
                    <LinkIcon className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline ml-2">
                    {shareStatus === "saved"
                      ? "Share Link"
                      : shareStatus === "error"
                      ? "Try Again"
                      : "Get Link"}
                  </span>
                </div>
              </button>

              <button
                onClick={downloadMoodboard}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-0 sm:space-x-2 text-sm sm:text-base ${
                  isDark
                    ? "bg-pink-500/20 text-pink-300 hover:bg-pink-500/30"
                    : "bg-pink-100 text-pink-600 hover:bg-pink-200"
                }`}
                title="Save"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Save</span>
              </button>
            </div>
          </div>
        )}

        {/* Poetic Caption */}
        <div
          className={`p-4 sm:p-8 rounded-2xl backdrop-blur-sm mb-8 sm:mb-12 text-center ${
            isDark
              ? "bg-white/5 border border-white/10 shadow-lg shadow-purple-500/10"
              : "bg-white/50 border border-white/20 shadow-lg shadow-purple-500/10"
          }`}
        >
          <blockquote
            className={`text-base sm:text-lg md:text-xl italic leading-relaxed ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            &quot;{data.poeticCaption}&quot;
          </blockquote>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 w-full">
          {/* AI Generated Images */}
          <div className="order-2 lg:order-1 w-full overflow-hidden">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Image
                className={`w-5 h-5 ${
                  isDark ? "text-pink-300" : "text-pink-600"
                }`}
              />
              <h3
                className={`text-lg sm:text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Visual Vibes
              </h3>
            </div>

            {/* Mobile: Single column, Desktop: 2x2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
              {data.images.map((image, index) => (
                <div
                  key={index}
                  className={`w-full aspect-square rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    isDark
                      ? "bg-white/5 border border-white/10"
                      : "bg-white/30 border border-white/20"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Mood visualization ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Spotify Playlist */}
          <div className="order-1 lg:order-2 w-full overflow-hidden">
            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <Music
                  className={`w-5 h-5 flex-shrink-0 ${
                    isDark ? "text-purple-300" : "text-purple-600"
                  }`}
                />
                <h3
                  className={`text-lg sm:text-xl font-bold truncate ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Your Playlist
                </h3>
                {spotifyTrackCount > 0 && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                      isDark
                        ? "bg-green-500/20 text-green-300"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {spotifyTrackCount}/{data.playlist.length}
                  </span>
                )}
              </div>
              <button
                onClick={openPlaylistInSpotify}
                className={`px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-300 hover:scale-105 flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ${
                  isDark
                    ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                    : "bg-green-100 text-green-600 hover:bg-green-200"
                }`}
              >
                <ExternalLink className="w-3 h-3" />
                <span className="hidden sm:inline">Open in Spotify</span>
                <span className="sm:hidden">Spotify</span>
              </button>
            </div>

            <div
              className={`w-full rounded-2xl backdrop-blur-sm overflow-hidden ${
                isDark
                  ? "bg-white/5 border border-white/10"
                  : "bg-white/50 border border-white/20"
              }`}
            >
              {data.playlist.map((track, index) => (
                <PlaylistTrack
                  key={index}
                  track={track}
                  isDark={isDark}
                  isLast={index === data.playlist.length - 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="text-center mt-12 sm:mt-16">
          <p
            className={`text-base sm:text-lg mb-6 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            How does this feel? ✨
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onBackToHome}
              className={`px-4 sm:px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 text-sm sm:text-base ${
                isDark
                  ? "bg-white/10 text-gray-300 hover:bg-white/20"
                  : "bg-black/10 text-gray-600 hover:bg-black/20"
              }`}
            >
              {isSharedView
                ? "Create Your Own Moodboard"
                : "Explore Another Mood"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodboardResults;
