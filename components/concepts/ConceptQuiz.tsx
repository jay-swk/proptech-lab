"use client";

import { useState } from "react";
import Link from "next/link";
import { type Quiz } from "@/content/concepts/quizzes";

interface ConceptQuizProps {
  quizzes: Quiz[];
}

export function ConceptQuiz({ quizzes }: ConceptQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (quizzes.length === 0) return null;

  const quiz = quizzes[currentIndex];
  const isCorrect = selected === quiz.correctIndex;
  const hasAnswered = selected !== null;

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setSelected(index);
    if (index === quiz.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= quizzes.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    }
  };

  if (finished) {
    return (
      <div className="bg-violet-50 dark:bg-violet-950 rounded-2xl border border-violet-100 dark:border-violet-900 p-6 text-center space-y-4">
        <p className="text-lg font-semibold text-violet-800 dark:text-violet-200">
          {score}/{quizzes.length} 정답!
        </p>
        <p className="text-sm text-violet-600 dark:text-violet-400">
          {score === quizzes.length
            ? "완벽합니다! 이 개념을 잘 이해하고 있네요."
            : score >= quizzes.length / 2
              ? "잘하셨습니다! 틀린 부분은 위 설명을 다시 읽어보세요."
              : "개념 설명을 다시 한 번 읽어보시면 도움이 됩니다."}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setSelected(null);
              setScore(0);
              setFinished(false);
            }}
            className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
          >
            다시 풀기
          </button>
          <Link
            href="/simulator"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            시뮬레이터에서 확인
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-violet-50 dark:bg-violet-950 rounded-2xl border border-violet-100 dark:border-violet-900 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-violet-800 dark:text-violet-200">
          이해도 확인
        </h3>
        <span className="text-xs text-violet-400">
          {currentIndex + 1} / {quizzes.length}
        </span>
      </div>

      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
        {quiz.question}
      </p>

      <div className="space-y-2">
        {quiz.options.map((option, i) => {
          let style = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-violet-300";
          if (hasAnswered) {
            if (i === quiz.correctIndex) {
              style =
                "bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200";
            } else if (i === selected && !isCorrect) {
              style =
                "bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200";
            } else {
              style =
                "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-50";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={hasAnswered}
              className={`w-full text-left text-sm px-4 py-3 rounded-lg border transition-colors ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <div
          className={`text-sm rounded-lg p-3 ${
            isCorrect
              ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
              : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
          }`}
        >
          <p className="font-medium mb-1">
            {isCorrect ? "정답!" : "오답"}
          </p>
          <p className="leading-relaxed">{quiz.explanation}</p>
        </div>
      )}

      {hasAnswered && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline"
          >
            {currentIndex + 1 >= quizzes.length ? "결과 보기" : "다음 문제"} →
          </button>
        </div>
      )}
    </div>
  );
}
