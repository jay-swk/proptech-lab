"use client";

import { useSimulatorStore } from "@/store/simulatorStore";
import { ZONING_PRESETS, getZoningPreset, type ZoningType } from "@/libs/simulator/calculations";

export function ZoningSelector() {
  const { zoningType, setZoningType } = useSimulatorStore();
  const preset = getZoningPreset(zoningType);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-3">
      <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        용도지역
      </label>
      <select
        value={zoningType}
        onChange={(e) => setZoningType(e.target.value as ZoningType)}
        className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {ZONING_PRESETS.map((p) => (
          <option key={p.type} value={p.type}>
            {p.label}
          </option>
        ))}
      </select>
      <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        <p>{preset.description}</p>
        {preset.type !== "custom" && (
          <p className="mt-1 font-medium text-blue-600 dark:text-blue-400">
            건폐율 {preset.maxBCR}% 이하 · 용적률 {preset.maxFAR}% 이하
          </p>
        )}
      </div>
    </div>
  );
}
