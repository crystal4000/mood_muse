// lib/openai.ts
import { MoodboardData, Track } from "@/types";

interface OpenAIResponse {
  poeticCaption: string;
  spotifyQuery: string;
  visualPrompt: string;
  suggestedTracks: Array<{
    name: string;
    artist: string;
    album?: string;
    duration?: string;
  }>;
}

export class OpenAIService {
  private apiKey: string;
  private baseURL = "https://api.openai.com/v1";

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
    if (!this.apiKey) {
      console.warn(
        "OpenAI API key not found. Please add NEXT_PUBLIC_OPENAI_API_KEY to your .env.local"
      );
    }
  }

  async analyzeMood(moodInput: string): Promise<OpenAIResponse> {
    if (!this.apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = `
You are a highly empathetic AI that understands human emotions deeply. A user has described their current mood as: "${moodInput}"

Please respond with a JSON object containing:

1. "poeticCaption": A beautiful, poetic 1-2 sentence interpretation of their mood. Write like you're their inner voice - empathetic, understanding, and slightly poetic. Capture the essence and beauty in their feeling.

2. "spotifyQuery": A search query string that would help find music matching this exact emotional state (3-5 words max, like "melancholy indie acoustic" or "upbeat nostalgic pop")

3. "visualPrompt": A detailed prompt for AI image generation that would create abstract, dreamy artwork representing this mood. Include colors, textures, lighting, and artistic style. Make it ethereal and emotional.

4. "suggestedTracks": An array of exactly 6 real songs that perfectly match this mood. Each song should be an object with "name", "artist", "album", and "duration" fields. Use exact song names and artists that exist.

IMPORTANT: 
- Respond only with valid JSON, no other text
- Escape all quotes properly in strings
- Do not use trailing commas
- Ensure all strings are properly quoted
- Make sure the JSON is complete and valid

Example format:
{
  "poeticCaption": "Your emotions are like...",
  "spotifyQuery": "dreamy indie folk",
  "visualPrompt": "Ethereal landscape with...",
  "suggestedTracks": [
    {
      "name": "Song Name",
      "artist": "Artist Name", 
      "album": "Album Name",
      "duration": "3:45"
    }
  ]
}
`;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are an empathetic AI that creates beautiful, poetic interpretations of human emotions and suggests matching music and art. Always respond with valid JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1200,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenAI API error: ${response.status} - ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No content received from OpenAI");
      }

      // Clean the content before parsing
      let cleanedContent = content.trim();

      // Remove any markdown code blocks if present
      cleanedContent = cleanedContent
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "");

      // Remove any text before the first { or after the last }
      const firstBrace = cleanedContent.indexOf("{");
      const lastBrace = cleanedContent.lastIndexOf("}");

      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No valid JSON found in response");
      }

      cleanedContent = cleanedContent.substring(firstBrace, lastBrace + 1);

      // Parse the JSON response
      let parsedResponse: OpenAIResponse;
      try {
        parsedResponse = JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Content that failed to parse:", cleanedContent);
        throw new Error(
          `Invalid JSON response from OpenAI: ${
            parseError instanceof Error
              ? parseError.message
              : "Unknown parsing error"
          }`
        );
      }

      // Validate the response structure
      if (
        !parsedResponse.poeticCaption ||
        !parsedResponse.spotifyQuery ||
        !parsedResponse.visualPrompt ||
        !parsedResponse.suggestedTracks
      ) {
        throw new Error(
          "Invalid response structure from OpenAI - missing required fields"
        );
      }

      // Ensure we have the right number of tracks
      if (
        !Array.isArray(parsedResponse.suggestedTracks) ||
        parsedResponse.suggestedTracks.length === 0
      ) {
        throw new Error("Invalid or empty suggested tracks array");
      }

      return parsedResponse;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw error;
    }
  }

  async generateImages(
    visualPrompt: string,
    count: number = 4
  ): Promise<string[]> {
    if (!this.apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Define 4 different Pinterest mood board styles
    const styles = [
      {
        name: "lifestyle",
        prompt: `${visualPrompt}. Pinterest-style lifestyle photography, aesthetic flat lay, cozy atmosphere, natural lighting, real objects and spaces that evoke this mood.`,
      },
      {
        name: "nature",
        prompt: `${visualPrompt}. Beautiful nature photography, landscapes, flowers, or natural scenes that capture this emotional feeling. Pinterest aesthetic, high quality photography.`,
      },
      {
        name: "interior",
        prompt: `${visualPrompt}. Aesthetic interior design, cozy spaces, room decor, or architectural details that reflect this mood. Pinterest home decor style, warm and inviting.`,
      },
      {
        name: "fashion",
        prompt: `${visualPrompt}. Fashion photography, outfit styling, accessories, or beauty shots that embody this emotional state. Pinterest fashion aesthetic, stylish and mood-driven.`,
      },
    ];

    const imageUrls: string[] = [];

    try {
      // Generate images with different Pinterest-style approaches
      for (let i = 0; i < Math.min(count, 4); i++) {
        try {
          const style = styles[i];
          const response = await fetch(`${this.baseURL}/images/generations`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
              model: "dall-e-3",
              prompt: style.prompt,
              n: 1,
              size: "1024x1024",
              quality: "standard",
              style: "natural", // Use natural style for more realistic results
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const imageUrl = data.data?.[0]?.url;
            if (imageUrl) {
              imageUrls.push(imageUrl);
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.warn(
              `Failed to generate ${style.name} image:`,
              errorData.error?.message
            );
          }

          // Add small delay between requests to avoid rate limits
          if (i < count - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.warn(`Failed to generate image ${i + 1}:`, error);
          // Continue with remaining images
        }
      }

      // If we didn't get enough images, throw an error
      if (imageUrls.length === 0) {
        throw new Error("Failed to generate any images");
      }

      return imageUrls;
    } catch (error) {
      console.error("DALL-E API Error:", error);
      throw error;
    }
  }

  // Fallback images if DALL-E fails
  getFallbackImages(): string[] {
    return [
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=400&fit=crop&crop=center",
    ];
  }

  async createMoodboard(moodInput: string): Promise<MoodboardData> {
    try {
      // Step 1: Analyze mood and get content suggestions
      const analysis = await this.analyzeMood(moodInput);

      // Step 2: Get real Spotify tracks
      let playlist: Track[] = [];

      try {
        // Import Spotify service
        const { spotifyService } = await import("./spotify");

        if (spotifyService.isConfigured()) {
          // Try to find real tracks matching AI suggestions first
          const realTracks = await spotifyService.findRealTracks(
            analysis.suggestedTracks.map((track) => ({
              name: track.name,
              artist: track.artist,
            }))
          );

          // If we got some real tracks, use them
          if (realTracks.length > 0) {
            playlist = realTracks;
          }

          // If we need more tracks, search by mood
          if (playlist.length < 6) {
            const moodTracks = await spotifyService.searchByMood(
              analysis.spotifyQuery,
              6 - playlist.length
            );
            playlist = [...playlist, ...moodTracks].slice(0, 6);
          }
        } else {
          console.warn("Spotify not configured, using AI suggestions");
          // Use AI suggestions as fallback
          playlist = analysis.suggestedTracks.map((track) => ({
            name: track.name,
            artist: track.artist,
            album: track.album || "Unknown Album",
            duration: track.duration || "3:30",
          }));
        }
      } catch (spotifyError) {
        console.warn(
          "Spotify integration failed, using AI suggestions:",
          spotifyError
        );
        // Use AI suggestions as fallback
        playlist = analysis.suggestedTracks.map((track) => ({
          name: track.name,
          artist: track.artist,
          album: track.album || "Unknown Album",
          duration: track.duration || "3:30",
        }));
      }

      // Step 3: Generate images (with fallback)
      let images: string[];
      try {
        images = await this.generateImages(analysis.visualPrompt, 4);
        // Ensure we have at least some images
        if (images.length === 0) {
          images = this.getFallbackImages();
        }
      } catch (imageError) {
        console.warn(
          "Image generation failed, using fallback images:",
          imageError
        );
        images = this.getFallbackImages();
      }

      // Step 4: Format the response
      const moodboardData: MoodboardData = {
        originalMood: moodInput,
        poeticCaption: analysis.poeticCaption,
        playlist: playlist,
        images: images,
      };

      return moodboardData;
    } catch (error) {
      console.error("Error creating moodboard:", error);
      throw new Error(
        `Failed to create moodboard: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

// Export a singleton instance
export const openaiService = new OpenAIService();
