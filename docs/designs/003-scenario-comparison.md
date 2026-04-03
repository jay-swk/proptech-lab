# Design: 시나리오 비교 & 실제 사례 프리셋

> CPS Framework | 2026-04-03 | Phase: Design
> Plan: plans/003-scenario-comparison.md

---

## Context (설계 배경)

### Plan 요약
- **P1**: 단일 시나리오만 볼 수 있어 비교 불가
- **P2**: 초보자가 현실적 값을 모름 → 실제 사례 프리셋 필요
- **P3**: "같은 땅에 주거 vs 상업" 비교가 학습 효과 극대화

### 설계 원칙
1. 기존 스토어 구조 유지, savedScenario만 추가
2. 비교는 최대 2개 (현재 vs 저장)
3. 프리셋 로드 = setZoningType + 모든 파라미터 일괄 변경

---

## Problem (설계 과제)

### D1. 시나리오 스냅샷 구조
- 현재 시뮬레이터 전체 상태(params + zoningType + results + profitResults)를 스냅샷으로 저장
- 저장된 스냅샷은 읽기 전용 (수정 불가)

### D2. 프리셋 로드와 기존 상태의 충돌
- 프리셋 로드 시 zoningType + 4개 params를 한 번에 변경
- setZoningType의 클램핑 로직과 충돌 방지: 프리셋 값은 이미 상한 내이므로 별도 액션 필요

### D3. 비교 UI의 반응형 대응
- 데스크탑: 가로 2열 비교
- 모바일: 세로 스택, 스와이프 가능할 필요 없음 (간단하게)

---

## Solution (설계 상세)

### 데이터 모델

#### 실제 사례 프리셋 — `calculations.ts`

```typescript
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
```

#### 시나리오 스냅샷 — `simulatorStore.ts`

```typescript
interface ScenarioSnapshot {
  label: string;
  zoningType: ZoningType;
  params: SimulatorParams;
  results: SimulatorResults;
  profitParams: ProfitParams;
  profitResults: ProfitResults;
}
```

### 스토어 확장

```typescript
interface SimulatorStore {
  // 기존 필드...
  savedScenario: ScenarioSnapshot | null;
  saveScenario: (label?: string) => void;
  clearScenario: () => void;
  loadPreset: (preset: RealWorldPreset) => void;
}
```

**`loadPreset` 동작**:
1. `zoningType` = preset.zoningType
2. `params` = preset.params
3. `profitParams` = DEFAULT_PROFIT_PARAMS[preset의 usageCategory]
4. `results` = calculate(params)
5. `profitResults` = calculateProfit(...)

**`saveScenario` 동작**:
- 현재 상태 전체를 ScenarioSnapshot으로 복사

### 컴포넌트 설계

#### RealWorldPresets

```
┌─────────────────────────────────────────────────┐
│ 📍 실제 사례로 시작하기                           │
│                                                  │
│ [강남 단독] [마포 다세대] [홍대 근생]               │
│ [강남역 오피스] [성수 카페] [은평 빌라]             │
└─────────────────────────────────────────────────┘
```

- **위치**: ZoningSelector 위 (시뮬레이터 최상단)
- 6개 버튼 (2행 3열, 모바일에서 3행 2열)
- 활성 프리셋 하이라이트 (현재 값이 프리셋과 정확히 일치할 때만)
- 클릭 시 `loadPreset()` 호출

#### ScenarioComparison

```
┌──────────────────────────────────────────────┐
│ 📊 시나리오 비교          [현재 저장] [비교 삭제] │
│ ─────────────────────────────────────────── │
│                 저장된 A    │    현재 B       │
│ 용도지역        제2종 일반    일반상업         │
│ 연면적          990m²       6,000m²    ▲    │
│ 건축비          20억 9,650   144억 6,550 ▲   │
│ 월 임대수익     499만        4,838만    ▲    │
│ 표면 수익률     2.9%         4.0%      ▲    │
│ 투자회수        41.7년       24.9년    ▲    │
└──────────────────────────────────────────────┘
```

- **위치**: 시뮬레이터 하단 (전체 너비)
- 저장된 시나리오가 없으면: "현재 조건을 저장하고 다른 조건과 비교해보세요" + 저장 버튼
- 비교 시 더 유리한 값에 ▲ 화살표 (녹색)
- 비교 기준: 수익률 높을수록 ▲, 회수기간 짧을수록 ▲, 건축비 낮을수록 ▲

### 데이터 계약

| 필드 | 비교 방향 | 표시 형식 |
|------|----------|----------|
| 용도지역 | 비교 안 함 (텍스트) | 프리셋 한글명 |
| 연면적 | 높을수록 ▲ | X,XXXm² |
| 예상 건축비 | 낮을수록 ▲ | X억 Y만원 |
| 월 임대수익 | 높을수록 ▲ | X,XXX만원 |
| 표면 수익률 | 높을수록 ▲ | X.X% |
| 투자회수 기간 | 짧을수록 ▲ | X.X년 |

---

## Sprint Contract

### Sprint 1: 실제 사례 프리셋 (S2)

| # | Done 조건 | 검증 방법 | 검증 명령 | 우선순위 |
|---|----------|----------|----------|---------|
| 1-1 | 6개 프리셋 버튼이 시뮬레이터에 표시된다 | 페이지 렌더링 | `pnpm build` 성공 | Critical |
| 1-2 | "강남역 오피스" 클릭 시 용도지역=일반상업, 대지면적=500, 용적률=1000, 건폐율=80, 층수=15로 설정된다 | 코드 확인 + 수동 확인 | `grep -r "gangnam-office" libs/` | Critical |
| 1-3 | 프리셋 로드 후 수익 단가가 해당 용도 기본값으로 변경된다 | 수동 확인 | `pnpm build` 성공 | Critical |

### Sprint 2: 시나리오 비교 (S1)

| # | Done 조건 | 검증 방법 | 검증 명령 | 우선순위 |
|---|----------|----------|----------|---------|
| 2-1 | "현재 저장" 버튼이 비교 섹션에 표시된다 | 페이지 렌더링 | `pnpm build` 성공 | Critical |
| 2-2 | 저장 후 값 변경 시 2열 비교 테이블이 표시된다 | 수동 확인 | 수동 확인 | Critical |
| 2-3 | 더 유리한 값에 시각적 표시(▲)가 된다 | 수동 확인 | 수동 확인 | Nice-to-have |
| 2-4 | "비교 삭제" 클릭 시 비교가 초기화된다 | 수동 확인 | 수동 확인 | Critical |

---

## 관통 검증 조건 (E2E)

| # | 시작점 | 종착점 | 우선순위 |
|---|--------|--------|---------|
| 1 | "강남 단독주택지" 프리셋 클릭 | 모든 슬라이더 + 3D + 수익 결과가 해당 값으로 갱신 | Critical |
| 2 | 프리셋 로드 → "현재 저장" → 다른 프리셋 로드 | 비교 테이블에 두 시나리오 나란히 표시 | Critical |
| 3 | 비교 중 슬라이더 변경 | "현재" 열만 실시간 갱신, 저장된 열은 고정 | Critical |

---

## 역방향 검증 체크리스트
- [x] P1 → S1: 시나리오 2개 비교 가능
- [x] P2 → S2: 6개 실제 사례 프리셋
- [x] P3 → S1+S2: 프리셋 A 저장 → 프리셋 B 로드 → 비교 = 최고의 학습 경험
- [x] 기존 기능 보존: 용도지역/수익분석/3D/개념 — 변경 없음
