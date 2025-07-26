// components/home/LandingSection.tsx
import React from "react";
import { ArrowRight, Music, Palette, Heart, Zap } from "lucide-react";
import FeatureCard from "./FeatureCard";

interface LandingSectionProps {
  isDark: boolean;
  onStartMoodForm: () => void;
}

const LandingSection: React.FC<LandingSectionProps> = ({
  isDark,
  onStartMoodForm,
}) => {
  return (
    <div className="w-full transition-all duration-700 opacity-100 transform translate-y-0">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto">
        {/* Animated title */}
        <div className="mb-8">
          <h1
            className={`text-5xl md:text-7xl font-bold mb-6 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "0s" }}
            >
              Your
            </span>
            <span
              className="inline-block animate-bounce mx-4"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                emotions
              </span>
            </span>
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "0.2s" }}
            >
              in
            </span>
          </h1>
          <h2
            className={`text-4xl md:text-6xl font-bold ${
              isDark ? "text-purple-300" : "text-purple-600"
            }`}
          >
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "0.3s" }}
            >
              color
            </span>
            <span
              className="inline-block animate-bounce mx-4"
              style={{ animationDelay: "0.4s" }}
            >
              and
            </span>
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              sound
            </span>
          </h2>
        </div>

        {/* Subtitle */}
        <p
          className={`text-xl md:text-2xl mb-12 leading-relaxed ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Transform your feelings into personalized Spotify playlists and dreamy
          AI-generated art.
          <br />
          <span className="italic">
            Because sometimes words aren&apos;t enough.
          </span>
        </p>

        {/* CTA Button */}
        <div className="mb-16">
          <button
            onClick={onStartMoodForm}
            className={`group relative px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
              isDark
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>Express Your Mood</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur opacity-75 group-hover:opacity-100 transition-opacity -z-10" />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <FeatureCard
          icon={Music}
          title="Curated Playlists"
          description="AI-powered Spotify playlists that perfectly capture your emotional state and vibe."
          isDark={isDark}
          colorScheme="purple"
        />
        <FeatureCard
          icon={Palette}
          title="Visual Moodboards"
          description="Dreamy, abstract AI art that visualizes your emotions in stunning detail."
          isDark={isDark}
          colorScheme="pink"
        />
        <FeatureCard
          icon={Heart}
          title="Save & Share"
          description="Capture your mood moments and share them with friends who understand."
          isDark={isDark}
          colorScheme="indigo"
        />
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-20">
        <p
          className={`text-lg mb-6 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Ready to explore your inner world?
        </p>
        <div className="flex justify-center space-x-2">
          <Zap
            className={`w-5 h-5 ${
              isDark ? "text-yellow-400" : "text-purple-500"
            } animate-pulse`}
          />
          <span
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Built with love at CS Girlies Global Hackathon 💜
          </span>
          <Zap
            className={`w-5 h-5 ${
              isDark ? "text-yellow-400" : "text-purple-500"
            } animate-pulse`}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingSection;
