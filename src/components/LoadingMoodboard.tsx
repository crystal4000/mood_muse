import React, { useState, useEffect } from "react";
import { Sparkles, Brain, Palette, Music } from "lucide-react";

interface LoadingMoodboardProps {
  isDark: boolean;
  moodInput: string;
}

const LoadingMoodboard: React.FC<LoadingMoodboardProps> = ({
  isDark,
  moodInput,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Brain,
      title: "Understanding your emotions",
      description: "AI is analyzing the depth of your feelings...",
    },
    {
      icon: Music,
      title: "Curating your playlist",
      description: "Finding songs that resonate with your soul...",
    },
    {
      icon: Palette,
      title: "Creating visual art",
      description: "Generating dreamy images that capture your mood...",
    },
    {
      icon: Sparkles,
      title: "Weaving it all together",
      description: "Crafting your personal moodboard...",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        {/* Mood Display */}
        <div
          className={`mb-12 p-6 rounded-2xl backdrop-blur-sm ${
            isDark
              ? "bg-white/5 border border-white/10"
              : "bg-white/50 border border-white/20"
          }`}
        >
          <p
            className={`text-sm mb-2 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Creating moodboard for:
          </p>
          <p
            className={`text-lg italic ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            &quot;{moodInput}&quot;
          </p>
        </div>

        {/* Loading Animation */}
        <div className="relative mb-12">
          {/* Central circle */}
          <div
            className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center relative ${
              isDark ? "bg-purple-500/20" : "bg-purple-100"
            }`}
          >
            {/* Rotating border */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>

            {/* Current step icon */}
            {React.createElement(steps[currentStep].icon, {
              className: `w-12 h-12 ${
                isDark ? "text-purple-300" : "text-purple-600"
              }`,
            })}
          </div>

          {/* Step indicators */}
          <div className="flex justify-center space-x-3 mt-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === currentStep
                    ? "bg-purple-500 scale-125"
                    : index < currentStep
                    ? "bg-purple-300"
                    : isDark
                    ? "bg-gray-600"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current Step Info */}
        <div className="space-y-4">
          <h3
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            {steps[currentStep].title}
          </h3>
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {steps[currentStep].description}
          </p>
        </div>

        {/* Floating elements */}
        <div className="relative mt-16">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-pulse ${
                isDark ? "bg-purple-400" : "bg-purple-300"
              }`}
              style={{
                left: `${20 + i * 12}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>

        {/* Estimated time */}
        <div className="mt-12">
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            This usually takes 30-60 seconds ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingMoodboard;
