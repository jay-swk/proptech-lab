"use client";

import { useSimulatorStore } from "@/store/simulatorStore";
import { ResultCard } from "@/components/ui/ResultCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ValidationBanner } from "@/components/ui/ValidationBanner";

export function OutputPanel() {
  const { results, params } = useSimulatorStore();
  const { buildingArea, totalFloorArea, maxFloors, utilizationRate, warnings } =
    results;

  const hasError = warnings.some((w) => w.severity === "error");

  return (
    <div className="space-y-4">
      <ValidationBanner warnings={warnings} />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          label="건축면적"
          value={buildingArea.toFixed(1)}
          unit="m²"
          description={`대지의 ${params.buildingCoverageRatio}% 점유`}
        />
        <ResultCard
          label="용적률 허용 연면적"
          value={totalFloorArea.toFixed(1)}
          unit="m²"
          description={`용적률 ${params.floorAreaRatio}% 기준`}
        />
        <ResultCard
          label="최대 가능 층수"
          value={maxFloors}
          unit="층"
          highlight
          description={`용적률 한도 내 최대`}
        />
        <ResultCard
          label="실제 연면적"
          value={results.actualFloorArea.toFixed(1)}
          unit="m²"
          description={`${params.floors}층 × 건축면적`}
        />
      </div>

      <div
        className={`rounded-xl p-4 border ${
          hasError
            ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        }`}
      >
        <ProgressBar
          label="용적률 활용도"
          value={utilizationRate}
          max={100}
        />
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          허용된 연면적 중 실제로 사용하는 비율입니다.
        </p>
      </div>
    </div>
  );
}
