export interface SimulatorParams {
  landArea: number;
  floorAreaRatio: number;
  buildingCoverageRatio: number;
  floors: number;
}

export interface SimulatorResults {
  buildingArea: number;
  totalFloorArea: number;
  maxFloors: number;
  actualFloorArea: number;
  utilizationRate: number;
  warnings: Warning[];
}

export interface Warning {
  type: "over_floors" | "over_ratio" | "low_utilization" | "no_floors_possible";
  message: string;
  severity: "error" | "warning" | "info";
}

// --- 용도지역 ---

export type ZoningType =
  | "custom"
  | "residential-1-exclusive"
  | "residential-2-exclusive"
  | "residential-1-general"
  | "residential-2-general"
  | "residential-3-general"
  | "quasi-residential"
  | "general-commercial"
  | "neighborhood-commercial"
  | "quasi-industrial";

export type UsageCategory = "residential" | "commercial" | "industrial";

export interface ZoningPreset {
  type: ZoningType;
  label: string;
  maxBCR: number;
  maxFAR: number;
  description: string;
  usageCategory: UsageCategory;
}

export const ZONING_PRESETS: ZoningPreset[] = [
  { type: "custom", label: "자유 입력", maxBCR: 80, maxFAR: 1500, description: "제한 없이 자유롭게 값을 설정합니다.", usageCategory: "residential" },
  { type: "residential-1-exclusive", label: "제1종 전용주거", maxBCR: 50, maxFAR: 100, description: "단독주택 중심의 양호한 주거환경", usageCategory: "residential" },
  { type: "residential-2-exclusive", label: "제2종 전용주거", maxBCR: 50, maxFAR: 150, description: "공동주택 중심의 양호한 주거환경", usageCategory: "residential" },
  { type: "residential-1-general", label: "제1종 일반주거", maxBCR: 60, maxFAR: 200, description: "저층 주거환경 보호", usageCategory: "residential" },
  { type: "residential-2-general", label: "제2종 일반주거", maxBCR: 60, maxFAR: 250, description: "중층 주거환경 조성", usageCategory: "residential" },
  { type: "residential-3-general", label: "제3종 일반주거", maxBCR: 50, maxFAR: 300, description: "중·고층 주거환경 조성", usageCategory: "residential" },
  { type: "quasi-residential", label: "준주거", maxBCR: 70, maxFAR: 500, description: "주거 기능 + 상업·업무 혼합", usageCategory: "residential" },
  { type: "general-commercial", label: "일반상업", maxBCR: 80, maxFAR: 1000, description: "일반적인 상업·업무 기능", usageCategory: "commercial" },
  { type: "neighborhood-commercial", label: "근린상업", maxBCR: 70, maxFAR: 600, description: "근린지역 일용품·서비스 공급", usageCategory: "commercial" },
  { type: "quasi-industrial", label: "준공업", maxBCR: 70, maxFAR: 400, description: "경공업 + 주거·상업 혼합", usageCategory: "industrial" },
];

export function getZoningPreset(type: ZoningType): ZoningPreset {
  return ZONING_PRESETS.find((p) => p.type === type) ?? ZONING_PRESETS[0];
}

// --- 실제 사례 프리셋 ---

export interface RealWorldPreset {
  id: string;
  label: string;
  description: string;
  zoningType: ZoningType;
  params: SimulatorParams;
}

export const REAL_WORLD_PRESETS: RealWorldPreset[] = [
  { id: "gangnam-house", label: "강남 단독주택지", description: "강남 대치동 100평 단독", zoningType: "residential-2-general", params: { landArea: 330, floorAreaRatio: 250, buildingCoverageRatio: 60, floors: 4 } },
  { id: "mapo-multi", label: "마포 다세대", description: "마포구 60평 다세대", zoningType: "residential-2-general", params: { landArea: 200, floorAreaRatio: 250, buildingCoverageRatio: 60, floors: 5 } },
  { id: "hongdae-commercial", label: "홍대 근생", description: "홍대입구역 상가건물", zoningType: "neighborhood-commercial", params: { landArea: 150, floorAreaRatio: 600, buildingCoverageRatio: 70, floors: 8 } },
  { id: "gangnam-office", label: "강남역 오피스", description: "강남역 대로변 오피스", zoningType: "general-commercial", params: { landArea: 500, floorAreaRatio: 1000, buildingCoverageRatio: 80, floors: 15 } },
  { id: "seongsu-cafe", label: "성수 카페거리", description: "성수동 카페/공방", zoningType: "quasi-industrial", params: { landArea: 250, floorAreaRatio: 400, buildingCoverageRatio: 70, floors: 5 } },
  { id: "eunpyeong-villa", label: "은평 신축빌라", description: "은평구 소규모 빌라", zoningType: "residential-1-general", params: { landArea: 280, floorAreaRatio: 200, buildingCoverageRatio: 60, floors: 4 } },
];

// --- 수익성 ---

export interface ProfitParams {
  constructionCostPerPyeong: number; // 만원/평
  monthlyRentPerPyeong: number;      // 만원/평
}

export interface ProfitResults {
  totalConstructionCost: number; // 만원
  monthlyRentalIncome: number;   // 만원
  annualRentalIncome: number;    // 만원
  paybackYears: number;          // 년 (0 = 산정 불가)
  surfaceYield: number;          // % (0 = 산정 불가)
}

export const DEFAULT_PROFIT_PARAMS: Record<UsageCategory, ProfitParams> = {
  residential: { constructionCostPerPyeong: 700, monthlyRentPerPyeong: 5 },
  commercial: { constructionCostPerPyeong: 800, monthlyRentPerPyeong: 8 },
  industrial: { constructionCostPerPyeong: 500, monthlyRentPerPyeong: 3 },
};

export const SQM_PER_PYEONG = 3.3058;

export function calculateProfit(
  actualFloorArea: number,
  profitParams: ProfitParams,
): ProfitResults {
  const pyeong = actualFloorArea / SQM_PER_PYEONG;
  const totalConstructionCost = pyeong * profitParams.constructionCostPerPyeong;
  const monthlyRentalIncome = pyeong * profitParams.monthlyRentPerPyeong;
  const annualRentalIncome = monthlyRentalIncome * 12;
  const paybackYears =
    totalConstructionCost > 0 && annualRentalIncome > 0
      ? totalConstructionCost / annualRentalIncome
      : 0;
  const surfaceYield =
    totalConstructionCost > 0
      ? (annualRentalIncome / totalConstructionCost) * 100
      : 0;

  return {
    totalConstructionCost,
    monthlyRentalIncome,
    annualRentalIncome,
    paybackYears,
    surfaceYield,
  };
}

export function formatKrw(manwon: number): string {
  if (manwon === 0) return "0원";
  const rounded = Math.round(manwon);
  if (rounded >= 10000) {
    const eok = Math.floor(rounded / 10000);
    const remainder = rounded % 10000;
    if (remainder === 0) return `${eok}억원`;
    return `${eok}억 ${remainder.toLocaleString()}만원`;
  }
  return `${rounded.toLocaleString()}만원`;
}

// --- 기존 계산 ---

export function calculate(params: SimulatorParams): SimulatorResults {
  const { landArea, floorAreaRatio, buildingCoverageRatio, floors } = params;

  const buildingArea = landArea * (buildingCoverageRatio / 100);
  const totalFloorArea = landArea * (floorAreaRatio / 100);
  const maxFloors = Math.floor(totalFloorArea / buildingArea);
  const actualFloorArea = buildingArea * floors;
  const utilizationRate =
    totalFloorArea > 0 ? (actualFloorArea / totalFloorArea) * 100 : 0;

  const warnings: Warning[] = [];

  if (maxFloors === 0) {
    warnings.push({
      type: "no_floors_possible",
      message: `건폐율(${buildingCoverageRatio}%)이 용적률(${floorAreaRatio}%)보다 크거나 같아 건물을 지을 수 없습니다. 용적률을 높이거나 건폐율을 낮춰보세요.`,
      severity: "error",
    });
  }

  if (floors > maxFloors && maxFloors > 0) {
    warnings.push({
      type: "over_floors",
      message: `입력한 ${floors}층은 용적률 한도를 초과합니다. 최대 ${maxFloors}층까지 가능합니다.`,
      severity: "error",
    });
  }

  if (utilizationRate > 100) {
    warnings.push({
      type: "over_ratio",
      message: `연면적이 용적률 한도(${totalFloorArea.toFixed(0)}m²)를 초과했습니다.`,
      severity: "error",
    });
  }

  if (utilizationRate < 50 && utilizationRate > 0) {
    warnings.push({
      type: "low_utilization",
      message: `용적률 활용도가 ${utilizationRate.toFixed(1)}%로 낮습니다. 층수를 늘려보세요.`,
      severity: "info",
    });
  }

  return {
    buildingArea,
    totalFloorArea,
    maxFloors,
    actualFloorArea,
    utilizationRate,
    warnings,
  };
}

export function interpretScenario(results: SimulatorResults): string {
  const { actualFloorArea, warnings } = results;

  if (warnings.some((w) => w.type === "no_floors_possible")) {
    return "이 조건으로는 건물을 지을 수 없습니다. 용적률이 건폐율보다 커야 최소 1층 이상이 가능합니다.";
  }

  if (warnings.some((w) => w.type === "over_floors")) {
    return "층수가 용적률 한도를 초과했습니다. 최대 층수로 조정하면 법적 기준을 충족할 수 있습니다.";
  }

  const aptUnit30 = 99;
  const aptUnit24 = 79;
  const officeDesk = 10;

  const units30 = Math.floor(actualFloorArea / aptUnit30);
  const units24 = Math.floor(actualFloorArea / aptUnit24);
  const officeDesks = Math.floor(actualFloorArea / officeDesk);

  if (actualFloorArea >= aptUnit30) {
    return `이 건물은 연면적 ${actualFloorArea.toFixed(0)}m²로, 약 30평(${aptUnit30}m²) 아파트 ${units30}세대 또는 24평(${aptUnit24}m²) 아파트 ${units24}세대를 수용할 수 있습니다.`;
  } else if (actualFloorArea >= 30) {
    return `연면적 ${actualFloorArea.toFixed(0)}m²의 소규모 건물로, 사무실 ${officeDesks}개 책상 규모입니다.`;
  } else {
    return `연면적 ${actualFloorArea.toFixed(0)}m²의 소형 건물입니다.`;
  }
}

export const DEFAULT_PARAMS: SimulatorParams = {
  landArea: 330,
  floorAreaRatio: 200,
  buildingCoverageRatio: 60,
  floors: 5,
};

export const PARAM_RANGES = {
  landArea: { min: 50, max: 5000, step: 10 },
  floorAreaRatio: { min: 50, max: 1500, step: 10 },
  buildingCoverageRatio: { min: 20, max: 80, step: 1 },
  floors: { min: 1, max: 50, step: 1 },
} as const;
