"use client";

import { useSimulatorStore } from "@/store/simulatorStore";
import { PARAM_RANGES, getZoningPreset } from "@/libs/simulator/calculations";
import { SliderInput } from "@/components/ui/SliderInput";
import { ZoningSelector } from "./ZoningSelector";

const PARAM_CONFIG = {
  landArea: { label: "대지면적", unit: "m²", tooltip: "건물을 지을 수 있는 땅의 면적" },
  floorAreaRatio: { label: "용적률", unit: "%", tooltip: "대지면적 대비 연면적 비율" },
  buildingCoverageRatio: { label: "건폐율", unit: "%", tooltip: "대지면적 대비 건축면적 비율" },
  floors: { label: "층수", unit: "층", tooltip: "건물의 층수" },
} as const;

export function InputPanel() {
  const { params, zoningType, updateParam, resetToDefault, saveScenario } =
    useSimulatorStore();

  const preset = getZoningPreset(zoningType);
  const dynamicRanges = {
    ...PARAM_RANGES,
    floorAreaRatio: { ...PARAM_RANGES.floorAreaRatio, max: preset.maxFAR },
    buildingCoverageRatio: { ...PARAM_RANGES.buildingCoverageRatio, max: preset.maxBCR },
  };

  return (
    <div className="space-y-4">
      <ZoningSelector />

      <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-3">
        {(Object.keys(PARAM_CONFIG) as Array<keyof typeof PARAM_CONFIG>).map((key) => {
          const cfg = PARAM_CONFIG[key];
          const range = dynamicRanges[key];
          return (
            <SliderInput
              key={key}
              label={cfg.label}
              unit={cfg.unit}
              value={params[key]}
              min={range.min}
              max={range.max}
              step={range.step}
              onChange={(v) => updateParam(key, v)}
              tooltip={cfg.tooltip}
              compact
            />
          );
        })}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => saveScenario()}
          className="flex-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg py-1.5 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
        >
          시나리오 저장
        </button>
        <button
          onClick={resetToDefault}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-2"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
