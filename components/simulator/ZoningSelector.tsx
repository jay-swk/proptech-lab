"use client";

import { useSimulatorStore } from "@/store/simulatorStore";
import { ZONING_PRESETS, getZoningPreset, type ZoningType } from "@/libs/simulator/calculations";

export function ZoningSelector() {
  const { zoningType, setZoningType } = useSimulatorStore();
  const preset = getZoningPreset(zoningType);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        용도지역
      </label>
      <select
        value={zoningType}
        onChange={(e) => setZoningType(e.target.value as ZoningType)}
        className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {ZONING_PRESETS.map((p) => (
          <option key={p.type} value={p.type}>
            {p.label}
          </option>
        ))}
      </select>
      {preset.type !== "custom" && (
        <p className="text-xs text-blue-600 dark:text-blue-400">
          건폐율 {preset.maxBCR}% · 용적률 {preset.maxFAR}%
        </p>
      )}
    </div>
  );
}
