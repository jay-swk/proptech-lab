"use client";

import { useState } from "react";
import { type Concept } from "@/content/concepts";
import { ConceptCard } from "./ConceptCard";

const CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "regulation", label: "건축 규제" },
  { key: "area", label: "면적" },
  { key: "finance", label: "금융" },
] as const;

export function ConceptsGrid({ concepts }: { concepts: Concept[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all" ? concepts : concepts.filter((c) => c.category === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              filter === cat.key
                ? "bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-medium"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750"
            }`}
          >
            {cat.label}
            <span className="ml-1 text-xs text-slate-400">
              {cat.key === "all"
                ? concepts.length
                : concepts.filter((c) => c.category === cat.key).length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((concept) => (
          <ConceptCard key={concept.slug} concept={concept} />
        ))}
      </div>
    </div>
  );
}
