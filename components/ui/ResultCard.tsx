"use client";

interface ResultCardProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  description?: string;
}

export function ResultCard({
  label,
  value,
  unit,
  highlight = false,
  description,
}: ResultCardProps) {
  return (
    <div
      className={`rounded-xl p-4 border transition-all duration-200 ${
        highlight
          ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      }`}
    >
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span
          className={`text-2xl font-bold font-mono tabular-nums ${
            highlight
              ? "text-blue-600 dark:text-blue-400"
              : "text-slate-800 dark:text-slate-100"
          }`}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {unit && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {description}
        </p>
      )}
    </div>
  );
}
