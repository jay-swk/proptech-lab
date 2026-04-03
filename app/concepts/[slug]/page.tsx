import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  concepts,
  getConceptBySlug,
  getRelatedConcepts,
} from "@/content/concepts";
import { getQuizzesBySlug } from "@/content/concepts/quizzes";
import { ConceptCard } from "@/components/concepts/ConceptCard";
import { ConceptQuiz } from "@/components/concepts/ConceptQuiz";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return concepts.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) return {};
  return {
    title: `${concept.title} | PropTech Lab`,
    description: concept.definition,
  };
}

export default async function ConceptDetailPage({ params }: Props) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) notFound();

  const related = getRelatedConcepts(concept);
  const quizzes = getQuizzesBySlug(slug);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <Link
          href="/concepts"
          className="inline-flex items-center text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-4 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          개념 사전으로
        </Link>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {concept.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          {concept.subtitle}
        </p>
      </div>

      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">
          정의
        </h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          {concept.definition}
        </p>

        {concept.formula && (
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-400 mb-1">계산식</p>
            <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
              {concept.formula}
            </code>
          </div>
        )}
      </section>

      <section className="bg-amber-50 dark:bg-amber-950 rounded-2xl border border-amber-100 dark:border-amber-900 p-6 space-y-3">
        <h2 className="text-base font-semibold text-amber-800 dark:text-amber-200">
          실생활 예시
        </h2>
        <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
          {concept.example}
        </p>
      </section>

      <section className="bg-emerald-50 dark:bg-emerald-950 rounded-2xl border border-emerald-100 dark:border-emerald-900 p-6 space-y-3">
        <h2 className="text-base font-semibold text-emerald-800 dark:text-emerald-200">
          알아두면 좋은 점
        </h2>
        <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
          {concept.tip}
        </p>
      </section>

      {quizzes.length > 0 && <ConceptQuiz quizzes={quizzes} />}

      <div className="flex justify-center">
        <Link
          href="/simulator"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          시뮬레이터에서 직접 계산해보기
          <svg
            className="w-4 h-4"
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

      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            연관 개념
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((c) => (
              <ConceptCard key={c.slug} concept={c} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
