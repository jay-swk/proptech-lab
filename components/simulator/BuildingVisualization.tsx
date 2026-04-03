"use client";

import dynamic from "next/dynamic";

const BuildingScene = dynamic(
  () => import("./BuildingScene").then((m) => m.BuildingScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 sm:h-96 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400">3D 시각화 로딩 중...</p>
        </div>
      </div>
    ),
  }
);

export function BuildingVisualization() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          3D 건물 시각화
        </h2>
        <span className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
          실시간 반영
        </span>
      </div>
      <div className="relative" role="img" aria-label="입력된 조건에 따른 3D 건물 모델. 마우스로 회전 및 확대 가능합니다.">
        <BuildingScene />
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500">
        건폐율 기반 바닥면적과 층수를 3D로 표현합니다. 슬라이더를 조작하면 즉시 반영됩니다.
      </p>
    </div>
  );
}
