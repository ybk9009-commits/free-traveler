# CMP-SCR-002-timeline — 여행 타임라인 6개

```task-meta
{
  "task_id": "CMP-SCR-002-timeline",
  "type": "component",
  "depends_on": [
    "DATA-REPRESENTATIVE"
  ],
  "requirements": [
    "REQ-FUNC-060"
  ]
}
```

## Context
이 Task는 SCR-002 화면이 필요로 하는 '여행 타임라인 6개' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-060
- 정규화된 Requirement ID: REQ-FUNC-060

## Screen / Route / Page Entry
- Screen: SCR-002
- Route: `/about`
- Page Entry: `src/app/about/page.tsx`(PO-SCR-002가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` components.card-timeline-item 토큰
- `design-reference/UI_CONTRACT.md` SCR-002 영역 순서·주요 Component·금지 기능 표

## Depends On
- DATA-REPRESENTATIVE

## Expected Files
`src/components/screens/scr002/Timeline.tsx`

## Functional AC
`card.timeline-item`(연도 캡션 + 장소 제목 + 2줄 요약) 6개 이상을 시간 순으로 표시한다(REQ-FUNC-060, 콘텐츠 계약).

## Visual AC
세로 Timeline 레이아웃.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] `card.timeline-item`(연도 캡션 + 장소 제목 + 2줄 요약) 6개 이상을 시간 순으로 표시한다(REQ-FUNC-060, 콘텐츠 계약). — Verify: TEST-E2E-PUBLIC-SMOKE
- [Visual AC] 세로 Timeline 레이아웃. — Verify: TEST-E2E-PUBLIC-SMOKE
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
