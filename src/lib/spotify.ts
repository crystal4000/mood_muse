import { Track } from "@/types";

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string };
  duration_ms: number;
  external_urls: { spotify: string };
  preview_url: string | null;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

export class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
    this.clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || "";

    if (!this.clientId || !this.clientSecret) {
      console.warn(
        "Spotify credentials not found. Please add NEXT_PUBLIC_SPOTIFY_CLIENT_ID and NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET to your .env.local"
      );
    }
  }

  // Get access token using Client Credentials flow (for search only)
  private async getAccessToken(): Promise<string> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error("Spotify credentials not configured");
    }

    // Check if current token is still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(
            `${this.clientId}:${this.clientSecret}`
          )}`,
        },
        body: "grant_type=client_credentials",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Spotify auth error: ${response.status} - ${
            errorData.error_description || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000; // Refresh 1 minute early

      return this.accessToken!;
    } catch (error) {
      console.error("Spotify authentication error:", error);
      throw error;
    }
  }

  // Search for a track
  async searchTrack(query: string): Promise<SpotifyTrack | null> {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Spotify search error: ${response.status} - ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data: SpotifySearchResponse = await response.json();
      return data.tracks.items[0] || null;
    } catch (error) {
      console.error("Spotify search error:", error);
      return null;
    }
  }

  // Search for multiple tracks based on AI suggestions
  async findRealTracks(
    suggestedTracks: Array<{ name: string; artist: string }>
  ): Promise<Track[]> {
    const realTracks: Track[] = [];

    for (const suggested of suggestedTracks) {
      try {
        // Try exact match first
        let query = `track:"${suggested.name}" artist:"${suggested.artist}"`;
        let spotifyTrack = await this.searchTrack(query);

        // If no exact match, try broader search
        if (!spotifyTrack) {
          query = `${suggested.name} ${suggested.artist}`;
          spotifyTrack = await this.searchTrack(query);
        }

        if (spotifyTrack) {
          realTracks.push({
            name: spotifyTrack.name,
            artist: spotifyTrack.artists.map((a) => a.name).join(", "),
            album: spotifyTrack.album.name,
            duration: this.formatDuration(spotifyTrack.duration_ms),
            spotifyUrl: spotifyTrack.external_urls.spotify,
            spotifyId: spotifyTrack.id,
            previewUrl: spotifyTrack.preview_url,
          });
        } else {
          // Keep the AI suggestion if no Spotify match found
          realTracks.push({
            name: suggested.name,
            artist: suggested.artist,
            album: "Unknown Album",
            duration: "3:30",
          });
        }

        // Small delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(
          `Failed to find track: ${suggested.name} by ${suggested.artist}`,
          error
        );
        // Keep the AI suggestion as fallback
        realTracks.push({
          name: suggested.name,
          artist: suggested.artist,
          album: "Unknown Album",
          duration: "3:30",
        });
      }
    }

    return realTracks;
  }

  // Search for tracks by mood/genre
  async searchByMood(
    spotifyQuery: string,
    limit: number = 6
  ): Promise<Track[]> {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          spotifyQuery
        )}&type=track&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Spotify search error: ${response.status} - ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data: SpotifySearchResponse = await response.json();

      return data.tracks.items.map((track) => ({
        name: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        album: track.album.name,
        duration: this.formatDuration(track.duration_ms),
        spotifyUrl: track.external_urls.spotify,
        spotifyId: track.id,
        previewUrl: track.preview_url,
      }));
    } catch (error) {
      console.error("Spotify mood search error:", error);
      throw error;
    }
  }

  // Helper function to format duration
  private formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  // Generate Spotify playlist URL (for sharing)
  generatePlaylistUrl(tracks: Track[]): string {
    const trackIds = tracks
      .filter((track) => track.spotifyId)
      .map((track) => track.spotifyId)
      .join(",");

    if (trackIds) {
      return `https://open.spotify.com/playlist/temp?tracks=${trackIds}`;
    }

    return "https://open.spotify.com/";
  }

  // Check if Spotify is available
  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }
}

// Export singleton instance
export const spotifyService = new SpotifyService();
