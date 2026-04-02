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
