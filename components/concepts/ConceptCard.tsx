import Link from "next/link";
import { Concept } from "@/content/concepts";

const categoryLabel: Record<Concept["category"], string> = {
  regulation: "규제",
  area: "면적",
  finance: "금융",
};

const categoryColor: Record<Concept["category"], string> = {
  regulation: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  area: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  finance: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
};

interface ConceptCardProps {
  concept: Concept;
}

export function ConceptCard({ concept }: ConceptCardProps) {
  return (
    <Link
      href={`/concepts/${concept.slug}`}
      className="group block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor[concept.category]}`}
        >
          {categoryLabel[concept.category]}
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
        {concept.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        {concept.subtitle}
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
        {concept.definition}
      </p>
      <div className="mt-4 flex items-center text-xs text-blue-500 dark:text-blue-400 font-medium">
        자세히 보기
        <svg
          className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform"
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
      </div>
    </Link>
  );
}
