// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { MoodboardData } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export interface SharedMoodboard extends MoodboardData {
  id: string;
  created_at: string;
  view_count: number;
}

export class SupabaseMoodboardService {
  // Generate a unique ID for the moodboard
  private generateMoodboardId(): string {
    const adjectives = [
      "dreamy",
      "cosmic",
      "ethereal",
      "vibrant",
      "serene",
      "mystic",
      "golden",
      "velvet",
      "crystal",
      "lunar",
    ];
    const nouns = [
      "melody",
      "whisper",
      "echo",
      "rhythm",
      "harmony",
      "breeze",
      "glow",
      "spark",
      "wave",
      "muse",
    ];

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 999) + 1;

    return `${adjective}-${noun}-${number}`;
  }

  // Save moodboard to Supabase
  async saveMoodboard(moodboardData: MoodboardData): Promise<string> {
    try {
      const moodboardId = this.generateMoodboardId();

      const { data, error } = await supabase.from("moodboards").insert([
        {
          id: moodboardId,
          original_mood: moodboardData.originalMood,
          poetic_caption: moodboardData.poeticCaption,
          playlist: moodboardData.playlist,
          images: moodboardData.images,
          view_count: 0,
        },
      ]);

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Failed to save moodboard: ${error.message}`);
      }

      return moodboardId;
    } catch (error) {
      console.error("Error saving moodboard:", error);
      throw error;
    }
  }

  // Get moodboard by ID
  async getMoodboard(moodboardId: string): Promise<SharedMoodboard | null> {
    try {
      // First, get the moodboard
      const { data, error } = await supabase
        .from("moodboards")
        .select("*")
        .eq("id", moodboardId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned
          return null;
        }
        throw new Error(`Failed to load moodboard: ${error.message}`);
      }

      if (!data) {
        return null;
      }

      // Increment view count
      const { error: updateError } = await supabase
        .from("moodboards")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", moodboardId);

      if (updateError) {
        console.warn("Failed to update view count:", updateError);
      }

      // Return the formatted moodboard data
      return {
        id: data.id,
        originalMood: data.original_mood,
        poeticCaption: data.poetic_caption,
        playlist: data.playlist,
        images: data.images,
        created_at: data.created_at,
        view_count: (data.view_count || 0) + 1,
      };
    } catch (error) {
      console.error("Error getting moodboard:", error);
      throw error;
    }
  }

  // Generate shareable URL
  generateShareableUrl(moodboardId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    return `${baseUrl}/board/${moodboardId}`;
  }

  // Check if Supabase is configured
  isConfigured(): boolean {
    return !!(supabaseUrl && supabaseKey);
  }

  // Initialize database table (call this once to create the table)
  async initializeTable(): Promise<void> {}
}

// Export singleton instance
export const supabaseMoodboardService = new SupabaseMoodboardService();

export { supabase };
