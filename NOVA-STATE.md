# Nova State

## Current
- **Goal**: 리뷰에서 발견된 컨텐츠/기능 갭 해소
- **Phase**: building
- **Blocker**: none

## Tasks
| Task | Status | Verdict | Note |
|------|--------|---------|------|
| 용도지역 프리셋 & 수익성 분석 | done | PASS | commit 0387161 |
| 시나리오 비교 & 실제 사례 프리셋 | done | PASS | commit f29d8a3 |
| 개념별 인터랙티브 퀴즈 | done | PASS | commit 795ca2a |
| 기본 층수 버그 수정 | done | PASS | commit 3d4e34e |
| 404/에러 페이지 구현 | todo | - | Critical |
| OG 메타데이터 추가 | todo | - | Critical |
| 랜딩 features 업데이트 | todo | - | Warning |
| 다크모드 토글 추가 | todo | - | Warning |
| 접근성(aria-label) 강화 | todo | - | Warning |
| 개념 사전 확장 (4개+) | todo | - | Info |

## Recently Done (최근 3개만)
| Task | Completed | Verdict | Ref |
|------|-----------|---------|-----|
| 개념 퀴즈 (18문제) | 2026-04-03 | PASS | commit 795ca2a |
| 시나리오 비교 + 6개 사례 프리셋 | 2026-04-03 | PASS | commit f29d8a3 |
| 용도지역 프리셋 + 수익성 분석 | 2026-04-03 | PASS | commit 0387161 |

## Known Risks
| 위험 | 심각도 | 상태 |
|------|--------|------|
| SNS 공유 시 미리보기 빈 상태 | Critical | 미해결 |
| 404 페이지 미구현 | Critical | 미해결 |

## Known Gaps (미커버 영역)
| 영역 | 미커버 내용 | 우선순위 |
|------|-----------|----------|
| 테스트 | 자동 테스트 없음 | medium |
| 접근성 | aria-label, 키보드 네비게이션 | medium |
| 컨텐츠 | 개념 4개+ 추가 필요 | medium |
| SEO | sitemap.xml, robots.txt | low |

## Last Activity
- /nova:review → CONDITIONAL — 부족한 컨텐츠 & 기능 파악 | 2026-04-03

## Refs
- Plan: docs/plans/002-*.md, 003-*.md, 004-*.md
- Design: docs/designs/002-*.md, 003-*.md
- Last Verification: /nova:review CONDITIONAL (Critical 2, Warning 4, Info 3)
