"use client";

import { useSimulatorStore } from "@/store/simulatorStore";
import { REAL_WORLD_PRESETS } from "@/libs/simulator/calculations";

export function RealWorldPresets() {
  const { params, zoningType, loadPreset } = useSimulatorStore();

  const isActive = (preset: (typeof REAL_WORLD_PRESETS)[number]) =>
    preset.zoningType === zoningType &&
    preset.params.landArea === params.landArea &&
    preset.params.floorAreaRatio === params.floorAreaRatio &&
    preset.params.buildingCoverageRatio === params.buildingCoverageRatio &&
    preset.params.floors === params.floors;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-3">
      <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        실제 사례로 시작하기
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {REAL_WORLD_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => loadPreset(preset)}
            className={`text-left px-3 py-2.5 rounded-lg border text-xs transition-colors ${
              isActive(preset)
                ? "bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750"
            }`}
          >
            <span className="font-medium block">{preset.label}</span>
            <span className="text-slate-400 dark:text-slate-500 block mt-0.5">
              {preset.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
