import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PropTech Lab — 프롭테크 인터랙티브 학습",
  description:
    "용적률, 건폐율, 대지면적을 슬라이더로 조작하고 3D로 확인하는 프롭테크 인터랙티브 학습 서비스",
};

const features = [
  {
    icon: "⚡",
    title: "실시간 시뮬레이션",
    description:
      "슬라이더를 움직이는 즉시 건축면적, 연면적, 최대 층수가 자동으로 계산됩니다.",
  },
  {
    icon: "🏗️",
    title: "3D 건물 시각화",
    description:
      "입력한 조건의 건물을 3D로 바로 확인하세요. 회전하고 확대하며 규모를 직관적으로 파악할 수 있습니다.",
  },
  {
    icon: "📖",
    title: "쉬운 개념 설명",
    description:
      "어려운 건축·부동산 용어를 실생활 예시와 함께 누구나 이해할 수 있도록 설명합니다.",
  },
];

const steps = [
  {
    number: "01",
    title: "대지 조건 입력",
    description: "대지면적, 용적률, 건폐율, 층수를 슬라이더로 설정합니다.",
  },
  {
    number: "02",
    title: "결과 실시간 확인",
    description: "건축면적, 연면적, 활용도가 즉시 계산되어 표시됩니다.",
  },
  {
    number: "03",
    title: "3D로 시각화",
    description: "입력한 조건의 건물을 3D 모델로 직접 확인합니다.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-500 rounded-full filter blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            인터랙티브 프롭테크 학습
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            이 땅에 어떤 건물을
            <br />
            <span className="text-blue-400">지을 수 있을까?</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            용적률, 건폐율, 대지면적을 직접 조작하며 건물 규모를 실시간으로
            계산하고 3D로 확인하세요. 이론이 아닌 체험으로 이해합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/simulator"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
            >
              시뮬레이터 시작하기
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              href="/concepts"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-8 py-4 rounded-xl transition-colors text-lg"
            >
              개념 먼저 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
            이렇게 배웁니다
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3">
            이론 암기가 아닌, 직접 조작하며 이해하는 학습 방식
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 text-center"
            >
              <span className="text-4xl block mb-4">{f.icon}</span>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
              3단계로 끝납니다
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="flex flex-col items-center text-center relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-slate-200 dark:bg-slate-700" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white text-xl font-bold flex items-center justify-center mb-4 relative z-10">
                  {step.number}
                </div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 sm:p-14 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            지금 바로 시작해보세요
          </h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            330m² 대지에 용적률 200%, 건폐율 60%를 적용하면 몇 층짜리 건물이
            가능할까요?
          </p>
          <Link
            href="/simulator"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg"
          >
            시뮬레이터 바로가기
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
