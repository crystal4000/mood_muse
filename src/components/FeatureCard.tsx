// components/home/FeatureCard.tsx
import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isDark: boolean;
  colorScheme: "purple" | "pink" | "indigo";
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  isDark,
  colorScheme,
}) => {
  const getColorClasses = () => {
    const colors = {
      purple: {
        bg: isDark ? "bg-purple-500/20" : "bg-purple-100",
        text: isDark ? "text-purple-300" : "text-purple-600",
        shadow: "shadow-purple-500/10",
      },
      pink: {
        bg: isDark ? "bg-pink-500/20" : "bg-pink-100",
        text: isDark ? "text-pink-300" : "text-pink-600",
        shadow: "shadow-pink-500/10",
      },
      indigo: {
        bg: isDark ? "bg-indigo-500/20" : "bg-indigo-100",
        text: isDark ? "text-indigo-300" : "text-indigo-600",
        shadow: "shadow-indigo-500/10",
      },
    };
    return colors[colorScheme];
  };

  const colorClasses = getColorClasses();

  return (
    <div
      className={`p-8 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        isDark
          ? `bg-white/5 border border-white/10 shadow-lg ${colorClasses.shadow}`
          : `bg-white/50 border border-white/20 shadow-lg ${colorClasses.shadow}`
      }`}
    >
      <div className={`inline-flex p-3 rounded-xl mb-4 ${colorClasses.bg}`}>
        <Icon className={`w-6 h-6 ${colorClasses.text}`} />
      </div>
      <h3
        className={`text-xl font-bold mb-3 ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        {title}
      </h3>
      <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
