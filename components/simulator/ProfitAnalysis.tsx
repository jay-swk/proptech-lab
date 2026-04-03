"use client";

import { useSimulatorStore } from "@/store/simulatorStore";
import { formatKrw, SQM_PER_PYEONG } from "@/libs/simulator/calculations";

export function ProfitAnalysis() {
  const { results, profitParams, profitResults, updateProfitParam } =
    useSimulatorStore();

  const hasError = results.warnings.some((w) => w.severity === "error");
  const pyeong = results.actualFloorArea / SQM_PER_PYEONG;

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-2xl border border-emerald-100 dark:border-emerald-900 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
        <span className="text-lg">&#x1f4b0;</span>
        수익성 간이 분석
      </h3>

      {/* 단가 입력 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-emerald-600 dark:text-emerald-400 mb-1">
            평당 건축비 (만원)
          </label>
          <input
            type="number"
            min={0}
            step={10}
            value={profitParams.constructionCostPerPyeong}
            onChange={(e) =>
              updateProfitParam(
                "constructionCostPerPyeong",
                Math.max(0, Number(e.target.value)),
              )
            }
            className="w-full text-sm font-mono bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 rounded px-2 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs text-emerald-600 dark:text-emerald-400 mb-1">
            평당 월임대료 (만원)
          </label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={profitParams.monthlyRentPerPyeong}
            onChange={(e) =>
              updateProfitParam(
                "monthlyRentPerPyeong",
                Math.max(0, Number(e.target.value)),
              )
            }
            className="w-full text-sm font-mono bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 rounded px-2 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* 결과 */}
      {hasError ? (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-lg p-3 text-center">
          건물 불가 조건에서는 수익을 산정할 수 없습니다.
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-emerald-500 dark:text-emerald-500">
            연면적 {results.actualFloorArea.toFixed(0)}m² ({pyeong.toFixed(1)}평) 기준
          </p>
          <div className="divide-y divide-emerald-100 dark:divide-emerald-900">
            <Row
              label="예상 건축비"
              value={formatKrw(profitResults.totalConstructionCost)}
            />
            <Row
              label="예상 월 임대수익"
              value={formatKrw(profitResults.monthlyRentalIncome)}
            />
            <Row
              label="예상 연 임대수익"
              value={formatKrw(profitResults.annualRentalIncome)}
            />
            <Row
              label="투자회수 기간"
              value={
                profitResults.paybackYears > 0
                  ? `${profitResults.paybackYears.toFixed(1)}년`
                  : "산정 불가"
              }
            />
            <Row
              label="표면 수익률"
              value={
                profitResults.surfaceYield > 0
                  ? `${profitResults.surfaceYield.toFixed(1)}%`
                  : "산정 불가"
              }
              highlight
            />
          </div>
        </div>
      )}

      {/* 면책 */}
      <p className="text-xs text-emerald-500/70 dark:text-emerald-500/50 leading-relaxed border-t border-emerald-100 dark:border-emerald-900 pt-3">
        참고용 간이 분석입니다. 토지비, 세금, 대출이자, 공실률 등이 미포함되어
        실제 투자 판단의 근거로 사용할 수 없습니다.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs text-emerald-700 dark:text-emerald-300">
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${
          highlight
            ? "text-emerald-600 dark:text-emerald-300"
            : "text-slate-800 dark:text-slate-200"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
