import type { Metadata } from "next";
import { InputPanel } from "@/components/simulator/InputPanel";
import { BuildingVisualization } from "@/components/simulator/BuildingVisualization";
import { ResultsDashboard } from "@/components/simulator/ResultsDashboard";
import { RealWorldPresets } from "@/components/simulator/RealWorldPresets";
import { ScenarioComparison } from "@/components/simulator/ScenarioComparison";

export const metadata: Metadata = {
  title: "용적률 시뮬레이터 | PropTech Lab",
  description:
    "대지면적, 용적률, 건폐율, 층수를 조절해 건물 규모를 실시간으로 계산하고 3D로 확인하세요.",
};

export default function SimulatorPage() {
  return (
    <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 space-y-4">
      {/* 헤더 + 프리셋 */}
      <div className="space-y-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            용적률 시뮬레이터
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            실제 사례를 선택하거나 슬라이더를 조작하면 건물 규모·수익성·금융 분석이 실시간으로 계산됩니다.
          </p>
        </div>
        <RealWorldPresets />
      </div>

      {/* 데스크탑: 3단 레이아웃 | 태블릿: 2단 | 모바일: 1단 */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] xl:grid-cols-[300px_1fr_360px] gap-4 items-start">
        {/* 좌측: 입력 패널 (데스크탑에서 sticky) */}
        <div className="lg:sticky lg:top-[4.5rem] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <InputPanel />
        </div>

        {/* 중앙: 3D 시각화 */}
        <div className="lg:min-h-[500px] xl:min-h-[560px]">
          <BuildingVisualization />
        </div>

        {/* 우측: 결과 대시보드 (데스크탑에서 sticky) */}
        <div className="lg:sticky lg:top-[4.5rem] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <ResultsDashboard />
        </div>
      </div>

      {/* 시나리오 비교 (전체 너비) */}
      <ScenarioComparison />
    </main>
  );
}
