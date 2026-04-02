import type { Metadata } from "next";
import { InputPanel } from "@/components/simulator/InputPanel";
import { OutputPanel } from "@/components/simulator/OutputPanel";
import { BuildingVisualization } from "@/components/simulator/BuildingVisualization";
import { ScenarioInterpretation } from "@/components/simulator/ScenarioInterpretation";

export const metadata: Metadata = {
  title: "용적률 시뮬레이터 | PropTech Lab",
  description:
    "대지면적, 용적률, 건폐율, 층수를 조절해 건물 규모를 실시간으로 계산하고 3D로 확인하세요.",
};

export default function SimulatorPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
          용적률 시뮬레이터
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          슬라이더를 조작하면 건물 규모가 실시간으로 계산됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <InputPanel />
          <OutputPanel />
        </div>
        <div className="space-y-6">
          <BuildingVisualization />
          <ScenarioInterpretation />
        </div>
      </div>
    </main>
  );
}
