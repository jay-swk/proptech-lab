"use client";

import { Warning } from "@/libs/simulator/calculations";

interface ValidationBannerProps {
  warnings: Warning[];
}

const severityConfig = {
  error: {
    bg: "bg-red-50 dark:bg-red-950",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-300",
    icon: "✕",
    iconBg: "bg-red-100 dark:bg-red-900",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-300",
    icon: "!",
    iconBg: "bg-amber-100 dark:bg-amber-900",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-300",
    icon: "i",
    iconBg: "bg-blue-100 dark:bg-blue-900",
  },
};

export function ValidationBanner({ warnings }: ValidationBannerProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="space-y-2">
      {warnings.map((warning, i) => {
        const cfg = severityConfig[warning.severity];
        return (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.bg} ${cfg.border}`}
          >
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold flex-shrink-0 mt-0.5 ${cfg.iconBg} ${cfg.text}`}
            >
              {cfg.icon}
            </span>
            <p className={`text-sm ${cfg.text}`}>{warning.message}</p>
          </div>
        );
      })}
    </div>
  );
}
