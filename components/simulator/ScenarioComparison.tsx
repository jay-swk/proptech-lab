"use client";

import { useSimulatorStore } from "@/store/simulatorStore";
import { formatKrw, getZoningPreset } from "@/libs/simulator/calculations";

export function ScenarioComparison() {
  const {
    zoningType,
    results,
    profitResults,
    savedScenario,
    saveScenario,
    clearScenario,
  } = useSimulatorStore();

  const currentLabel = getZoningPreset(zoningType).label;

  if (!savedScenario) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 p-6 text-center space-y-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          현재 조건을 저장하고, 다른 조건과 비교해보세요.
        </p>
        <button
          onClick={() => saveScenario()}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          현재 시나리오 저장
        </button>
      </div>
    );
  }

  const rows: {
    label: string;
    savedVal: string;
    currentVal: string;
    better: "saved" | "current" | "none";
  }[] = [
    {
      label: "용도지역",
      savedVal: getZoningPreset(savedScenario.zoningType).label,
      currentVal: currentLabel,
      better: "none",
    },
    {
      label: "연면적",
      savedVal: `${savedScenario.results.actualFloorArea.toFixed(0)}m²`,
      currentVal: `${results.actualFloorArea.toFixed(0)}m²`,
      better:
        results.actualFloorArea > savedScenario.results.actualFloorArea
          ? "current"
          : results.actualFloorArea < savedScenario.results.actualFloorArea
            ? "saved"
            : "none",
    },
    {
      label: "예상 건축비",
      savedVal: formatKrw(savedScenario.profitResults.totalConstructionCost),
      currentVal: formatKrw(profitResults.totalConstructionCost),
      better:
        profitResults.totalConstructionCost <
        savedScenario.profitResults.totalConstructionCost
          ? "current"
          : profitResults.totalConstructionCost >
              savedScenario.profitResults.totalConstructionCost
            ? "saved"
            : "none",
    },
    {
      label: "월 임대수익",
      savedVal: formatKrw(savedScenario.profitResults.monthlyRentalIncome),
      currentVal: formatKrw(profitResults.monthlyRentalIncome),
      better:
        profitResults.monthlyRentalIncome >
        savedScenario.profitResults.monthlyRentalIncome
          ? "current"
          : profitResults.monthlyRentalIncome <
              savedScenario.profitResults.monthlyRentalIncome
            ? "saved"
            : "none",
    },
    {
      label: "표면 수익률",
      savedVal:
        savedScenario.profitResults.surfaceYield > 0
          ? `${savedScenario.profitResults.surfaceYield.toFixed(1)}%`
          : "산정 불가",
      currentVal:
        profitResults.surfaceYield > 0
          ? `${profitResults.surfaceYield.toFixed(1)}%`
          : "산정 불가",
      better:
        profitResults.surfaceYield > savedScenario.profitResults.surfaceYield
          ? "current"
          : profitResults.surfaceYield <
              savedScenario.profitResults.surfaceYield
            ? "saved"
            : "none",
    },
    {
      label: "투자회수",
      savedVal:
        savedScenario.profitResults.paybackYears > 0
          ? `${savedScenario.profitResults.paybackYears.toFixed(1)}년`
          : "산정 불가",
      currentVal:
        profitResults.paybackYears > 0
          ? `${profitResults.paybackYears.toFixed(1)}년`
          : "산정 불가",
      better:
        profitResults.paybackYears > 0 &&
        savedScenario.profitResults.paybackYears > 0
          ? profitResults.paybackYears <
            savedScenario.profitResults.paybackYears
            ? "current"
            : profitResults.paybackYears >
                savedScenario.profitResults.paybackYears
              ? "saved"
              : "none"
          : "none",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          시나리오 비교
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => saveScenario()}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            현재로 교체
          </button>
          <button
            onClick={clearScenario}
            className="text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400"
          >
            비교 삭제
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left text-xs font-medium text-slate-400 pb-2 pr-4">
                항목
              </th>
              <th className="text-right text-xs font-medium text-slate-400 pb-2 px-2">
                저장 ({savedScenario.label})
              </th>
              <th className="text-right text-xs font-medium text-blue-500 pb-2 pl-2">
                현재 ({currentLabel})
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-slate-100 dark:border-slate-800"
              >
                <td className="py-2 pr-4 text-xs text-slate-500 dark:text-slate-400">
                  {row.label}
                </td>
                <td
                  className={`py-2 px-2 text-right font-mono text-xs ${
                    row.better === "saved"
                      ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {row.savedVal}
                  {row.better === "saved" && " ▲"}
                </td>
                <td
                  className={`py-2 pl-2 text-right font-mono text-xs ${
                    row.better === "current"
                      ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {row.currentVal}
                  {row.better === "current" && " ▲"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
