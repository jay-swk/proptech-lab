"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  label: string;
  showValue?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const isOver = value > max;
  const isLow = value < 50;

  const barColor = isOver
    ? "bg-red-500"
    : isLow
      ? "bg-amber-400"
      : "bg-emerald-500";

  const textColor = isOver
    ? "text-red-600 dark:text-red-400"
    : isLow
      ? "text-amber-600 dark:text-amber-400"
      : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
        {showValue && (
          <span className={`text-sm font-bold font-mono ${textColor}`}>
            {isOver ? `한도 초과 (${value.toFixed(1)}%)` : `${value.toFixed(1)}%`}
          </span>
        )}
      </div>
      <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-400">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
