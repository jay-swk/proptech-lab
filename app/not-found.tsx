import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="text-center space-y-6 max-w-md">
        <Image
          src="/proptech-lab/mascot.svg"
          alt="PropTech Lab 마스코트"
          width={120}
          height={140}
          className="mx-auto"
        />
        <div>
          <h1 className="text-6xl font-bold text-slate-300 dark:text-slate-700">
            404
          </h1>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mt-2">
            이 주소에는 건물을 지을 수 없습니다
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            찾으시는 페이지가 존재하지 않거나 이동되었습니다.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            홈으로 가기
          </Link>
          <Link
            href="/simulator"
            className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium px-6 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            시뮬레이터 가기
          </Link>
        </div>
      </div>
    </main>
  );
}
