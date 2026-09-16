# CMP-SCR-004-list — 동행 목록 Card Grid

```task-meta
{
  "task_id": "CMP-SCR-004-list",
  "type": "component",
  "depends_on": [
    "CMP-SCR-004-filter",
    "DB-ACCESS",
    "CMP-COMMON-FAVORITES-SHARE",
    "CMP-COMMON-EMPTY-STATE"
  ],
  "requirements": [
    "REQ-FUNC-030",
    "REQ-FUNC-033",
    "REQ-FUNC-037",
    "REQ-FUNC-069"
  ]
}
```

## Context
이 Task는 SCR-004 화면이 필요로 하는 '동행 목록 Card Grid' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-037(축소), REQ-FUNC-069
- 정규화된 Requirement ID: REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-037, REQ-FUNC-069

## Screen / Route / Page Entry
- Screen: SCR-004
- Route: `/mates`
- Page Entry: `src/app/mates/page.tsx`(PO-SCR-004가 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Destination Card
- `design-reference/UI_CONTRACT.md` SCR-004 영역 순서·주요 Component·금지 기능 표

## Depends On
- CMP-SCR-004-filter
- DB-ACCESS
- CMP-COMMON-FAVORITES-SHARE
- CMP-COMMON-EMPTY-STATE

## Expected Files
`src/components/screens/scr004/MateList.tsx`

## Functional AC
- 최근 등록순 최대 8개를 `card.mate`로 우선 노출하고 "더 보기"로 이어서 확인한다(콘텐츠 계약).
  - 종료일 경과 글은 조회 시점에 CLOSED로 계산해 배지에 반영한다(REQ-FUNC-037 축소).
  - 작성자 정보는 표시하되 연락처는 노출하지 않는다(REQ-FUNC-033).
  - URL 공유 버튼(Web Share API, 실패 시 클립보드 복사) 제공(REQ-FUNC-069).
  - 검색 결과 0건/전체 글 0건이면 `CMP-COMMON-EMPTY-STATE`("조건에 맞는 동행글이 아직 없어요" + 필터 초기화 + "첫 동행 글 작성하기" CTA)로 대체한다.

## Visual AC
Card Grid, 모집상태 배지(모집중/마감).

## Security/Privacy AC
목록 API 응답에 이메일·전화번호를 포함하지 않는다.

## Test Cases
- [Functional AC] 최근 등록순 최대 8개를 `card.mate`로 우선 노출하고 "더 보기"로 이어서 확인한다(콘텐츠 계약). — Verify: TEST-E2E-MATE-AUTH, TEST-A11Y-AXE
- [Functional AC] 종료일 경과 글은 조회 시점에 CLOSED로 계산해 배지에 반영한다(REQ-FUNC-037 축소). — Verify: TEST-E2E-MATE-AUTH, TEST-A11Y-AXE
- [Functional AC] 작성자 정보는 표시하되 연락처는 노출하지 않는다(REQ-FUNC-033). — Verify: TEST-E2E-MATE-AUTH, TEST-A11Y-AXE
- [Functional AC] URL 공유 버튼(Web Share API, 실패 시 클립보드 복사) 제공(REQ-FUNC-069). — Verify: TEST-E2E-MATE-AUTH, TEST-A11Y-AXE
- [Visual AC] Card Grid, 모집상태 배지(모집중/마감). — Verify: TEST-E2E-MATE-AUTH, TEST-A11Y-AXE
- [Security/Privacy AC] 목록 API 응답에 이메일·전화번호를 포함하지 않는다. — Verify: TEST-E2E-MATE-AUTH, TEST-A11Y-AXE

## Verify
TEST-E2E-MATE-AUTH, TEST-A11Y-AXE

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Security/Privacy AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-MATE-AUTH, TEST-A11Y-AXE`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
