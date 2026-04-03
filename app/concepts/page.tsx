import type { Metadata } from "next";
import { concepts } from "@/content/concepts";
import { ConceptsGrid } from "@/components/concepts/ConceptsGrid";

export const metadata: Metadata = {
  title: "개념 사전 | PropTech Lab",
  description:
    "용적률, 건폐율, 대지면적 등 프롭테크 핵심 개념을 쉽게 이해하세요.",
};

export default function ConceptsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
          프롭테크 개념 사전
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          어렵게만 느껴지는 부동산·건축 용어를 실생활 예시와 함께 쉽게 설명합니다.
        </p>
      </div>

      <ConceptsGrid concepts={concepts} />
    </main>
  );
}
