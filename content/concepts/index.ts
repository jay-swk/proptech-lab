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
    relatedSlugs: ["building-coverage-ratio", "land-area"],
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
    relatedSlugs: ["floor-area-ratio", "land-area"],
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
];

export function getConceptBySlug(slug: string): Concept | undefined {
  return concepts.find((c) => c.slug === slug);
}

export function getRelatedConcepts(concept: Concept): Concept[] {
  return concept.relatedSlugs
    .map((slug) => getConceptBySlug(slug))
    .filter((c): c is Concept => c !== undefined);
}
