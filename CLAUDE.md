# PropTech Lab

프롭테크 인터랙티브 학습 서비스. 용적률 시뮬레이터 MVP.

## Language
- Claude는 사용자에게 항상 **한국어**로 응답한다.

## Stack
- Next.js 16 (App Router, SSG, output: export)
- TypeScript 6
- Tailwind CSS v4
- Motion 12 (motion/react)
- Zustand (상태관리)
- React Three Fiber + @react-three/drei (3D)
- pnpm

## Structure
- / — 랜딩 (서비스 소개 + CTA)
- /simulator — 용적률 시뮬레이터 (핵심)
- /concepts — 개념 카드 목록
- /concepts/[slug] — 개념 상세
- libs/simulator/calculations.ts — 순수 계산 함수
- store/simulatorStore.ts — Zustand 스토어
- content/concepts/index.ts — 개념 데이터

## 계산 로직
- buildingArea = landArea × (BCR / 100)
- totalFloorArea = landArea × (FAR / 100)
- maxFloors = floor(totalFloorArea / buildingArea)

## Build & Deploy
```bash
pnpm dev -p 4300          # 로컬 개발
pnpm build                # 정적 빌드 (out/)
```
- GitHub Pages 배포: main push → GitHub Actions 자동 빌드
- URL: https://jay-swk.github.io/proptech-lab/
- basePath: /proptech-lab

## 주의사항
- R3F 컴포넌트는 반드시 dynamic import + ssr: false
- 계산 로직 변경 시 libs/simulator/calculations.ts만 수정

## Git Convention
feat: 새 기능 | fix: 버그 수정 | update: 기존 개선 | docs: 문서 | chore: 설정
