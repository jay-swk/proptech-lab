"use client";

import { useSimulatorStore } from "@/store/simulatorStore";
import { PARAM_RANGES, getZoningPreset } from "@/libs/simulator/calculations";
import { SliderInput } from "@/components/ui/SliderInput";

const PARAM_CONFIG = {
  landArea: {
    label: "대지면적",
    unit: "m²",
    tooltip: "건물을 지을 수 있는 땅의 면적입니다. 330m²는 약 100평입니다.",
  },
  floorAreaRatio: {
    label: "용적률",
    unit: "%",
    tooltip:
      "대지면적 대비 건물 연면적의 비율입니다. 용도지역마다 법정 한도가 다릅니다.",
  },
  buildingCoverageRatio: {
    label: "건폐율",
    unit: "%",
    tooltip:
      "대지면적 대비 건물 바닥면적(건축면적)의 비율입니다. 건물이 땅을 얼마나 덮는지를 나타냅니다.",
  },
  floors: {
    label: "층수",
    unit: "층",
    tooltip: "건물의 층수입니다. 용적률 한도를 초과하면 경고가 표시됩니다.",
  },
} as const;

export function InputPanel() {
  const { params, zoningType, updateParam, resetToDefault } =
    useSimulatorStore();

  const preset = getZoningPreset(zoningType);

  const dynamicRanges = {
    ...PARAM_RANGES,
    floorAreaRatio: {
      ...PARAM_RANGES.floorAreaRatio,
      max: preset.maxFAR,
    },
    buildingCoverageRatio: {
      ...PARAM_RANGES.buildingCoverageRatio,
      max: preset.maxBCR,
    },
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          건물 조건 설정
        </h2>
        <button
          onClick={resetToDefault}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-2 transition-colors"
        >
          기본값 초기화
        </button>
      </div>

      {(Object.keys(PARAM_CONFIG) as Array<keyof typeof PARAM_CONFIG>).map(
        (key) => {
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
            />
          );
        },
      )}
    </div>
  );
}
