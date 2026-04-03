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
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex-shrink-0">
        사례:
      </span>
      {REAL_WORLD_PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => loadPreset(preset)}
          title={preset.description}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            isActive(preset)
              ? "bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750"
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
