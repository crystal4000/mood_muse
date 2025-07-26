// components/results/PlaylistTrack.tsx
import React, { useState } from "react";
import { Play, Pause, ExternalLink, Volume2 } from "lucide-react";

interface Track {
  name: string;
  artist: string;
  album: string;
  duration: string;
  spotifyUrl?: string;
  spotifyId?: string;
  previewUrl?: string | null;
}

interface PlaylistTrackProps {
  track: Track;
  isDark: boolean;
  isLast: boolean;
}

const PlaylistTrack: React.FC<PlaylistTrackProps> = ({
  track,
  isDark,
  isLast,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlayPreview = () => {
    if (!track.previewUrl) {
      // If no preview, open in Spotify
      if (track.spotifyUrl) {
        window.open(track.spotifyUrl, "_blank");
      }
      return;
    }

    if (isPlaying && audio) {
      // Stop current preview
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setAudio(null);
    } else {
      // Play preview
      const newAudio = new Audio(track.previewUrl);
      newAudio.play();
      setIsPlaying(true);
      setAudio(newAudio);

      // Stop after 30 seconds or when audio ends
      newAudio.addEventListener("ended", () => {
        setIsPlaying(false);
        setAudio(null);
      });
    }
  };

  const openInSpotify = () => {
    if (track.spotifyUrl) {
      window.open(track.spotifyUrl, "_blank");
    }
  };

  const getPlayButtonIcon = () => {
    if (!track.previewUrl && !track.spotifyUrl) {
      return <Volume2 className="w-3 h-3" />;
    }
    if (!track.previewUrl) {
      return <ExternalLink className="w-3 h-3" />;
    }
    return isPlaying ? (
      <Pause className="w-3 h-3" />
    ) : (
      <Play className="w-3 h-3" />
    );
  };

  const getPlayButtonTooltip = () => {
    if (!track.previewUrl && !track.spotifyUrl) {
      return "No preview available";
    }
    if (!track.previewUrl) {
      return "Open in Spotify";
    }
    return isPlaying ? "Stop preview" : "Play 30s preview";
  };

  return (
    <div
      className={`p-4 flex items-center space-x-4 transition-all duration-300 hover:bg-white/10 group ${
        !isLast ? "border-b" : ""
      } ${isDark ? "border-white/10" : "border-black/10"}`}
    >
      <button
        onClick={handlePlayPreview}
        disabled={!track.previewUrl && !track.spotifyUrl}
        title={getPlayButtonTooltip()}
        className={`p-2 rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
          isDark
            ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
            : "bg-purple-100 text-purple-600 hover:bg-purple-200"
        } ${isPlaying ? "animate-pulse" : ""}`}
      >
        {getPlayButtonIcon()}
      </button>

      <div className="flex-1 min-w-0">
        <h4
          className={`font-medium truncate ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          {track.name}
          {track.spotifyUrl && (
            <button
              onClick={openInSpotify}
              className={`ml-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                isDark
                  ? "text-green-300 hover:text-green-200"
                  : "text-green-600 hover:text-green-700"
              }`}
              title="Open in Spotify"
            >
              <ExternalLink className="w-3 h-3 inline" />
            </button>
          )}
        </h4>
        <p
          className={`text-sm truncate ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {track.artist} • {track.album}
          {track.previewUrl && (
            <span
              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                isDark
                  ? "bg-purple-500/20 text-purple-300"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              Preview
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <span
          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          {track.duration}
        </span>
        {track.spotifyUrl && (
          <div
            className={`w-2 h-2 rounded-full ${
              isDark ? "bg-green-400" : "bg-green-500"
            }`}
            title="Available on Spotify"
          />
        )}
      </div>
    </div>
  );
};

export default PlaylistTrack;
