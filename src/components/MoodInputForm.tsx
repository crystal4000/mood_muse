// components/mood/MoodInputForm.tsx
import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

interface MoodInputFormProps {
  isDark: boolean;
  moodInput: string;
  onMoodInputChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const MoodInputForm: React.FC<MoodInputFormProps> = ({
  isDark,
  moodInput,
  onMoodInputChange,
  onBack,
  onSubmit,
}) => {
  const exampleMoods = [
    "melancholy but hopeful",
    "chaotic energy, can't sit still",
    "missing someone deeply",
    "feeling like main character",
    "soft and dreamy",
    "overwhelmed but grateful",
  ];

  return (
    <div className="w-full transition-all duration-700 opacity-100 transform translate-y-0">
      <div className="max-w-3xl mx-auto text-center">
        {/* Back button */}
        <button
          onClick={onBack}
          className={`mb-8 flex items-center space-x-2 mx-auto px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
            isDark
              ? "bg-white/10 text-gray-300 hover:bg-white/20"
              : "bg-black/10 text-gray-600 hover:bg-black/20"
          }`}
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back</span>
        </button>

        {/* Form Header */}
        <div className="mb-12">
          <h2
            className={`text-4xl md:text-6xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            How are you
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              feeling
            </span>
            ?
          </h2>
          <p
            className={`text-lg md:text-xl ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Describe your mood in your own words. Be as poetic, raw, or specific
            as you&apos;d like.
          </p>
        </div>

        {/* Mood Input */}
        <div className="mb-8">
          <div
            className={`relative rounded-2xl backdrop-blur-sm ${
              isDark
                ? "bg-white/5 border border-white/10"
                : "bg-white/50 border border-white/20"
            }`}
          >
            <textarea
              value={moodInput}
              onChange={(e) => onMoodInputChange(e.target.value)}
              placeholder="I feel nostalgic, like missing someone I never knew... or maybe I'm feeling chaotic but soft, like a storm made of cotton candy..."
              className={`w-full h-40 p-6 bg-transparent border-none outline-none resize-none text-lg placeholder:italic ${
                isDark
                  ? "text-white placeholder:text-gray-400"
                  : "text-gray-800 placeholder:text-gray-500"
              }`}
              maxLength={500}
            />
            <div
              className={`absolute bottom-4 right-4 text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {moodInput.length}/500
            </div>
          </div>
        </div>

        {/* Example moods */}
        <div className="mb-12">
          <p
            className={`text-sm mb-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Need inspiration? Try these:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {exampleMoods.map((mood) => (
              <button
                key={mood}
                onClick={() => onMoodInputChange(mood)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
              >
                &quot;{mood}&quot;
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          disabled={!moodInput.trim()}
          onClick={onSubmit}
          className={`px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
            isDark
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
              : "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
          }`}
        >
          <span className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>Create My Moodboard</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default MoodInputForm;
