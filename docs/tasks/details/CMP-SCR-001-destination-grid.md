# CMP-SCR-001-destination-grid — 국내·해외 여행지 Card Grid + 테마 필터

```task-meta
{
  "task_id": "CMP-SCR-001-destination-grid",
  "type": "component",
  "depends_on": [
    "DATA-DESTINATIONS",
    "CMP-COMMON-FAVORITES-SHARE",
    "CMP-COMMON-EMPTY-STATE"
  ],
  "requirements": [
    "REQ-FUNC-001",
    "REQ-FUNC-002",
    "REQ-FUNC-005",
    "REQ-FUNC-009",
    "REQ-FUNC-010",
    "REQ-FUNC-068",
    "REQ-NF-006"
  ]
}
```

## Context
이 Task는 SCR-001 화면이 필요로 하는 '국내·해외 여행지 Card Grid + 테마 필터' 기능을 제공한다. `TASKS/00_TASK_LIST.md`의 기존 Task 정의를 그대로 계승하며 신규 구현 범위를 추가하지 않는다.

## Project Scope
`docs/PROJECT_SCOPE.md` §2 화면 범위, §3 REQ-FUNC 요구사항 처리

## Requirement Ref
- 원본 참조(TASKS/00_TASK_LIST.md): REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-005, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-068, REQ-NF-006
- 정규화된 Requirement ID: REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-005, REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-068, REQ-NF-006

## Screen / Route / Page Entry
- Screen: SCR-001
- Route: `/`
- Page Entry: `src/app/page.tsx`(PO-SCR-001이 조립)

## Design Ref
- `design-reference/D-001/DESIGN.md` § Destination Card
- `design-reference/UI_CONTRACT.md` SCR-001 영역 순서·주요 Component·금지 기능 표

## Depends On
- DATA-DESTINATIONS
- CMP-COMMON-FAVORITES-SHARE
- CMP-COMMON-EMPTY-STATE

## Expected Files
`src/components/screens/scr001/DestinationGrid.tsx`, `src/components/common/DestinationCard.tsx`

## Functional AC
- 국내 6개, 해외 6개(국기 배지 포함) `card.destination`을 표시한다(콘텐츠 계약).
  - 국가·도시·계절·테마·기간 필터를 AND 조건으로 클라이언트에서 적용한다(REQ-FUNC-002).
  - 테마 Chip(6개) 선택 시 목록이 필터링된다(REQ-FUNC-002). 필터 상태는 `useSearchParams` 기반으로 URL에 반영되며 새로고침·공유 시 복원된다(REQ-FUNC-010, 허용 키만 직렬화).
  - 필터 결과 0건이면 `CMP-COMMON-EMPTY-STATE`(조건 완화 안내 + 전체 초기화 버튼)로 대체한다(REQ-FUNC-005).
  - 즐겨찾기 아이콘 버튼은 `CMP-COMMON-FAVORITES-SHARE` 훅을 사용해 localStorage에 중복 없이 토글한다(REQ-FUNC-068).

## Visual AC
카드 이미지 4:3, `{rounded.lg}` 클리핑, `Next/Image` 반응형+lazy(REQ-NF-006). Desktop 3열 → Tablet 2열 → Mobile 1열. 카드 정지 상태 그림자 없음, hover 시 `{elevation.card-hover}`.

## Security/Privacy AC
해당 없음.

## Test Cases
- [Functional AC] 국내 6개, 해외 6개(국기 배지 포함) `card.destination`을 표시한다(콘텐츠 계약). — Verify: TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- [Functional AC] 국가·도시·계절·테마·기간 필터를 AND 조건으로 클라이언트에서 적용한다(REQ-FUNC-002). — Verify: TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- [Functional AC] 테마 Chip(6개) 선택 시 목록이 필터링된다(REQ-FUNC-002). 필터 상태는 `useSearchParams` 기반으로 URL에 반영되며 새로고침·공유 시 복원된다(REQ-FUNC-010, 허용 키만 직렬화). — Verify: TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- [Functional AC] 필터 결과 0건이면 `CMP-COMMON-EMPTY-STATE`(조건 완화 안내 + 전체 초기화 버튼)로 대체한다(REQ-FUNC-005). — Verify: TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE
- [Visual AC] 카드 이미지 4:3, `{rounded.lg}` 클리핑, `Next/Image` 반응형+lazy(REQ-NF-006). Desktop 3열 → Tablet 2열 → Mobile 1열. 카드 정지 상태 그림자 없음, hover 시 `{elevation.card-hover}`. — Verify: TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE

## Verify
TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE

## Definition of Done
- Functional AC 전 항목을 충족한다.
- Visual AC 전 항목을 충족한다.
- Verify에 명시된 검증(`TEST-E2E-PUBLIC-SMOKE, TEST-A11Y-AXE`)을 통과한다.
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.

## Forbidden
- Expected Files 목록 밖의 파일을 만들거나 수정하지 않는다.
