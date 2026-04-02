"use client";

import { useSimulatorStore } from "@/store/simulatorStore";
import { interpretScenario } from "@/libs/simulator/calculations";

export function ScenarioInterpretation() {
  const { results, params } = useSimulatorStore();
  const text = interpretScenario(results);

  const sqmToPhyeong = (sqm: number) => (sqm / 3.3058).toFixed(1);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl border border-blue-100 dark:border-blue-900 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">💡</span>
        <div>
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
            시나리오 해석
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
            {text}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-blue-100 dark:border-blue-900">
        <div className="text-center">
          <p className="text-xs text-blue-400 dark:text-blue-500">대지면적</p>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            {params.landArea}m²
          </p>
          <p className="text-xs text-blue-400">
            {sqmToPhyeong(params.landArea)}평
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-blue-400 dark:text-blue-500">건축면적</p>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            {results.buildingArea.toFixed(1)}m²
          </p>
          <p className="text-xs text-blue-400">
            {sqmToPhyeong(results.buildingArea)}평
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-blue-400 dark:text-blue-500">실 연면적</p>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            {results.actualFloorArea.toFixed(1)}m²
          </p>
          <p className="text-xs text-blue-400">
            {sqmToPhyeong(results.actualFloorArea)}평
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-blue-400 dark:text-blue-500">최대층수</p>
          {results.maxFloors === 0 ? (
            <>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                불가
              </p>
              <p className="text-xs text-red-400">건물 불가 조건</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                {results.maxFloors}층
              </p>
              <p className="text-xs text-blue-400">허용 한도</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
