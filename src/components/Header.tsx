import React from "react";
import { Moon, Sun, Sparkles } from "lucide-react";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme }) => {
  return (
    <header className="flex justify-between items-center p-6 md:p-8">
      <div className="flex items-center space-x-2">
        <div
          className={`p-2 rounded-xl ${
            isDark ? "bg-purple-500/20" : "bg-purple-100"
          }`}
        >
          <Sparkles
            className={`w-6 h-6 ${
              isDark ? "text-purple-300" : "text-purple-600"
            }`}
          />
        </div>
        <span
          className={`text-xl font-bold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          MoodMuse
        </span>
      </div>

      <button
        onClick={onToggleTheme}
        className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
          isDark
            ? "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
            : "bg-purple-100 text-purple-600 hover:bg-purple-200"
        }`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  );
};

export default Header;
