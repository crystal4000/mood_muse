// components/ui/Toast.tsx
import React, { useState, useEffect } from "react";
import { Check, Copy, Share2, AlertCircle, X } from "lucide-react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
  icon?: React.ReactNode;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
  icon,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check theme
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(savedTheme ? savedTheme === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for animation to complete
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return isDark
          ? "bg-green-500/20 border-green-500/30 text-green-300"
          : "bg-green-100 border-green-200 text-green-700";
      case "error":
        return isDark
          ? "bg-red-500/20 border-red-500/30 text-red-300"
          : "bg-red-100 border-red-200 text-red-700";
      case "info":
      default:
        return isDark
          ? "bg-purple-500/20 border-purple-500/30 text-purple-300"
          : "bg-purple-100 border-purple-200 text-purple-700";
    }
  };

  const getDefaultIcon = () => {
    switch (type) {
      case "success":
        return <Check className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      case "info":
      default:
        return <Copy className="w-4 h-4" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
      flex items-center space-x-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg max-w-sm
      transition-all duration-300 transform
      ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}
      ${getTypeStyles()}
    `}
    >
      <div className="flex-shrink-0">{icon || getDefaultIcon()}</div>

      <div className="flex-1 text-sm font-medium">{message}</div>

      <button
        onClick={handleClose}
        className={`flex-shrink-0 p-1 rounded-full transition-colors duration-200 ${
          isDark ? "hover:bg-white/10" : "hover:bg-black/10"
        }`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

// Toast Context for managing multiple toasts
import { createContext, useContext, useCallback } from "react";

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, "onClose">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showToast = useCallback((toast: Omit<ToastProps, "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      ...toast,
      id,
      onClose: () => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      },
    };

    setToasts((prev) => [...prev, newToast]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container - Fixed positioning */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
