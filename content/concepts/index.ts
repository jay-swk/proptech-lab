export interface Concept {
  slug: string;
  title: string;
  subtitle: string;
  definition: string;
  formula?: string;
  example: string;
  tip: string;
  relatedSlugs: string[];
  category: "regulation" | "area" | "finance";
}

export const concepts: Concept[] = [
  {
    slug: "floor-area-ratio",
    title: "용적률",
    subtitle: "대지면적 대비 건물 연면적의 비율",
    definition:
      "용적률(容積率)은 대지면적에 대한 건물 연면적의 비율입니다. 쉽게 말해, 땅 위에 얼마나 많은 공간을 만들 수 있는지를 나타냅니다.",
    formula: "용적률(%) = (연면적 ÷ 대지면적) × 100",
    example:
      "330m²(약 100평) 대지에 용적률 200%가 적용되면, 연면적 660m²까지 건물을 지을 수 있습니다. 건축면적이 198m²라면 최대 3층(660 ÷ 198 ≈ 3.3층 → 3층)까지 가능합니다.",
    tip: "주거지역은 보통 100~500%, 상업지역은 최대 1500%까지 허용됩니다. 용적률이 높을수록 더 높은 건물을 지을 수 있어 개발 가치가 높아집니다.",
    relatedSlugs: ["building-coverage-ratio", "land-area", "zoning-district"],
    category: "regulation",
  },
  {
    slug: "building-coverage-ratio",
    title: "건폐율",
    subtitle: "대지면적 대비 건축면적의 비율",
    definition:
      "건폐율(建蔽率)은 대지면적에 대한 건축면적(건물이 땅을 차지하는 바닥 면적)의 비율입니다. 건물이 땅을 얼마나 덮는지를 제한하여 일조, 통풍, 녹지 공간을 확보합니다.",
    formula: "건폐율(%) = (건축면적 ÷ 대지면적) × 100",
    example:
      "330m² 대지에 건폐율 60%가 적용되면, 건축면적은 최대 198m²입니다. 나머지 132m²는 마당, 주차장, 조경 등으로 활용됩니다.",
    tip: "건폐율이 낮을수록 건물 주변 여유 공간이 많아집니다. 주거지역은 보통 40~60%, 상업지역은 최대 90%까지 허용되는 경우가 있습니다.",
    relatedSlugs: ["floor-area-ratio", "land-area", "zoning-district"],
    category: "regulation",
  },
  {
    slug: "land-area",
    title: "대지면적",
    subtitle: "건물을 지을 수 있는 땅의 면적",
    definition:
      "대지면적(垈地面積)은 건물을 지을 수 있는 땅의 면적입니다. 단순히 땅 전체 면적이 아니라, 도로 등 공공 목적으로 제공되는 부분을 제외한 실제 건축 가능한 면적을 의미합니다.",
    formula: "1평 ≈ 3.3058m² | 대지면적(평) = 대지면적(m²) ÷ 3.3058",
    example:
      "서울 강남의 일반 단독주택 대지는 보통 100~300평(330~990m²)입니다. 330m²(100평) 대지에 건폐율 60%, 용적률 200%를 적용하면 최대 198m² 바닥에 3층 건물(연면적 594m²)을 지을 수 있습니다.",
    tip: "같은 가격이라도 대지면적이 넓을수록 개발 잠재력이 높습니다. 접도 조건, 용도지역과 함께 파악해야 실제 건축 가능성을 알 수 있습니다.",
    relatedSlugs: ["floor-area-ratio", "building-coverage-ratio"],
    category: "area",
  },
  {
    slug: "zoning-district",
    title: "용도지역",
    subtitle: "토지 이용 목적에 따라 지정된 지역 구분",
    definition:
      "용도지역(用途地域)은 국토계획법에 따라 토지를 효율적으로 이용하기 위해 지정하는 지역 구분입니다. 주거지역, 상업지역, 공업지역, 녹지지역 등으로 나뉘며, 각 지역마다 건폐율과 용적률의 법적 상한이 다릅니다.",
    formula: "용도지역별 상한: 제2종 일반주거 = 건폐율 60%, 용적률 250% | 일반상업 = 건폐율 80%, 용적률 1000%",
    example:
      "같은 330m² 대지라도, 제2종 일반주거지역(용적률 250%)이면 연면적 825m²까지, 일반상업지역(용적률 1000%)이면 3,300m²까지 건물을 지을 수 있습니다. 용도지역이 바뀌면(업존) 땅값이 크게 오르는 이유입니다.",
    tip: "토지를 매입할 때 반드시 용도지역을 확인하세요. 정부의 토지이용규제정보서비스(LURIS)에서 무료로 조회할 수 있습니다. 준주거지역은 주거와 상업이 혼합되어 개발 유연성이 높습니다.",
    relatedSlugs: ["floor-area-ratio", "building-coverage-ratio"],
    category: "regulation",
  },
  {
    slug: "construction-cost",
    title: "건축비",
    subtitle: "건물을 짓는 데 드는 총 비용",
    definition:
      "건축비(建築費)는 건물을 신축하는 데 소요되는 비용으로, 일반적으로 '평당 건축비'로 산정합니다. 설계비, 자재비, 인건비, 감리비 등이 포함되며, 건물 용도와 마감 수준에 따라 크게 달라집니다.",
    formula: "총 건축비 = 연면적(평) × 평당 건축비 | 1평 = 3.3058m²",
    example:
      "연면적 300평(약 990m²)의 주거용 건물을 평당 700만원으로 지으면, 총 건축비는 약 21억원입니다. 여기에 토지비, 부대비용(인허가, 세금 등)을 더하면 총 사업비가 됩니다.",
    tip: "2024년 기준 서울 평균 평당 건축비는 주거 600~800만원, 상업 700~1,000만원 수준입니다. 고급 마감이나 특수 구조(필로티, 커튼월 등)는 추가 비용이 발생합니다.",
    relatedSlugs: ["floor-area-ratio", "rental-yield"],
    category: "finance",
  },
  {
    slug: "rental-yield",
    title: "임대수익률",
    subtitle: "투자 대비 임대 수익의 비율",
    definition:
      "임대수익률은 건물에 투자한 비용 대비 연간 임대 수익의 비율입니다. '표면 수익률'은 단순히 연 임대수익을 총 투자비로 나눈 것이며, 공실률·관리비·세금 등을 반영한 것이 '순 수익률'입니다.",
    formula: "표면 수익률(%) = (연 임대수익 ÷ 총 투자비) × 100 | 투자회수 기간(년) = 총 투자비 ÷ 연 임대수익",
    example:
      "20억원을 투자해 월 임대수익 800만원(연 9,600만원)을 올리면, 표면 수익률은 4.8%, 투자회수 기간은 약 20.8년입니다. 서울 오피스 평균 수익률은 3~5% 수준입니다.",
    tip: "수익률이 높다고 무조건 좋은 투자는 아닙니다. 공실 위험, 건물 노후화, 금리 변동 등을 종합적으로 고려해야 합니다. 일반적으로 표면 수익률 4% 이상이면 양호한 수준으로 봅니다.",
    relatedSlugs: ["construction-cost", "zoning-district"],
    category: "finance",
  },
  {
    slug: "floor-height",
    title: "층고와 높이제한",
    subtitle: "건물의 각 층 높이와 전체 높이 규제",
    definition:
      "층고(層高)는 바닥에서 바로 위 바닥까지의 높이입니다. 일반적으로 주거는 2.8~3.0m, 상업은 3.5~4.0m입니다. 건물 전체 높이는 용도지역과 도로 너비에 따라 제한될 수 있으며, 가로구역별 최고 높이 제한이 적용됩니다.",
    formula: "건물 높이 ≈ 층고 × 층수 | 일반 주거 층고: 2.8~3.0m | 상업 층고: 3.5~4.0m",
    example:
      "층고 3m, 10층 건물이면 전체 높이는 약 30m입니다. 같은 10층이라도 상업용(층고 4m)이면 40m가 됩니다. 일부 주거지역은 높이 20m 이하로 제한하기도 합니다.",
    tip: "같은 용적률이라도 층고가 높으면 층수가 줄어듭니다. 고급 오피스는 층고 4m 이상으로 쾌적하지만, 같은 연면적에서 층수는 적어집니다.",
    relatedSlugs: ["floor-area-ratio", "zoning-district"],
    category: "regulation",
  },
  {
    slug: "sunlight-restriction",
    title: "일조권 사선제한",
    subtitle: "이웃 건물의 햇빛을 보장하기 위한 건축 규제",
    definition:
      "일조권 사선제한은 건물이 이웃 대지의 일조를 방해하지 않도록 건물 높이와 형태를 제한하는 규제입니다. 인접 대지 경계선으로부터 일정 거리를 두고, 높아질수록 뒤로 물러나야 합니다.",
    formula: "높이 제한 = 정북방향 인접경계선 이격거리 × 2 (일반주거지역 기준)",
    example:
      "일반주거지역에서 정북방향 인접 대지 경계선에서 4m 떨어진 지점이면, 해당 위치에서 건물 높이는 최대 8m까지 가능합니다. 이 때문에 주거건물 상층부가 계단식으로 뒤로 빠지는 형태가 됩니다.",
    tip: "일조권 사선제한은 정북방향에만 적용됩니다. 남향 건물이 유리한 이유 중 하나입니다. 이 제한 때문에 실제 건축 가능한 층수가 용적률 한도보다 적을 수 있습니다.",
    relatedSlugs: ["building-coverage-ratio", "floor-height"],
    category: "regulation",
  },
  {
    slug: "parking-requirement",
    title: "주차장 법정대수",
    subtitle: "건물 규모에 따라 반드시 확보해야 하는 주차 공간",
    definition:
      "건축법에 따라 건물의 용도와 면적에 따라 일정 수 이상의 주차장을 확보해야 합니다. 주차장은 지하에 설치하는 것이 일반적이며, 주차장 면적은 용적률 산정에서 제외됩니다.",
    formula: "주거: 세대당 1대 이상 (전용면적 60m² 초과 시) | 근린생활시설: 150m²당 1대",
    example:
      "30세대 아파트를 지으면 최소 30대의 주차 공간이 필요합니다. 1대당 약 25~30m²가 필요하므로, 지하 주차장 면적만 750~900m²에 달합니다. 이 비용은 건축비에 상당한 비중을 차지합니다.",
    tip: "주차장 면적은 용적률에 포함되지 않지만, 건축비에는 포함됩니다. 지하 1층 시공비는 지상의 1.5~2배에 달하므로, 주차 대수가 많을수록 사업비가 크게 증가합니다.",
    relatedSlugs: ["construction-cost", "floor-area-ratio"],
    category: "regulation",
  },
  {
    slug: "landscaping-area",
    title: "조경면적",
    subtitle: "건축 시 반드시 확보해야 하는 녹지 공간",
    definition:
      "대지면적이 200m² 이상인 건축물을 지을 때는 대지의 일정 비율 이상을 조경(녹지) 면적으로 확보해야 합니다. 조경은 식재, 잔디, 화단, 소공원 등을 포함합니다.",
    formula: "조경면적 = 대지면적 × 조경비율 | 주거지역: 대지면적의 15% 이상 (연면적 2,000m² 이상 시)",
    example:
      "500m² 대지에 연면적 2,000m² 이상 건물을 짓는다면, 최소 75m²(15%)를 조경으로 확보해야 합니다. 이 면적에는 건물을 지을 수 없으므로 실제 활용 가능한 건축면적이 줄어듭니다.",
    tip: "조경면적 확보 의무는 건폐율에 직접 영향을 줍니다. 건폐율 상한이 60%여도 조경 15%를 확보하면 실제로는 25%가 비건축 면적이 됩니다. 옥상 조경으로 일부 대체할 수 있는 경우도 있습니다.",
    relatedSlugs: ["building-coverage-ratio", "land-area"],
    category: "regulation",
  },
];

export function getConceptBySlug(slug: string): Concept | undefined {
  return concepts.find((c) => c.slug === slug);
}

export function getRelatedConcepts(concept: Concept): Concept[] {
  return concept.relatedSlugs
    .map((slug) => getConceptBySlug(slug))
    .filter((c): c is Concept => c !== undefined);
}
