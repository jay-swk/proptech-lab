"use client";

import { useState, useEffect } from "react";

interface SliderInputProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  tooltip?: string;
  compact?: boolean;
}

export function SliderInput({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
  tooltip,
  compact,
}: SliderInputProps) {
  const [inputText, setInputText] = useState(String(value));
  const percentage = ((value - min) / (max - min)) * 100;

  useEffect(() => {
    setInputText(String(value));
  }, [value]);

  const handleBlur = () => {
    const v = Number(inputText);
    if (isNaN(v)) {
      setInputText(String(value));
      return;
    }
    const clamped = Math.min(max, Math.max(min, v));
    onChange(clamped);
    setInputText(String(clamped));
  };

  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`font-medium text-slate-700 dark:text-slate-300 ${compact ? "text-xs" : "text-sm"}`}>
            {label}
          </span>
          {tooltip && !compact && (
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs cursor-help"
              title={tooltip}
            >
              ?
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={inputText}
            min={min}
            max={max}
            step={step}
            onChange={(e) => setInputText(e.target.value)}
            onBlur={handleBlur}
            aria-label={`${label} 값 입력`}
            className={`text-right font-mono font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${compact ? "w-16 text-xs" : "w-20 text-sm"}`}
          />
          <span className={`text-slate-500 dark:text-slate-400 ${compact ? "text-xs w-5" : "text-xs w-6"}`}>
            {unit}
          </span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label} 슬라이더 (${min}${unit} ~ ${max}${unit})`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="w-full h-1.5 appearance-none cursor-pointer rounded-full bg-slate-200 dark:bg-slate-700 slider"
        style={{
          background: `linear-gradient(to right, #3b82f6 ${percentage}%, rgb(226 232 240) ${percentage}%)`,
        }}
      />
      {!compact && (
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      )}
    </div>
  );
}
