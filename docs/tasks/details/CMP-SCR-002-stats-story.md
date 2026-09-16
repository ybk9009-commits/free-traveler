# CMP-SCR-002-stats-story — 여행 지표 + 소개·철학

```task-meta
{
  "task_id": "CMP-SCR-002-stats-story",
  "type": "component",
  "depends_on": [
    "DATA-REPRESENTATIVE"
  ],
  "requirements": [
    "REQ-FUNC-058"
  ]
}
```

## Context
이 Task는 SCR-002 화면이 필요로 하는 '여행 지표 + 소개·철학' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-058
- 정규화된 Requirement ID: REQ-FUNC-058

## Screen / Route / Page Entry
- Screen: SCR-002
- Route: `/about`
- Page Entry: `src/app/about/page.tsx`(PO-SCR-002가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Section별 제목·설명·본문·CTA 계층과 시각적 리듬
- `design-reference/UI_CONTRACT.md` SCR-002 영역 순서·주요 Component·금지 기능 표

## Depends On
- DATA-REPRESENTATIVE

## Expected Files
`src/components/screens/scr002/StatsStory.tsx`

## Functional AC
지표 카드 3개("50+ Trips"/"30+ Countries"/대륙 수) + 소개/여행 철학/편집 원칙 문단 2개 이상을 표시한다(REQ-FUNC-058).

## Visual AC
지표 카드 Grid(3열) + 텍스트 중심 좌우 분할.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] 지표 카드 3개("50+ Trips"/"30+ Countries"/대륙 수) + 소개/여행 철학/편집 원칙 문단 2개 이상을 표시한다(REQ-FUNC-058). — Verify: TEST-E2E-PUBLIC-SMOKE
- [Visual AC] 지표 카드 Grid(3열) + 텍스트 중심 좌우 분할. — Verify: TEST-E2E-PUBLIC-SMOKE
- Depends On 목록의 선행 Task가 모두 완료된 상태에서 통합 동작을 확인한다. Verify: TEST-E2E-PUBLIC-SMOKE

## Verify
TEST-E2E-PUBLIC-SMOKE

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-PUBLIC-SMOKE`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
