export interface Track {
  name: string;
  artist: string;
  album: string;
  duration: string;
  spotifyUrl?: string;
  spotifyId?: string;
  previewUrl?: string | null;
}

export interface MoodboardData {
  originalMood: string;
  poeticCaption: string;
  playlist: Track[];
  images: string[];
}

export type ViewState = "landing" | "form" | "results";
