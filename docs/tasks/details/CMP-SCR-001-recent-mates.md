# CMP-SCR-001-recent-mates — 최근 동행 카드 3개/Empty State

```task-meta
{
  "task_id": "CMP-SCR-001-recent-mates",
  "type": "component",
  "depends_on": [
    "DB-ACCESS",
    "CMP-COMMON-EMPTY-STATE"
  ],
  "requirements": []
}
```

## Context
이 Task는 SCR-001 화면이 필요로 하는 '최근 동행 카드 3개/Empty State' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): —(디자인 계약: D-001 §화면별 Section 순서, SCR-004 데이터 재사용)
- 정규화된 Requirement ID: — (없음, 조립/기반 Task)

## Screen / Route / Page Entry
- Screen: SCR-001
- Route: `/`
- Page Entry: `src/app/page.tsx`(PO-SCR-001이 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Loading·Empty·Error 상태(완성형 Empty State 3요소)
- `design-reference/UI_CONTRACT.md` SCR-001 영역 순서·주요 Component·금지 기능 표

## Depends On
- DB-ACCESS
- CMP-COMMON-EMPTY-STATE

## Expected Files
`src/components/screens/scr001/RecentMates.tsx`

## Functional AC
- `MATE_POST`에서 `status=OPEN`인 최신 3건을 `card.mate`로 표시한다. "전체 동행 보기" CTA는 `/mates`로 이동한다.
  - 0건이면 `CMP-COMMON-EMPTY-STATE`(상황 설명 + 참가 방법 3줄 요약 + "동행 글 작성하기" CTA → `/travel-tools` 동행 탭)로 대체한다.

## Visual AC
Card Grid 3열(Mobile 1열), 모집상태 배지(모집중/마감).

## Security/Privacy AC
작성자 연락처를 노출하지 않는다(REQ-FUNC-033과 동일 원칙 재사용).

## Test Cases
- [Functional AC] `MATE_POST`에서 `status=OPEN`인 최신 3건을 `card.mate`로 표시한다. "전체 동행 보기" CTA는 `/mates`로 이동한다. — Verify: TEST-E2E-PUBLIC-SMOKE
- [Functional AC] 0건이면 `CMP-COMMON-EMPTY-STATE`(상황 설명 + 참가 방법 3줄 요약 + "동행 글 작성하기" CTA → `/travel-tools` 동행 탭)로 대체한다. — Verify: TEST-E2E-PUBLIC-SMOKE
- [Visual AC] Card Grid 3열(Mobile 1열), 모집상태 배지(모집중/마감). — Verify: TEST-E2E-PUBLIC-SMOKE
- [Security/Privacy AC] 작성자 연락처를 노출하지 않는다(REQ-FUNC-033과 동일 원칙 재사용). — Verify: TEST-E2E-PUBLIC-SMOKE

## Verify
TEST-E2E-PUBLIC-SMOKE

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-PUBLIC-SMOKE`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
