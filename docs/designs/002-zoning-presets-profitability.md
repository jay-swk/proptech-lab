# Design: 용도지역 프리셋 & 수익성 간이 분석

> CPS Framework | 2026-04-03 | Phase: Design
> Plan: plans/002-zoning-presets-profitability.md

---

## Context (설계 배경)

### Plan 요약
- **P1**: 용도지역 제약 미반영 → 비현실적 값 입력 가능
- **P2**: 수익 정보 없음 → 의사결정 불가
- **P3**: 용도지역/건축비/수익률 개념이 사전에 없음

### 설계 원칙
1. **기존 구조 최소 침습**: Zustand 스토어와 계산 모듈의 기존 패턴을 그대로 따름
2. **SSG 호환**: 모든 데이터 하드코딩, 외부 API 없음
3. **단위 일관성**: 내부 계산은 m², 표시 시 m²+평 병기

---

## Problem (설계 과제)

### D1. 슬라이더 범위 동적 변경
- 현재 `PARAM_RANGES`가 상수(`as const`)로 고정됨
- 용도지역 선택 시 `floorAreaRatio.max`와 `buildingCoverageRatio.max`를 동적으로 변경해야 함
- 현재 값이 새 상한보다 클 때 자동 클램핑 필요

### D2. 수익성 계산의 단위 변환
- 기존 계산은 모두 m² 기반
- 수익 단가는 "평" 기반 (부동산 관행)
- m² → 평 변환이 계산 로직에 들어가야 함

### D3. 용도지역과 수익 단가의 매핑
- 용도지역 9개 → 용도 카테고리 3개(주거/상업/공업)로 매핑
- 같은 "주거"여도 제1종 전용주거와 준주거의 단가가 다를 수 있으나, 간이 분석이므로 카테고리별 단일 단가 적용

### D4. 스토어 확장과 기존 코드 호환
- `SimulatorStore`에 새 상태 추가 시 기존 컴포넌트 영향 없어야 함
- `resetToDefault`가 새 상태도 초기화해야 함

---

## Solution (설계 상세)

### 아키텍처

```
사용자 입력
    │
    ▼
┌─────────────────┐     ┌──────────────────────┐
│ ZoningSelector   │────▶│ simulatorStore        │
│ (드롭다운)       │     │  .zoningType          │
└─────────────────┘     │  .params              │
                        │  .profitParams        │
┌─────────────────┐     │  .results             │
│ InputPanel       │────▶│  .profitResults       │
│ (슬라이더 4개)   │     └──────────┬───────────┘
└─────────────────┘                │
                                   ▼
                        ┌──────────────────────┐
                        │ calculations.ts       │
                        │  calculate()          │
                        │  calculateProfit()    │
                        │  ZONING_PRESETS       │
                        └──────────┬───────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼               ▼
             ┌──────────┐  ┌──────────────┐  ┌────────────────┐
             │OutputPanel│  │3D + Scenario │  │ProfitAnalysis  │
             │(기존)     │  │(기존)        │  │(신규)          │
             └──────────┘  └──────────────┘  └────────────────┘
```

### 데이터 모델

#### 용도지역 타입 & 프리셋 — `calculations.ts`에 추가

```typescript
export type ZoningType =
  | "residential-1-exclusive"   // 제1종 전용주거
  | "residential-2-exclusive"   // 제2종 전용주거
  | "residential-1-general"     // 제1종 일반주거
  | "residential-2-general"     // 제2종 일반주거
  | "residential-3-general"     // 제3종 일반주거
  | "quasi-residential"         // 준주거
  | "general-commercial"        // 일반상업
  | "neighborhood-commercial"   // 근린상업
  | "quasi-industrial"          // 준공업
  | "custom";                   // 자유 입력

export type UsageCategory = "residential" | "commercial" | "industrial";

export interface ZoningPreset {
  type: ZoningType;
  label: string;               // 한글 표시명
  maxBCR: number;              // 건폐율 상한 (%)
  maxFAR: number;              // 용적률 상한 (%)
  description: string;         // 한 줄 설명
  usageCategory: UsageCategory; // 수익 계산용 카테고리
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
```

#### 수익성 계산 — `calculations.ts`에 추가

```typescript
export interface ProfitParams {
  constructionCostPerPyeong: number;  // 평당 건축비 (만원)
  monthlyRentPerPyeong: number;       // 평당 월임대료 (만원)
}

export interface ProfitResults {
  totalConstructionCost: number;      // 총 건축비 (만원)
  monthlyRentalIncome: number;        // 월 임대수익 (만원)
  annualRentalIncome: number;         // 연 임대수익 (만원)
  paybackYears: number;               // 투자회수 기간 (년)
  surfaceYield: number;               // 표면 수익률 (%)
}

// 카테고리별 기본 단가 (만원)
export const DEFAULT_PROFIT_PARAMS: Record<UsageCategory, ProfitParams> = {
  residential:  { constructionCostPerPyeong: 700, monthlyRentPerPyeong: 5 },
  commercial:   { constructionCostPerPyeong: 800, monthlyRentPerPyeong: 8 },
  industrial:   { constructionCostPerPyeong: 500, monthlyRentPerPyeong: 3 },
};

export function calculateProfit(
  actualFloorArea: number,
  profitParams: ProfitParams
): ProfitResults {
  const pyeong = actualFloorArea / 3.3058;
  const totalConstructionCost = pyeong * profitParams.constructionCostPerPyeong;
  const monthlyRentalIncome = pyeong * profitParams.monthlyRentPerPyeong;
  const annualRentalIncome = monthlyRentalIncome * 12;
  const paybackYears = totalConstructionCost > 0 && annualRentalIncome > 0
    ? totalConstructionCost / annualRentalIncome
    : 0;
  const surfaceYield = totalConstructionCost > 0
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
```

### 데이터 계약 (Data Contract)

| 필드 | 단위 | 포맷 | 변환 규칙 | 비고 |
|------|------|------|----------|------|
| landArea | m² | 정수 | 표시 시 `÷ 3.3058 = 평` 병기 | 기존 동일 |
| floorAreaRatio | % | 정수 | 없음 | 기존 동일 |
| buildingCoverageRatio | % | 정수 | 없음 | 기존 동일 |
| actualFloorArea | m² | 소수 1자리 | 수익 계산 시 `÷ 3.3058 = 평` | 기존 동일 |
| constructionCostPerPyeong | 만원/평 | 정수 | 입력 그대로 사용 | 신규 |
| monthlyRentPerPyeong | 만원/평 | 정수 | 입력 그대로 사용 | 신규 |
| totalConstructionCost | 만원 | 표시: `≥ 10000 → X억 Y만원` | `pyeong × 단가` | 신규 |
| monthlyRentalIncome | 만원 | 소수 없음, 쉼표 구분 | `pyeong × 월임대` | 신규 |
| paybackYears | 년 | 소수 1자리 | `건축비 ÷ 연수익` | 0이면 "산정 불가" |
| surfaceYield | % | 소수 1자리 | `연수익 ÷ 건축비 × 100` | 0이면 "산정 불가" |

**금액 표시 규칙**:
- 1억 이상: `X억 Y,YYY만원` (예: 23억 4,500만원)
- 1억 미만: `X,XXX만원` (예: 8,250만원)
- 0: `0원`

### 스토어 확장 — `simulatorStore.ts`

```typescript
interface SimulatorStore {
  // 기존
  params: SimulatorParams;
  results: SimulatorResults;
  updateParam: (key: keyof SimulatorParams, value: number) => void;
  resetToDefault: () => void;

  // 신규
  zoningType: ZoningType;
  profitParams: ProfitParams;
  profitResults: ProfitResults;
  setZoningType: (type: ZoningType) => void;
  updateProfitParam: (key: keyof ProfitParams, value: number) => void;
}
```

**`setZoningType` 동작**:
1. `zoningType` 업데이트
2. 해당 프리셋의 `usageCategory`로 `profitParams`를 기본값으로 리셋
3. 현재 `floorAreaRatio > preset.maxFAR`이면 → `floorAreaRatio = preset.maxFAR`로 클램핑
4. 현재 `buildingCoverageRatio > preset.maxBCR`이면 → `buildingCoverageRatio = preset.maxBCR`로 클램핑
5. 클램핑된 params로 `calculate()` 재실행
6. 새 `actualFloorArea`로 `calculateProfit()` 재실행

**`updateParam` 변경**:
- 기존 로직 유지 + `calculateProfit()` 호출 추가

**`resetToDefault` 변경**:
- `zoningType = "custom"`, `profitParams = DEFAULT_PROFIT_PARAMS.residential` 추가

### 컴포넌트 설계

#### ZoningSelector (신규)

```
┌─────────────────────────────────────────┐
│ 🏘️ 용도지역                    [▼ 선택] │
│ ─────────────────────────────────────── │
│ 중층 주거환경 조성 · 건폐율 60% 용적률 250% │
└─────────────────────────────────────────┘
```

- **위치**: InputPanel 상단 (건물 조건 설정 위)
- **구현**: `<select>` + 설명 텍스트
- Props 없음 — 스토어 직접 구독
- 드롭다운 옵션: `ZONING_PRESETS.map(p => <option>)`
- 선택 시 `setZoningType()` 호출
- 아래에 선택된 프리셋의 `description + maxBCR/maxFAR` 표시

#### InputPanel 수정

- `SliderInput`의 `max` prop을 동적으로 계산:
  ```typescript
  const activePreset = ZONING_PRESETS.find(p => p.type === zoningType);
  const dynamicRanges = {
    ...PARAM_RANGES,
    floorAreaRatio: { ...PARAM_RANGES.floorAreaRatio, max: activePreset?.maxFAR ?? 1500 },
    buildingCoverageRatio: { ...PARAM_RANGES.buildingCoverageRatio, max: activePreset?.maxBCR ?? 80 },
  };
  ```
- ZoningSelector를 InputPanel 내부 상단에 배치

#### ProfitAnalysis (신규)

```
┌─────────────────────────────────────────┐
│ 💰 수익성 간이 분석                      │
│ ─────────────────────────────────────── │
│ 단가 설정 (평 기준)                      │
│   건축비 [700] 만원/평  월임대 [5] 만원/평 │
│ ─────────────────────────────────────── │
│ 예상 건축비        23억 4,500만원        │
│ 예상 월 임대수익        500만원           │
│ 예상 연 임대수익      6,000만원           │
│ 투자회수 기간          39.1년             │
│ 표면 수익률             2.6%             │
│ ─────────────────────────────────────── │
│ ⚠️ 참고용 간이 분석입니다. 토지비, 세금,   │
│    대출이자 등이 미포함되어 실제 투자 판단의 │
│    근거로 사용할 수 없습니다.              │
└─────────────────────────────────────────┘
```

- **위치**: 시뮬레이터 우측 패널, ScenarioInterpretation 아래
- 단가 입력: 숫자 input 2개 (건축비, 월임대료)
- 결과: 5개 항목 표시
- 면책 배너: 하단 고정
- 에러 상태(건물 불가 등)에서는 결과 대신 "계산 불가" 표시

### 개념 사전 확장 — `content/concepts/index.ts`

3개 개념 추가:

| slug | title | category | relatedSlugs |
|------|-------|----------|-------------|
| `zoning-district` | 용도지역 | regulation | floor-area-ratio, building-coverage-ratio |
| `construction-cost` | 건축비 | finance | floor-area-ratio, rental-yield |
| `rental-yield` | 임대수익률 | finance | construction-cost, zoning-district |

### 에러 처리

| 상황 | 처리 |
|------|------|
| 건물 불가 (maxFloors === 0) | ProfitAnalysis에 "건물 불가 조건에서는 수익을 산정할 수 없습니다" 표시 |
| 연면적 0 | 모든 수익 결과 0, 회수기간/수익률은 "산정 불가" |
| 단가 0 입력 | 해당 결과 0, 나누기 0은 "산정 불가" |
| 단가 음수 입력 | min=0 제한으로 차단 |

---

## Sprint Contract (구현 전 검증 계약)

### Sprint 1: 용도지역 프리셋 (S1)

| # | Done 조건 | 검증 방법 | 검증 명령 | 우선순위 |
|---|----------|----------|----------|---------|
| 1-1 | 시뮬레이터에 용도지역 드롭다운이 표시된다 | 페이지 렌더링 확인 | `pnpm build` 성공 | Critical |
| 1-2 | "제2종 일반주거" 선택 시 용적률 슬라이더 max가 250으로 변경된다 | 브라우저에서 드롭다운 선택 후 슬라이더 확인 | `pnpm build && grep -r "maxFAR.*250" libs/` | Critical |
| 1-3 | 현재 용적률이 300이고 "제2종 일반주거"(상한 250) 선택 시 용적률이 250으로 자동 클램핑된다 | 스토어 로직 검증 | `pnpm build` 성공 + 수동 확인 | Critical |
| 1-4 | "자유 입력" 선택 시 기존과 동일하게 동작한다 (max: 1500/80) | 드롭다운 "자유 입력" 선택 후 슬라이더 확인 | `pnpm build` 성공 | Critical |
| 1-5 | 선택된 용도지역의 설명·상한이 드롭다운 아래에 표시된다 | UI 확인 | 수동 확인 | Nice-to-have |

### Sprint 2: 수익성 간이 분석 (S2)

| # | Done 조건 | 검증 방법 | 검증 명령 | 우선순위 |
|---|----------|----------|----------|---------|
| 2-1 | 시뮬레이터에 수익성 분석 패널이 표시된다 | 페이지 렌더링 확인 | `pnpm build` 성공 | Critical |
| 2-2 | 기본값(330m², 200%, 60%, 5층)에서 수익 결과가 올바르게 표시된다 | 수동 계산 대조: 연면적 990m² = 299.5평, 건축비 700×299.5=20억 9,650만원 | `pnpm build` 성공 + 수동 확인 | Critical |
| 2-3 | 용도지역 변경 시 단가가 자동 변경된다 (주거→상업 전환 시 건축비 700→800) | 드롭다운 변경 후 단가 필드 확인 | 수동 확인 | Critical |
| 2-4 | 단가를 사용자가 직접 수정할 수 있다 | 입력 필드 편집 확인 | 수동 확인 | Critical |
| 2-5 | 면책 문구가 패널 하단에 표시된다 | UI 확인 | `grep -r "참고용" components/` | Critical |
| 2-6 | 금액이 "X억 Y만원" 형식으로 표시된다 | UI에서 확인 | 수동 확인 | Nice-to-have |
| 2-7 | 건물 불가 상태에서 "산정 불가" 표시된다 | 건폐율>용적률 설정 후 확인 | 수동 확인 | Critical |

### Sprint 3: 개념 사전 확장 (S3)

| # | Done 조건 | 검증 방법 | 검증 명령 | 우선순위 |
|---|----------|----------|----------|---------|
| 3-1 | /concepts 페이지에 6개 카드가 표시된다 (기존 3 + 신규 3) | 페이지 렌더링 확인 | `pnpm build` 성공 (SSG 생성 확인) | Critical |
| 3-2 | /concepts/zoning-district 페이지가 정상 렌더링된다 | 빌드 시 정적 페이지 생성 확인 | `pnpm build && ls out/concepts/zoning-district/` | Critical |
| 3-3 | 각 신규 개념의 관련 개념 링크가 동작한다 | 관련 개념 클릭 시 해당 페이지 이동 | 수동 확인 | Nice-to-have |

---

## 관통 검증 조건 (End-to-End)

| # | 시작점 (사용자 행동) | 종착점 (결과 확인) | 우선순위 |
|---|---------------------|-------------------|---------|
| 1 | 용도지역 "일반상업" 선택 | 슬라이더 max 변경(BCR 80, FAR 1000) + 단가 변경(건축비 800, 월임대 8) + 수익 결과 재계산 | Critical |
| 2 | 슬라이더 값 변경 (층수 10 → 20) | 3D 건물 높이 변화 + 연면적 변경 + 수익 결과 실시간 재계산 | Critical |
| 3 | 용도지역 변경 → 값 클램핑 → 수익 | "제3종 일반주거"(FAR 300) 선택 → 용적률 500→300 클램핑 → 건축비·수익 재계산 → 3D 반영 | Critical |
| 4 | "기본값 초기화" 클릭 | 용도지역 "자유 입력" + 파라미터 기본값 + 단가 주거 기본값 + 수익 재계산 | Critical |

---

## 평가 기준 (Evaluation Criteria)

| 기준 | 내용 | 가중치 |
|------|------|--------|
| 기능 완성도 | Sprint Contract의 Critical 항목 100% 통과 | 50% |
| 데이터 관통 | E2E 4개 시나리오 모두 통과 | 25% |
| 설계 품질 | 기존 코드 패턴 준수, 새 타입이 calculations.ts에 집중 | 15% |
| 단순성 | 불필요한 추상화 없음, 컴포넌트 2개만 신규 | 10% |

---

## 역방향 검증 체크리스트

- [x] **P1 → S1**: 용도지역 프리셋 9개 + 자유 입력 → 슬라이더 동적 제한
- [x] **P2 → S2**: 건축비·임대수익·회수기간·수익률 5개 항목 표시
- [x] **P3 → S3**: 용도지역·건축비·임대수익률 3개 개념 추가
- [x] **Out of Scope**: 토지비, 세금, 대출, 지번 조회 — 모두 명시적 제외
- [x] **엣지 케이스**: 건물 불가(maxFloors=0), 단가 0, 클램핑, 자유 입력 복귀
- [x] **기존 기능 보존**: 3D, 경고 시스템, 개념 상세 페이지 — 변경 없음
