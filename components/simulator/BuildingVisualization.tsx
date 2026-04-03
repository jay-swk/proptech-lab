"use client";

import dynamic from "next/dynamic";

const BuildingScene = dynamic(
  () => import("./BuildingScene").then((m) => m.BuildingScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[300px] rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">3D 로딩...</p>
        </div>
      </div>
    ),
  },
);

export function BuildingVisualization() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          3D 건물 시각화
        </h2>
        <span className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          실시간
        </span>
      </div>
      <div
        className="flex-1 min-h-[300px]"
        role="img"
        aria-label="입력된 조건에 따른 3D 건물 모델. 마우스로 회전 및 확대 가능합니다."
      >
        <BuildingScene />
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">
        드래그로 회전 · 스크롤로 확대
      </p>
    </div>
  );
}
