"use client";

import { useToast } from "@/lib/toast-context";
import { X, CheckCircle, AlertCircle, InfoIcon } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type: string) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-950 border-green-700",
          text: "text-green-100",
          icon: "text-green-400",
          Icon: CheckCircle,
        };
      case "error":
        return {
          bg: "bg-red-950 border-red-700",
          text: "text-red-100",
          icon: "text-red-400",
          Icon: AlertCircle,
        };
      case "warning":
        return {
          bg: "bg-yellow-950 border-yellow-700",
          text: "text-yellow-100",
          icon: "text-yellow-400",
          Icon: AlertCircle,
        };
      case "info":
      default:
        return {
          bg: "bg-blue-950 border-blue-700",
          text: "text-blue-100",
          icon: "text-blue-400",
          Icon: InfoIcon,
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-9999 space-y-2 pointer-events-none">
      {toasts.map((toast) => {
        const styles = getToastStyles(toast.type);
        const Icon = styles.Icon;

        return (
          <div
            key={toast.id}
            className={`${styles.bg} ${styles.text} border rounded-lg p-4 flex items-center gap-3 max-w-sm w-full shadow-lg animate-in slide-in-from-top-2 fade-in duration-300 pointer-events-auto`}
          >
            <Icon size={20} className={styles.icon} />
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 hover:opacity-70 transition-opacity"
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
