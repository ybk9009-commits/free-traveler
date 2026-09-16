# CMP-COMMON-RESPONSIVE-LAYOUT — 320px~Desktop 반응형 레이아웃 규칙

```task-meta
{
  "task_id": "CMP-COMMON-RESPONSIVE-LAYOUT",
  "type": "component",
  "depends_on": [],
  "requirements": [
    "REQ-FUNC-065",
    "REQ-NF-006"
  ]
}
```

## Context
이 Task는 공통(5개 Screen) 화면이 필요로 하는 '320px~Desktop 반응형 레이아웃 규칙' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-065, REQ-NF-006
- 정규화된 Requirement ID: REQ-FUNC-065, REQ-NF-006

## Screen / Route / Page Entry
- Screen: 공통(5개 Screen)
- Route: 공통(5개 Route)
- Page Entry: `src/app/layout.tsx`, `src/app/globals.css`

## Design Ref
- `design-reference/D-001/DESIGN.md` § Desktop·Mobile 규칙, Page Section 최대 폭

## Depends On
— (없음)

## Expected Files
`src/app/globals.css`(Tailwind 기반 토큰/브레이크포인트 정의), `tailwind.config.ts`(필요 시)

## Functional AC
- `design-reference/D-001/DESIGN.md`의 Color/Typography/Spacing/Radius/Shadow 토큰을 Tailwind 테마로 등록한다.
  - Desktop 1440px 기준·콘텐츠 1200-1280px 중앙 정렬, Mobile 390px·좌우 16-20px 여백, Tablet 744-1279px 2열 전환 규칙을 전역 유틸로 제공한다.
  - 320px부터 가로 스크롤·겹침 없이 핵심 기능이 동작해야 한다(REQ-FUNC-065 AC).

## Visual AC
모든 화면이 D-001 토큰만 사용하고 임의 색상을 추가하지 않는다(D-001 § Do Not).

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] `design-reference/D-001/DESIGN.md`의 Color/Typography/Spacing/Radius/Shadow 토큰을 Tailwind 테마로 등록한다. — Verify: TEST-A11Y-AXE(뷰포트 포함), TEST-E2E-PUBLIC-SMOKE(모바일 뷰포트)
- [Functional AC] Desktop 1440px 기준·콘텐츠 1200-1280px 중앙 정렬, Mobile 390px·좌우 16-20px 여백, Tablet 744-1279px 2열 전환 규칙을 전역 유틸로 제공한다. — Verify: TEST-A11Y-AXE(뷰포트 포함), TEST-E2E-PUBLIC-SMOKE(모바일 뷰포트)
- [Functional AC] 320px부터 가로 스크롤·겹침 없이 핵심 기능이 동작해야 한다(REQ-FUNC-065 AC). — Verify: TEST-A11Y-AXE(뷰포트 포함), TEST-E2E-PUBLIC-SMOKE(모바일 뷰포트)
- [Visual AC] 모든 화면이 D-001 토큰만 사용하고 임의 색상을 추가하지 않는다(D-001 § Do Not). — Verify: TEST-A11Y-AXE(뷰포트 포함), TEST-E2E-PUBLIC-SMOKE(모바일 뷰포트)

## Verify
TEST-A11Y-AXE(뷰포트 포함), TEST-E2E-PUBLIC-SMOKE(모바일 뷰포트)

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-A11Y-AXE(뷰포트 포함), TEST-E2E-PUBLIC-SMOKE(모바일 뷰포트)`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
