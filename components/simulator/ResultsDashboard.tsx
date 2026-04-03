"use client";

import { useState } from "react";
import { useSimulatorStore } from "@/store/simulatorStore";
import {
  formatKrw,
  SQM_PER_PYEONG,
  interpretScenario,
} from "@/libs/simulator/calculations";

type Tab = "profit" | "finance";

export function ResultsDashboard() {
  const { results, profitParams, profitResults, financeParams, financeResults, updateProfitParam, updateFinanceParam } =
    useSimulatorStore();
  const [tab, setTab] = useState<Tab>("profit");

  const hasError = results.warnings.some((w) => w.severity === "error");
  const pyeong = results.actualFloorArea / SQM_PER_PYEONG;
  const interpretation = interpretScenario(results);

  return (
    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-8rem)] pr-1 scrollbar-thin">
      {/* 핵심 지표 4개 */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard label="건축면적" value={`${results.buildingArea.toFixed(0)}m²`} sub={`${(results.buildingArea / SQM_PER_PYEONG).toFixed(0)}평`} />
        <MetricCard label="허용 연면적" value={`${results.totalFloorArea.toFixed(0)}m²`} sub={`${(results.totalFloorArea / SQM_PER_PYEONG).toFixed(0)}평`} />
        <MetricCard
          label="최대 가능층수"
          value={results.maxFloors === 0 ? "불가" : `${results.maxFloors}층`}
          sub="용적률 기준"
          highlight={results.maxFloors === 0}
        />
        <MetricCard
          label="용적률 활용도"
          value={`${Math.min(results.utilizationRate, 999).toFixed(0)}%`}
          sub={results.utilizationRate > 100 ? "한도 초과" : results.utilizationRate < 50 ? "활용 낮음" : "정상"}
          highlight={results.utilizationRate > 100}
        />
      </div>

      {/* 경고 */}
      {results.warnings.length > 0 && (
        <div className="space-y-1">
          {results.warnings.map((w, i) => (
            <div
              key={i}
              className={`text-xs px-2.5 py-1.5 rounded-lg ${
                w.severity === "error"
                  ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
                  : "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
              }`}
            >
              {w.message}
            </div>
          ))}
        </div>
      )}

      {/* 시나리오 해석 */}
      <div className="bg-blue-50 dark:bg-blue-950 rounded-lg px-3 py-2">
        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
          {interpretation}
        </p>
      </div>

      {/* 탭: 간이 수익 | 상세 금융 */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setTab("profit")}
          className={`flex-1 text-xs font-medium py-2 border-b-2 transition-colors ${
            tab === "profit"
              ? "border-emerald-500 text-emerald-700 dark:text-emerald-300"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          간이 수익
        </button>
        <button
          onClick={() => setTab("finance")}
          className={`flex-1 text-xs font-medium py-2 border-b-2 transition-colors ${
            tab === "finance"
              ? "border-violet-500 text-violet-700 dark:text-violet-300"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          상세 금융
        </button>
      </div>

      {tab === "profit" ? (
        <ProfitTab
          hasError={hasError}
          pyeong={pyeong}
          actualFloorArea={results.actualFloorArea}
          profitParams={profitParams}
          profitResults={profitResults}
          updateProfitParam={updateProfitParam}
        />
      ) : (
        <FinanceTab
          hasError={hasError}
          financeParams={financeParams}
          financeResults={financeResults}
          updateFinanceParam={updateFinanceParam}
        />
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg px-3 py-2 ${highlight ? "bg-red-50 dark:bg-red-950" : "bg-slate-50 dark:bg-slate-800"}`}>
      <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
      <p className={`text-base font-bold font-mono ${highlight ? "text-red-600 dark:text-red-400" : "text-slate-800 dark:text-slate-200"}`}>
        {value}
      </p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  );
}

function ProfitTab({
  hasError,
  pyeong,
  actualFloorArea,
  profitParams,
  profitResults,
  updateProfitParam,
}: {
  hasError: boolean;
  pyeong: number;
  actualFloorArea: number;
  profitParams: { constructionCostPerPyeong: number; monthlyRentPerPyeong: number };
  profitResults: { totalConstructionCost: number; monthlyRentalIncome: number; annualRentalIncome: number; paybackYears: number; surfaceYield: number };
  updateProfitParam: (key: "constructionCostPerPyeong" | "monthlyRentPerPyeong", value: number) => void;
}) {
  if (hasError) {
    return (
      <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-lg p-3 text-center">
        건물 불가 조건에서는 수익을 산정할 수 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <CompactInput label="평당 건축비(만)" value={profitParams.constructionCostPerPyeong} onChange={(v) => updateProfitParam("constructionCostPerPyeong", v)} />
        <CompactInput label="평당 월임대(만)" value={profitParams.monthlyRentPerPyeong} onChange={(v) => updateProfitParam("monthlyRentPerPyeong", v)} step={0.5} />
      </div>
      <p className="text-xs text-slate-400">연면적 {actualFloorArea.toFixed(0)}m² ({pyeong.toFixed(0)}평)</p>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        <Row label="예상 건축비" value={formatKrw(profitResults.totalConstructionCost)} />
        <Row label="월 임대수익" value={formatKrw(profitResults.monthlyRentalIncome)} />
        <Row label="연 임대수익" value={formatKrw(profitResults.annualRentalIncome)} />
        <Row label="투자회수" value={profitResults.paybackYears > 0 ? `${profitResults.paybackYears.toFixed(1)}년` : "-"} />
        <Row label="표면 수익률" value={profitResults.surfaceYield > 0 ? `${profitResults.surfaceYield.toFixed(1)}%` : "-"} highlight />
      </div>
      <p className="text-xs text-slate-400/60 leading-relaxed">
        참고용 간이 분석. 토지비·세금·대출 미포함. &quot;상세 금융&quot; 탭에서 확인하세요.
      </p>
    </div>
  );
}

function FinanceTab({
  hasError,
  financeParams,
  financeResults,
  updateFinanceParam,
}: {
  hasError: boolean;
  financeParams: { landCostPerPyeong: number; acquisitionTaxRate: number; ltvRatio: number; loanInterestRate: number; miscCostRate: number; vacancyRate: number };
  financeResults: { landCost: number; acquisitionTax: number; miscCost: number; totalProjectCost: number; equity: number; loanAmount: number; monthlyLoanInterest: number; netMonthlyIncome: number; netAnnualIncome: number; equityYield: number; netPaybackYears: number };
  updateFinanceParam: (key: "landCostPerPyeong" | "acquisitionTaxRate" | "ltvRatio" | "loanInterestRate" | "miscCostRate" | "vacancyRate", value: number) => void;
}) {
  if (hasError) {
    return (
      <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-lg p-3 text-center">
        건물 불가 조건에서는 금융 분석이 불가합니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <CompactInput label="토지 평당가(만)" value={financeParams.landCostPerPyeong} onChange={(v) => updateFinanceParam("landCostPerPyeong", v)} step={100} />
        <CompactInput label="취득세율(%)" value={financeParams.acquisitionTaxRate} onChange={(v) => updateFinanceParam("acquisitionTaxRate", v)} step={0.1} />
        <CompactInput label="대출비율 LTV(%)" value={financeParams.ltvRatio} onChange={(v) => updateFinanceParam("ltvRatio", v)} />
        <CompactInput label="대출금리(%)" value={financeParams.loanInterestRate} onChange={(v) => updateFinanceParam("loanInterestRate", v)} step={0.1} />
        <CompactInput label="부대비용(%)" value={financeParams.miscCostRate} onChange={(v) => updateFinanceParam("miscCostRate", v)} />
        <CompactInput label="공실률(%)" value={financeParams.vacancyRate} onChange={(v) => updateFinanceParam("vacancyRate", v)} />
      </div>

      <div className="bg-violet-50 dark:bg-violet-950 rounded-lg p-2.5 space-y-1">
        <p className="text-xs font-semibold text-violet-800 dark:text-violet-200">사업비 구성</p>
        <div className="divide-y divide-violet-100 dark:divide-violet-900">
          <Row label="토지비" value={formatKrw(financeResults.landCost)} color="violet" />
          <Row label="취득세" value={formatKrw(financeResults.acquisitionTax)} color="violet" />
          <Row label="부대비용" value={formatKrw(financeResults.miscCost)} color="violet" />
          <Row label="총 사업비" value={formatKrw(financeResults.totalProjectCost)} highlight color="violet" />
        </div>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-2.5 space-y-1">
        <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">투자 수익</p>
        <div className="divide-y divide-emerald-100 dark:divide-emerald-900">
          <Row label="자기자본" value={formatKrw(financeResults.equity)} color="emerald" />
          <Row label="대출금" value={formatKrw(financeResults.loanAmount)} color="emerald" />
          <Row label="월 대출이자" value={formatKrw(financeResults.monthlyLoanInterest)} color="emerald" />
          <Row
            label="순 월수익"
            value={financeResults.netMonthlyIncome >= 0 ? formatKrw(financeResults.netMonthlyIncome) : `-${formatKrw(Math.abs(financeResults.netMonthlyIncome))}`}
            highlight
            color="emerald"
            negative={financeResults.netMonthlyIncome < 0}
          />
          <Row
            label="자기자본 수익률"
            value={financeResults.equityYield !== 0 ? `${financeResults.equityYield.toFixed(1)}%` : "-"}
            highlight
            color="emerald"
            negative={financeResults.equityYield < 0}
          />
          <Row
            label="실 투자회수"
            value={financeResults.netPaybackYears > 0 ? `${financeResults.netPaybackYears.toFixed(1)}년` : "-"}
            color="emerald"
          />
        </div>
      </div>

      <p className="text-xs text-slate-400/60 leading-relaxed">
        참고용 분석입니다. 실제 투자 전 전문가 상담을 권장합니다.
      </p>
    </div>
  );
}

function CompactInput({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-slate-500 dark:text-slate-400 mb-0.5">{label}</label>
      <input
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-full text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
  color = "slate",
  negative,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  color?: "slate" | "violet" | "emerald";
  negative?: boolean;
}) {
  const labelColor = {
    slate: "text-slate-500 dark:text-slate-400",
    violet: "text-violet-600 dark:text-violet-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
  }[color];

  return (
    <div className="flex items-center justify-between py-1.5">
      <span className={`text-xs ${labelColor}`}>{label}</span>
      <span
        className={`text-xs font-mono ${
          negative
            ? "text-red-600 dark:text-red-400 font-semibold"
            : highlight
              ? "font-semibold text-slate-800 dark:text-slate-100"
              : "text-slate-700 dark:text-slate-300"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
